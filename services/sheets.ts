import { AppData } from '../types';

// --- CONFIGURATION ---
// Set to a valid Google OAuth Client ID (ending in .apps.googleusercontent.com) to enable cloud sync
const CLIENT_ID = '';
const SPREADSHEET_ID = '190UEY3iBtxxAHibi0NUGI8IDu_2Jt5oeBBO_j_mSnZw';
const SHEET_NAME = 'Sheet1'; 

let tokenClient: any = null;
let accessToken: string | null = null;

export const isGoogleConfigured = (): boolean => {
  return typeof CLIENT_ID === 'string' && CLIENT_ID.endsWith('.apps.googleusercontent.com');
};

// Initialize Google OAuth Client safely
export const initGoogleAuth = (callback: (success: boolean, error?: string) => void) => {
  if (!isGoogleConfigured()) {
    // Gracefully report unconfigured without throwing or breaking local auth
    callback(false, "Google OAuth Client ID is not configured. Local persistence will be used.");
    return;
  }

  if (typeof window === 'undefined' || !(window as any).google?.accounts?.oauth2) {
    callback(false, "Google Identity Services not loaded");
    return;
  }

  try {
    tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: 'https://www.googleapis.com/auth/spreadsheets',
      callback: (tokenResponse: any) => {
        if (tokenResponse && tokenResponse.access_token) {
          accessToken = tokenResponse.access_token;
          callback(true);
        } else {
          callback(false, "Failed to get access token");
        }
      },
      error_callback: (err: any) => {
        console.warn("Google Auth Warning:", err);
        callback(false, err?.message || "Auth Error");
      }
    });
  } catch (e: any) {
    console.warn("Notice: Google Auth initialization skipped", e);
    callback(false, e?.message);
  }
};

export const signInToGoogle = () => {
  if (tokenClient && isGoogleConfigured()) {
    try {
      tokenClient.requestAccessToken();
    } catch (e) {
      console.warn("Failed to request Google access token", e);
    }
  } else {
    console.info("Google OAuth is not configured with a valid client ID. Local storage is active.");
  }
};

export const isGoogleAuthorized = () => !!accessToken;

// --- Database Operations ---

const fetchUserDirectory = async () => {
  if (!accessToken) throw new Error("Google Auth required");

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A:C`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
  
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || "Failed to fetch directory");
  }

  const json = await res.json();
  return json.values || []; 
};

export const dbLogin = async (email: string, password: string): Promise<{ success: boolean; data?: AppData; name?: string; message?: string }> => {
  if (!isGoogleConfigured() || !accessToken) {
    return { success: false, message: "Google Cloud Sync not active." };
  }

  try {
    const rows = await fetchUserDirectory();
    const rowIndex = rows.findIndex((row: string[]) => row[0]?.toLowerCase() === email.toLowerCase());
    
    if (rowIndex === -1) {
      return { success: false, message: "User not found in Sheet." };
    }

    const storedPassword = rows[rowIndex][1];
    if (storedPassword !== password) {
      return { success: false, message: "Invalid password." };
    }

    const name = rows[rowIndex][2];
    const range = `${SHEET_NAME}!D${rowIndex + 1}`;
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
    const json = await res.json();
    
    let appData: AppData | undefined;
    if (json.values && json.values[0] && json.values[0][0]) {
      try {
        appData = JSON.parse(json.values[0][0]);
      } catch (e) {
        console.error("Failed to parse user data from sheet", e);
      }
    }

    return { success: true, data: appData, name };
  } catch (e: any) {
    console.error("DB Login Error", e);
    return { success: false, message: e.message || "Connection error." };
  }
};

export const dbSignup = async (email: string, password: string, name: string, initialData: AppData): Promise<{ success: boolean; message?: string }> => {
  if (!isGoogleConfigured() || !accessToken) {
    return { success: false, message: "Google Cloud Sync not active." };
  }

  try {
    const rows = await fetchUserDirectory();
    if (rows && rows.find((row: string[]) => row[0]?.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: "Email already exists in Sheet." };
    }

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A:D:append?valueInputOption=RAW`;
    const body = {
      values: [
        [email, password, name, JSON.stringify(initialData)]
      ]
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      return { success: true };
    } else {
      const err = await res.json().catch(() => ({}));
      return { success: false, message: err.error?.message || "Failed to create entry." };
    }
  } catch (e: any) {
    console.error("DB Signup Error", e);
    return { success: false, message: e.message || "Connection error." };
  }
};

export const dbSave = async (email: string, data: AppData) => {
  if (!accessToken || !isGoogleConfigured()) return;

  try {
    const rows = await fetchUserDirectory();
    const rowIndex = rows.findIndex((row: string[]) => row[0]?.toLowerCase() === email.toLowerCase());

    if (rowIndex === -1) {
      return;
    }

    const range = `${SHEET_NAME}!D${rowIndex + 1}`;
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?valueInputOption=RAW`;
    
    await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [[JSON.stringify(data)]]
      }),
    });
  } catch (e) {
    console.warn("DB Save warning", e);
  }
};