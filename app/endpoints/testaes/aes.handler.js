import { decrypt, encrypt } from "../../utils/AES/aes_function.js";

// Example route handler for encryption
const encryptHandler = (req, res) => {
  try {
    const { data } = req.body; // Get the data from the request body
    if (!data) {
      return res.status(400).json({ error: "Data is required" });
    }

    const encryptedData = encrypt(JSON.stringify(data)); // Encrypt the data
    return res.json({ encryptedData });
  } catch (error) {
    console.error("Error during encryption:", error.message);
    return res.status(500).json({ error: "Error encrypting data" });
  }
};

// Example route handler for decryption
const decryptHandler = (req, res) => {
  try {
    const { encryptedData } = req.body; // Get the encrypted data from the request body
    if (!encryptedData) {
      return res.status(400).json({ error: "Encrypted data is required" });
    }

    const decryptedData = decrypt(encryptedData); // Decrypt the data
    return res.json({ decryptedData: JSON.parse(decryptedData) });
  } catch (error) {
    console.error("Error during decryption:", error.message);
    return res.status(500).json({ error: "Error decrypting data" });
  }
};

export { encryptHandler, decryptHandler };
