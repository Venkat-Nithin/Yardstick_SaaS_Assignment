module.exports = (role) => {
    return (req, res, next) => {
        if (req.userData.role !== role) {
            return res.status(403).json({ message: 'Access denied.' });
        }
        next();
    };
};