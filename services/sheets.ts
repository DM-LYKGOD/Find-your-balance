import { AppData } from '../types';

// --- CONFIGURATION ---
const CLIENT_ID = 'debapratim1';
const SPREADSHEET_ID = '190UEY3iBtxxAHibi0NUGI8IDu_2Jt5oeBBO_j_mSnZw';
const SHEET_NAME = 'Sheet1'; 

let tokenClient: any;
let accessToken: string | null = null;

// Initialize Google OAuth Client
export const initGoogleAuth = (callback: (success: boolean, error?: string) => void) => {
  if (!(window as any).google) {
    console.error("Google Identity Services not loaded");
    callback(false, "Google API not loaded");
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
        console.error("Google Auth Error:", err);
        callback(false, err.message || "Auth Error");
      }
    });
    console.log("Google Auth Initialized with ID:", CLIENT_ID);
  } catch (e: any) {
    console.error("Error initializing Google Auth", e);
    callback(false, e.message);
  }
};

export const signInToGoogle = () => {
  if (tokenClient) {
    // Prompt the user for permission
    tokenClient.requestAccessToken();
  } else {
    console.error("Token client not initialized");
  }
};

export const isGoogleAuthorized = () => !!accessToken;

// --- Database Operations ---

const fetchUserDirectory = async () => {
  if (!accessToken) throw new Error("Google Auth required");

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A:C`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
  
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || "Failed to fetch directory");
  }

  const json = await res.json();
  return json.values || []; 
};

export const dbLogin = async (email: string, password: string): Promise<{ success: boolean; data?: AppData; name?: string; message?: string }> => {
  try {
    const rows = await fetchUserDirectory();
    // Find row index (0-based) where Column A (index 0) matches email
    const rowIndex = rows.findIndex((row: string[]) => row[0] === email);
    
    if (rowIndex === -1) {
      return { success: false, message: "User not found in Sheet." };
    }

    const storedPassword = rows[rowIndex][1];
    
    // Check password (simple check)
    if (storedPassword !== password) {
      return { success: false, message: "Invalid password." };
    }

    const name = rows[rowIndex][2];

    // Fetch the Data Column (D) for this specific row
    const range = `${SHEET_NAME}!D${rowIndex + 1}`;
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
    const json = await res.json();
    
    let appData: AppData | undefined;
    if (json.values && json.values[0] && json.values[0][0]) {
      try {
        appData = JSON.parse(json.values[0][0]);
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }

    return { success: true, data: appData, name };

  } catch (e: any) {
    console.error("DB Login Error", e);
    return { success: false, message: e.message || "Connection error." };
  }
};

export const dbSignup = async (email: string, password: string, name: string, initialData: AppData): Promise<{ success: boolean; message?: string }> => {
  try {
    const rows = await fetchUserDirectory();
    if (rows && rows.find((row: string[]) => row[0] === email)) {
      return { success: false, message: "Email already exists in Sheet." };
    }

    // Append new row: Email | Password | Name | JSON_Data
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
      const err = await res.json();
      console.error("Signup API Error", err);
      return { success: false, message: err.error?.message || "Failed to create entry." };
    }

  } catch (e: any) {
    console.error("DB Signup Error", e);
    return { success: false, message: e.message || "Connection error." };
  }
};

export const dbSave = async (email: string, data: AppData) => {
  if (!accessToken) return;

  try {
    const rows = await fetchUserDirectory();
    const rowIndex = rows.findIndex((row: string[]) => row[0] === email);

    if (rowIndex === -1) {
      console.error("User row not found for saving");
      return;
    }

    // Update Column D for that row
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
    
    console.log("Synced to Sheet DB");

  } catch (e) {
    console.error("DB Save Error", e);
  }
};