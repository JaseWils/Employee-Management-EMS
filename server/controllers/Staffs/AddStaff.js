const Staff = require('../../models/Staff');
const Department = require('../../models/Department');

const addStaff = async (req, res) => {
    const { 
        fullName, department, gender, email, mobile, photo, 
        dateOfBirth, dateOfJoining, city, state, country, street, postalCode, designation 
    } = req.body;
    
    try {
        const checkEmail = await Staff.findOne({ email: email.toLowerCase() });

        if (checkEmail) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const checkMobile = await Staff.findOne({ mobile });

        if (checkMobile) {
            return res.status(400).json({ error: 'Mobile number already exists' });
        }

        // Verify department exists
        const deptExists = await Department.findById(department);
        if (!deptExists) {
            return res.status(400).json({ error: 'Department not found' });
        }

        const newStaff = new Staff({
            fullName,
            department,
            gender,
            email,
            mobile,
            photo: photo || '',
            dateOfBirth: new Date(dateOfBirth),
            dateOfJoining: dateOfJoining ? new Date(dateOfJoining) : new Date(),
            address: {
                street,
                city,
                state,
                country,
                postalCode
            },
            designation
        });

        await newStaff.save();

        // Update department employee count
        await Department.findByIdAndUpdate(department, { $inc: { employeeCount: 1 } });

        // Populate department info before returning
        await newStaff.populate('department', 'name');

        res.status(201).json({ 
            message: 'Staff added successfully',
            data: newStaff,
            success: true
        });
    } catch (error) {
        console.log("Error in addstaff controller", error);
        console.error(error);
        res.status(500).json({ error: 'Server error', message: error.message });
    }
};

module.exports = addStaff;
