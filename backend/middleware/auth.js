// CivicLens Auth & Role Verification Middleware

const verifyRole = (allowedRoles = []) => {
  return (req, res, next) => {
    // Check role header or query parameter if passed
    const userRole = req.headers['x-user-role'] || req.body?.role || 'CITIZEN';

    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole.toUpperCase())) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access restricted to roles [${allowedRoles.join(', ')}]`
      });
    }

    req.userRole = userRole;
    next();
  };
};

module.exports = { verifyRole };
