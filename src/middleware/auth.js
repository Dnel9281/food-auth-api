const jwt = require('jsonwebtoken');

const auth = {
  isAuthenticated: (req, res, next) => {
    let token = req.headers.authorization.split(' ')[1];
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) { 
          res.status(403).json({ message: err.message }); 
        }
        if (decoded) {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      res.status(403).json({ message: 'No token provided!' });
    }
  }
}


module.exports = auth;