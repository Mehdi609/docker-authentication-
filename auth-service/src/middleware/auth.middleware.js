

const jwt = require('jsonwebtoken');


const authMiddleware = (req, res, next) => {
    if (req.path === "/api/retrait") return next();  // ✅ Skip token check for /api/retrait
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    next();
};

module.exports = authMiddleware;