const Department = require('../../models/Department');

const addDepartment = async (req, res) => {
<<<<<<< HEAD
    try {
        const { name, description, head } = req.body;

        // Check if department already exists
        const existingDept = await Department.findOne({ 
            name: { $regex: new RegExp(`^${name}$`, 'i') }
        });

        if (existingDept) {
            return res.status(400).json({
                success: false,
                message: 'Department already exists'
            });
        }

        const department = await Department.create({
            name,
            description,
            head,
            isActive: true
        });

        const populatedDept = await Department.findById(department._id)
            .populate('head', 'fullName email');

        return res.status(201).json({
            success: true,
            message: 'Department created successfully',
            data: populatedDept
        });

    } catch (error) {
        console.error('Add department error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error creating department',
            error: error.message
        });
    }
};

module.exports = addDepartment;
=======
    const { name, description, head } = req.body;

    try {
        const checkDepartment = await Department.findOne({ name });

        if (checkDepartment) {
            return res.status(400).json({
                message: "Department already exists! Please add a new department.",
                error: true
            });
        }

        const newDept = new Department({
            name,
            description,
            head: head || undefined
        });

        await newDept.save();
        return res.status(201).json({
            message: "Department added successfully",
            data: newDept,
            success: true
        });
    } catch (error) {
        console.log("Error in add department controller")
        console.error("Error in add department controller", error);
        return res.status(500).json({ error: 'Server error', message: error.message });
    }
};

module.exports = addDepartment;
>>>>>>> 2b6bd551d067825577aa0957dbf4462a2172534d
