const Salary = require('../../models/Salary');

const getAllSalaries = async (req, res) => {
    try {
        const { isActive = true, page = 1, limit = 20 } = req.query;

        let query = {};
        if (isActive !== undefined) {
            query.isActive = isActive === 'true';
        }

        const salaries = await Salary.find(query)
            .populate('employee', 'fullName email employeeId department')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const total = await Salary.countDocuments(query);

        return res.status(200).json({
            success: true,
            data: salaries,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / parseInt(limit))
            }
        });

    } catch (error) {
        console.error('Get all salaries error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching salary configurations',
            error: error.message
        });
    }
};

module.exports = getAllSalaries;