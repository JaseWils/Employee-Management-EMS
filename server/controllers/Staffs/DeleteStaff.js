const Staff = require('../../models/Staff');
const Department = require('../../models/Department');

const deleteStaff = async (req, res) => {
    try {
        const staffId = req.params.id;
        const staffToDelete = await Staff.findById(staffId);
        if (!staffToDelete) {
            return res.status(404).json({ success: false, message: 'Staff Not Found' });
        }
        if (staffToDelete.department) {
            await Department.findByIdAndUpdate(staffToDelete.department, { $inc: { employeeCount: -1 } });
        }
        const deletedStaff = await Staff.findByIdAndDelete(staffId);
        res.status(200).json({ success: true, message: 'Staff deleted successfully', data: deletedStaff });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting staff', error: error.message });
    }
};

module.exports = deleteStaff;
