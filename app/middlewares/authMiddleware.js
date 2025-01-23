// app/middlewares

const jwt = require('jsonwebtoken');
const { isBlacklisted } = require('./tokenBlackList');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.json({
            status: 'error',
            message: 'Access token is missing',
        });
    }

    if (isBlacklisted(token)) {
        return res.json({
            status: 'error',
            message: 'Token expired',
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.json({
                status: 'error',
                message: 'Token verification failed',
            });
        }

        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
