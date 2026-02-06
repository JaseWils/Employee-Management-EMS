const Staff = require('../../models/Staff');

const getStaff = async (req, res) => {
  const staffId = req.params.id;

  try {
    if (staffId) {
      // Get a specific staff member by ID
      const staff = await Staff.findById(staffId)
        .populate('department', 'name description')
        .populate('salary');
        
      if (!staff) {
        return res.status(404).json({
          message: 'Staff not found',
          data: null,
          success: false
        });
      }
      return res.json({
        message: 'Staff Details',
        data: staff,
        success: true
      });
    } else {
      // Get all active staff members
      const allStaff = await Staff.find({ isActive: true })
        .populate('department', 'name')
        .sort({ createdAt: -1 });

      if (allStaff.length === 0) {
        return res.json({
          message: 'No staff members found in the database. Please add staff members.',
          data: [],
          success: false
        });
      }

      return res.json({
        message: 'All Staff Details',
        data: allStaff,
        success: true
      });
    }
  } catch (error) {
    console.error('Error fetching staff', error);
    return res.status(500).json({ error: 'Server error', message: error.message });
  }
};

module.exports = getStaff;

