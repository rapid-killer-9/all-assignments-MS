const jwt = require('jsonwebtoken');

const SECRET = 'SECr3t';

const authenticateJwt = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
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

module.exports = {
    authenticateJwt,
    SECRET
}