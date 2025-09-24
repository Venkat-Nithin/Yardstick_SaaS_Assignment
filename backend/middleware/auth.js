const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            throw new Error('No token provided');
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.userData = { 
            userId: decodedToken.userId, 
            role: decodedToken.role,
            tenantId: decodedToken.tenantId
        };
        next();
    } catch (error) {
        res.status(401).json({ message: 'Authentication failed!' });
    }
};