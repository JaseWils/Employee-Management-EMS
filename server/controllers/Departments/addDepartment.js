const Department = require('../../models/Department');

const addDepartment = async (req, res) => {
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
