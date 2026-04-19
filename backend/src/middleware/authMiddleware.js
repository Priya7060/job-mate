import jwt from "jsonwebtoken";

// PROTECT ROUTE
export const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  console.log("TOKEN RECEIVED:", token); //  ADD

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("DECODED USER:", decoded); //  ADD

    req.user = decoded; // attach user data
    next();

  } catch (error) {
    return res.status(401).json({ message: "Token failed" });
  }
};


export const authorizeRoles = (...roles) => {
  return (req, res, next) => {

    console.log("USER ROLE:", req.user.role); // ADD
    console.log("ALLOWED ROLES:", roles);

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};