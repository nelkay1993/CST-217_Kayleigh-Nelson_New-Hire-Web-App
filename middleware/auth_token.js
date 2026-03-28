import jwt from "jsonwebtoken";

/*
  This middleware checks for a token and, if valid,
  attaches user identity to the request object.

  Expected header:
  Authorization: Bearer <token>
*/

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Missing Authorization header" });
  }

  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer" || !token) {
    return res
      .status(401)
      .json({ error: "Authorization header format should be: Bearer <token>" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Attach identity to the request for later routes
    req.userAccessId = payload.userId;
    req.email = payload.email;

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

export default {requireAuth };
