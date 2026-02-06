const Staff = require('../../models/Staff');

const getStaffs = async (req, res) => {
    try {
        const { id } = req.params;
        const { search, department, status, page = 1, limit = 50 } = req.query;

        // If ID is provided, get single staff
        if (id) {
            const staff = await Staff.findById(id).populate('department', 'name description');
            
            if (!staff) {
                return res.status(404).json({
                    success: false,
                    message: 'Employee not found'
                });
            }

            return res.status(200).json({
                success: true,
                data: staff
            });
        }

        // Build query
        let query = {};

        if (search) {
            query.$or = [
                { fullName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { employeeId: { $regex: search, $options: 'i' } }
            ];
        }

        if (department) {
            query.department = department;
        }

        if (status) {
            query.isActive = status === 'active';
        }

        // Get all staff with pagination
        const staffs = await Staff.find(query)
            .populate('department', 'name description')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const total = await Staff.countDocuments(query);

        return res.status(200).json({
            success: true,
            data: staffs,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / parseInt(limit))
            }
        });

    } catch (error) {
        console.error('Get staff error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching employees',
            error: error.message
        });
    }
};

module.exports = getStaffs;