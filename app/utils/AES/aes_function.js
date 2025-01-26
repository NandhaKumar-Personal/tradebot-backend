import CryptoJS from "crypto-js";

// AES key - store this securely
const AES_KEY = process.env.AES_KEY; // 32 bytes (256 bits), base64-encoded

// Ensure AES_KEY is set
if (!AES_KEY) {
  throw new Error("AES_KEY is not defined in environment variables.");
}

const keyBytes = CryptoJS.enc.Base64.parse(AES_KEY);

function encrypt(text) {
  const encrypted = CryptoJS.AES.encrypt(text, keyBytes, {
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return encrypted.toString();
}

function decrypt(encryptedText) {
  const bytes = CryptoJS.AES.decrypt(encryptedText, keyBytes, {
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return bytes.toString(CryptoJS.enc.Utf8);
}

export { encrypt, decrypt };
