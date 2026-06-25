// utils/testData.js
//
// Single place where we read environment variables and expose them
// as plain JS values. No other file should call process.env directly.
// If a value is missing, we fail FAST and LOUD instead of letting a
// test fail later with a confusing error.

require('dotenv').config();

function requireEnv(key) {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}. Did you create a .env file?`
    );
  }
  return value;
}

const testData = {
  baseUrl: requireEnv('BASE_URL'),
  login: {
    countryCode: requireEnv('COUNTRY_CODE'),
    mobileNumber: requireEnv('LOGIN_MOBILE_NUMBER'),
    pin: requireEnv('LOGIN_PIN'),
  },
  note: {
    text: process.env.NOTE_TEXT || 'QA Check - Passed',
  },
  storageStatePath: '.auth/user.json',
};

module.exports = { testData };