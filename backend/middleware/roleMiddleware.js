/**
 * Middleware for role-based access control
 * Usage: authorizeRoles('student', 'faculty', 'hod')
 */

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not authorized to access this route`
      });
    }

    next();
  };
};

/**
 * Middleware for HOD only routes
 */
const authorizeHOD = authorizeRoles('hod');

/**
 * Middleware for Faculty only routes
 */
const authorizeFaculty = authorizeRoles('faculty');

/**
 * Middleware for Student only routes
 */
const authorizeStudent = authorizeRoles('student');

/**
 * Middleware for HOD and Faculty routes
 */
const authorizeHODAndFaculty = authorizeRoles('hod', 'faculty');

module.exports = {
  authorizeRoles,
  authorizeHOD,
  authorizeFaculty,
  authorizeStudent,
  authorizeHODAndFaculty
};