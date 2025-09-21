// src/utils/crypto.js
import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY || "fallback_dev_key";

// Make a base64 string URL-safe
function base64UrlEncode(b64) {
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Reverse URL-safe to normal base64 (pad with '=')
function base64UrlDecode(urlSafe) {
  let b64 = urlSafe.replace(/-/g, "+").replace(/_/g, "/");
  // pad length to multiple of 4
  while (b64.length % 4 !== 0) b64 += "=";
  return b64;
}

export function encryptId(id) {
  // id can be number or string
  const ciphertext = CryptoJS.AES.encrypt(id.toString(), SECRET_KEY).toString(); // base64
  return base64UrlEncode(ciphertext);
}

export function decryptId(urlSafeCipher) {
  try {
    const b64 = base64UrlDecode(urlSafeCipher);
    const bytes = CryptoJS.AES.decrypt(b64, SECRET_KEY);
    const plaintext = bytes.toString(CryptoJS.enc.Utf8);
    if (!plaintext) return null;
    return plaintext; // string form of the id; convert to Number if needed
  } catch (e) {
    console.error("decryptId error", e);
    return null;
  }
}
