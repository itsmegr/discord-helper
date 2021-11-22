const { google } = require("googleapis");

let googleSheets, auth;

async function initGoogle() {
  try {
    auth = new google.auth.GoogleAuth({
      keyFile: "config.json",
      scopes: "https://www.googleapis.com/auth/spreadsheets",
    });
    // Create client instance for auth
    const googleClient = await auth.getClient();

    // Instance of Google Sheets API
    googleSheets = google.sheets({ version: "v4", auth: googleClient });
  } catch (err) {
    console.log(err);
  }
}

//function for getting row from google sheet
async function getRows(sheetId, range) {
  return new Promise(async (resolve, reject) => {
    try {
      const AllData = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId: sheetId,
        range: range,
      });
      resolve(AllData.data.values);
    } catch (err) {
      reject(err);
    }
  });
}

//function for updating rows in google
async function updateRows(sheetId, range, values) {
  return new Promise(async (resolve, reject) => {
    try {
      const AllData = await googleSheets.spreadsheets.values.update({
        auth,
        spreadsheetId: sheetId,
        range: range,
        valueInputOption: "USER_ENTERED",
        resource: {
          values,
        },
      });
      resolve(AllData);
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = {
  getRows,
  initGoogle,
  googleSheets,
  updateRows,
};
