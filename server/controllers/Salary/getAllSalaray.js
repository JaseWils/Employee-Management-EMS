const Salary = require('../../models/Salary');

const getAllSalaries = async (req, res) => {
    try {
<<<<<<< HEAD
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
=======
        const salaries = await Salary.find()
            .populate('employee', 'fullName email department')
            .sort({ year: -1, month: -1 });

        res.json({
            message: 'All salaries retrieved successfully',
            data: salaries,
            success: true
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Internal server error',
>>>>>>> 2b6bd551d067825577aa0957dbf4462a2172534d
            error: error.message
        });
    }
};

<<<<<<< HEAD
module.exports = getAllSalaries;
=======
module.exports = getAllSalaries;
>>>>>>> 2b6bd551d067825577aa0957dbf4462a2172534d
