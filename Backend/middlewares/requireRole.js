import jwt from 'jsonwebtoken';

const requireRole = (roles) => (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.role) {
      return res.status(401).json({ error: 'Unauthorized: Missing role in token',redirect: '/login'});
    }

    // Check if roles array contains the user's role
    if (!roles.includes(decoded.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient privileges' });
    }

    // Attach the user to the request object for further use
    req.user = decoded;

    next();
  } catch (error) {
    console.error('JWT Error:', error.message);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Unauthorized: Token expired', redirect: '/login' });
    }

    return res.status(401).json({ error: 'Unauthorized: Invalid token',redirect: '/login'});
  }
};

export default requireRole;

