const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware: sprawdza czy użytkownik jest zalogowany (ma ważny token JWT)
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Brak tokenu autoryzacji' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_key_change_me');
    req.user = decoded; // { id, email, role }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Nieprawidłowy lub wygasły token' });
  }
};

// Middleware: sprawdza czy zalogowany użytkownik ma rolę admina
const authorizeAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Brak uprawnień. Wymagana rola: admin' });
  }
  next();
};

module.exports = { authenticate, authorizeAdmin };
