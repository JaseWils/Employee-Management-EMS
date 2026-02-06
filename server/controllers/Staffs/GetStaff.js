const Staff = require('../../models/Staff');

const getStaff = async (req, res) => {
    try {
        const staffId = req.params.id;
        if (staffId) {
            const staff = await Staff.findById(staffId).populate('department', 'name description').populate('salary');
            if (!staff) {
                return res.status(404).json({ success: false, message: 'Staff not found', data: null });
            }
            return res.json({ success: true, message: 'Staff Details', data: staff });
        } else {
            const allStaff = await Staff.find({ isActive: true }).populate('department', 'name').sort({ createdAt: -1 });
            return res.json({ success: true, message: 'All Staff Details', data: allStaff });
        }
    } catch (error) {
        console.error('Error fetching staff', error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = getStaff;
