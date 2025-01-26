import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const createJwtHandler = (req, res) => {
  const { username, password } = req.body;

  // You should validate the credentials (e.g., check if the user exists, etc.)
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" }); // Token valid for 1 hour

  res.json({ token });
};

export const verifyJwtHandler = (req, res) => {
  console.log("Verifying JWT...", req);

  const { jwtDetails } = req;

  if (!jwtDetails) {
    return res
      .status(401)
      .json({ error: "sdfsdfsdfsdfsfNo token provided or expired token" });
  }

  res.json({ message: "JWT is valid", jwtDetails });
};
