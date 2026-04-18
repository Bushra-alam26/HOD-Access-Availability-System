const User = require('../models/User');
const { generateToken } = require('../utils/generateToken');

// @desc    Login user or register new user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    // Validate password
    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Check if user exists
    let user = await User.findOne({ email }).select('+password');

    if (user) {
      // Existing user - verify password
      const isMatch = await user.matchPassword(password);

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Update login status
      user.isLoggedIn = true;
      user.lastLogin = new Date();
      await user.save();

      // Generate JWT token
      const token = generateToken(user);

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        user: {
          id: user._id,
          firstName: user.firstName,
          surname: user.surname,
          email: user.email,
          role: user.role,
          branch: user.branch,
          semester: user.semester,
          usn: user.usn,
          isLoggedIn: user.isLoggedIn,
          lastLogin: user.lastLogin
        }
      });
    } else {
      // New user - return flag to show registration form
      return res.status(404).json({
        success: false,
        isNewUser: true,
        message: 'User not found. Please complete registration.'
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { 
      firstName, 
      surname, 
      email, 
      password, 
      address, 
      usn, 
      branch, 
      semester,
      role 
    } = req.body;

    // Validate required fields
    if (!firstName || !surname || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields'
      });
    }

    // For students, validate USN and semester
    const userRole = role || 'student';
    if (userRole === 'student' && !usn) {
      return res.status(400).json({
        success: false,
        message: 'USN is required for students'
      });
    }

    if (userRole === 'student' && !semester) {
      return res.status(400).json({
        success: false,
        message: 'Semester is required for students'
      });
    }

    // Branch is required for HOD and Faculty
    if ((userRole === 'hod' || userRole === 'faculty') && !branch) {
      return res.status(400).json({
        success: false,
        message: 'Branch is required for HOD/Faculty'
      });
    }

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    // Validate password
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create new user
    const user = await User.create({
      firstName,
      surname,
      email,
      password,
      address: address || '',
      usn: usn || '',
      branch: branch || '',
      semester: semester || 1,
      role: role || 'student',
      isLoggedIn: true,
      lastLogin: new Date()
    });

    // Generate JWT token
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: {
        id: user._id,
        firstName: user.firstName,
        surname: user.surname,
        email: user.email,
        role: user.role,
        branch: user.branch,
        semester: user.semester,
        usn: user.usn,
        isLoggedIn: user.isLoggedIn,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
exports.logout = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      user.isLoggedIn = false;
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout'
    });
  }
};

// @desc    Get all logged in users (for HOD)
// @route   GET /api/auth/logged-users
// @access  Private (HOD only)
exports.getLoggedInUsers = async (req, res) => {
  try {
    const loggedInUsers = await User.find({ 
      isLoggedIn: true,
      role: 'student'
    }).select('-password');

    res.status(200).json({
      success: true,
      count: loggedInUsers.length,
      users: loggedInUsers.map(user => ({
        id: user._id,
        fullName: `${user.firstName} ${user.surname}`,
        email: user.email,
        usn: user.usn,
        branch: user.branch,
        semester: user.semester,
        lastLogin: user.lastLogin,
        isLoggedIn: user.isLoggedIn
      }))
    });
  } catch (error) {
    console.error('Get logged users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all users (for HOD)
// @route   GET /api/auth/users
// @access  Private (HOD only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'student' }).select('-password');

    res.status(200).json({
      success: true,
      count: users.length,
      users: users.map(user => ({
        id: user._id,
        fullName: `${user.firstName} ${user.surname}`,
        firstName: user.firstName,
        surname: user.surname,
        email: user.email,
        usn: user.usn,
        branch: user.branch,
        semester: user.semester,
        address: user.address,
        lastLogin: user.lastLogin,
        isLoggedIn: user.isLoggedIn,
        createdAt: user.createdAt
      }))
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};