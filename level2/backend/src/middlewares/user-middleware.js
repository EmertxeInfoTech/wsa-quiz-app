var jwt = require("jsonwebtoken");
const User = require("../models/user-model");

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  // const token = authHeader && authHeader.split(' ')[1];
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Access token is missing" });
  }

  jwt.verify(token, process.env.JWT_SECRET_TOKEN, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    try {
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Attach user object to the request for subsequent middleware/routes to use
      // TODO: Cache the user details in redis and serve it from redis, for now using it from DB

      // req.user = {
      //   id: decoded.data.user_id,
      //   username: decoded.data.username,
      // }

      req.user = user;
      next();
    } catch (error) {
      console.error("Error authenticating user:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // TODO: Ability to invilidate the token
};

module.exports = authenticateUser;
