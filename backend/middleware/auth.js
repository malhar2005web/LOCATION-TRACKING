const { verifyToken } = require('../utils/helpers');

function verifyAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Access denied. No token provided.'
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired. Please login again.'
            });
        }
        return res.status(403).json({
            success: false,
            message: 'Invalid token.'
        });
    }
}

function verifyClient(req, res, next) {
    verifyAuth(req, res, () => {
        if (req.user.role !== 'client') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Client role required.'
            });
        }
        next();
    });
}

function verifyAdmin(req, res, next) {
    verifyAuth(req, res, () => {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin role required.'
            });
        }
        next();
    });
}

module.exports = { verifyAuth, verifyClient, verifyAdmin };
