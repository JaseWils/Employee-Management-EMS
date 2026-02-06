<<<<<<< HEAD
=======
// const bcrypt = require('bcrypt')
// const UserModel = require('../ConnectDB/models/RegistrationSchema')
// const jwt = require('jsonwebtoken')
// const checkPassword = async (req, res) => {
//     const { password, userId } = req.body
//     const user = await UserModel.findById(userId);
//     const verifyPassword = await bcrypt.compare(password, user.password)
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
//     res.setHeader('Access-Control-Allow-Credentials', 'true');
//     if (verifyPassword) {
//         try {
//             if (!verifyPassword) {
//                 return res.json({
//                     message: "Please Check the Password",
//                     error: true,


//                 })
                
//             }
//             else {
//                 //Create Token data  for generating in to jwt
//                 const tokenData = {
//                     id: user._id,
//                     email: user.email
//                 }
//                 const generateToken = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
//                 const cookieOption = {
//                     http: true,
//                     secure: true,
//                 }
//                 return res.cookie('token', generateToken, cookieOption).json({
//                     message: "Login Succesfully",
//                     data: user,
//                     success: true

//                 })
//             }
//         } catch (error) {
//             console.log("Error in Check Password Controler")
//             return res.status(500).json({
//                 message: error.message || error,
//                 error: true
//             })
//         }
//     }

// }
// module.exports = checkPassword


>>>>>>> 2b6bd551d067825577aa0957dbf4462a2172534d
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const checkPassword = async (req, res) => {
<<<<<<< HEAD
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Find user with password field
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid password'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: user._id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isEmailVerified: user.isEmailVerified
            }
        });

    } catch (error) {
        console.error('Password check error:', error);
        return res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.message
        });
    }
};

module.exports = checkPassword;
=======
  const { password, userId } = req.body;

  try {
    const user = await User.findById(userId).select('+password');
    
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true
      });
    }

    // Use the model's comparePassword method
    const verifyPassword = await user.comparePassword(password);
    
    if (!verifyPassword) {
      return res.status(401).json({
        message: "Please Check the Password",
        error: true
      });
    }

    if (user.isAdmin) {
      return res.status(403).json({
        message: "Admin cannot login from this route",
        error: true
      });
    }

    // Create token data for generating JWT
    const tokenData = {
      id: user._id,
      email: user.email,
      isAdmin: user.isAdmin
    };
    
    const generateToken = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
    const cookieOption = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    };

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Get user without password for response
    const userResponse = await User.findById(userId);
    
    return res.cookie('token', generateToken, cookieOption).json({
      message: "Login Successfully",
      data: userResponse,
      token: generateToken,
      success: true
    });
  } catch (error) {
    console.log("Error in Check Password Controller", error);
    return res.status(500).json({
      message: error.message || error,
      error: true
    });
  }
};

module.exports = checkPassword;
>>>>>>> 2b6bd551d067825577aa0957dbf4462a2172534d
