import { decrypt, encrypt } from "./aes_function.js";

export function aesDecryptMiddleware(req, res, next) {
  if (process.env.ENABLE_AES === "true") {
    if (req.body && req.body.encryptedData) {
      try {
        const encryptedData = req.body.encryptedData;
        console.log("Encrypted data:", encryptedData);

        if (!encryptedData) {
          return res.status(400).json({ error: "No encrypted data provided" });
        }

        const decryptedData = decrypt(encryptedData);
        console.log("Decrypted data:", decryptedData);

        if (!decryptedData) {
          return res
            .status(400)
            .json({ error: "Decryption returned empty data" });
        }

        req.body = JSON.parse(decryptedData);
      } catch (err) {
        console.error("Error decrypting data:", err.message);
        return res.status(400).json({ error: "Invalid encrypted data" });
      }
    }
  }
  next();
}

export function aesEncryptMiddleware(req, res, next) {
  if (process.env.ENABLE_AES === "true") {
    const originalSend = res.send;

    res.send = function (body) {
      try {
        const encryptedData = encrypt(JSON.stringify(body));
        res.setHeader("Encrypted-Response", "true");
        originalSend.call(res, JSON.stringify({ encryptedData }));
      } catch (err) {
        console.error("Error encrypting response:", err.message);
        res.status(500).json({ error: "Error encrypting response data" });
      }
    };
  }
  next();
}
