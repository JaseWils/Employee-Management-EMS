const User = require('../models/User');

const checkEmail = async (req, res) => {
    try {
        const { email } = req.body;
<<<<<<< HEAD

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        const user = await User.findOne({ email }).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'No account found with this email'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Email found',
            data: {
                email: user.email,
                name: user.name,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Check email error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error checking email',
            error: error.message
=======
        const user = await User.findOne({ email: email.toLowerCase() });
        
        if (!user) {
            return res.json({
                message: "User Doesn't Exist",
                error: true
            });
        } else {
            return res.json({
                message: "Email Verified",
                success: true,
                data: user
            });
        }
    } catch (error) {
        console.log("Error in Check Email Controller", error);
        return res.status(500).json({
            message: error.message || error,
            error: true
>>>>>>> 2b6bd551d067825577aa0957dbf4462a2172534d
        });
    }
};

module.exports = checkEmail;