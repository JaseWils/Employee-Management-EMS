const User = require('../models/User');

const checkEmail = async (req, res) => {
    try {
        const { email } = req.body;
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
        });
    }
};

module.exports = checkEmail;