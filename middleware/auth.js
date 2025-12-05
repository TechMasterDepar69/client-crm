const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // 1. Get the token from the header
    const token = req.header('Authorization');

    // 2. Check if no token
    if (!token) {
        return res.status(401).json({ error: 'No token, authorization denied' });
    }

    // 3. Verify token
    try {
        // Remove "Bearer " if it's there (standard practice)
        const cleanToken = token.replace('Bearer ', '');
        const decoded = jwt.verify(cleanToken, 'secretkey123');

        req.user = decoded; // Add user info to the request
        next(); // Let them pass
    } catch (err) {
        res.status(401).json({ error: 'Token is not valid' });
    }
};