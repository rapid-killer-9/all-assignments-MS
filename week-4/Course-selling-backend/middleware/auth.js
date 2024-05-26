const jwt = require('jsonwebtoken');

const SECRET = 'SECr3t';

const authenticateJwt = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    jwt.verify(token, SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403);
            }
            req.user = user;
            next();
    })
}

const authorizeRole = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json({ msg: 'Access denied' });
        }
        next();
    };
};

module.exports = {
    authenticateJwt,
    authorizeRole,
    SECRET
}