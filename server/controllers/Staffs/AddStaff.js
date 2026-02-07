const Staff = require('../../models/Staff');
const Department = require('../../models/Department');
const cloudinary = require('cloudinary').v2;

const addStaff = async (req, res) => {
    try {
        const {
            fullName,
            email,
            employeeId,
            phone,
            mobile,
            department,
            position,
            designation,
            dateOfBirth,
            joiningDate,
            dateOfJoining,
            gender,
            address,
            emergencyContact,
            city,
            street,
            state,
            country,
            postalCode
        } = req.body;

        // Check if employee ID already exists (if provided)
        if (employeeId) {
            const existingStaff = await Staff.findOne({ employeeId });
            if (existingStaff) {
                return res.status(400).json({
                    success: false,
                    message: 'Employee ID already exists'
                });
            }
        }

        // Check if email already exists
        const existingEmail = await Staff.findOne({ email: email.toLowerCase() });
        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
        }

        // Check if mobile already exists (if provided)
        if (mobile) {
            const existingMobile = await Staff.findOne({ mobile });
            if (existingMobile) {
                return res.status(400).json({
                    success: false,
                    message: 'Mobile number already exists'
                });
            }
        }

        // Verify department exists
        if (department) {
            const deptExists = await Department.findById(department);
            if (!deptExists) {
                return res.status(400).json({ 
                    success: false,
                    message: 'Department not found' 
                });
            }
        }

        let profileImageUrl = null;

        // Upload profile image if Cloudinary is configured AND file exists
        if (req.files && req.files.profileImage) {
            const isCloudinaryConfigured = 
                process.env.CLOUDINARY_CLOUD_NAME && 
                process.env.CLOUDINARY_API_KEY && 
                process.env.CLOUDINARY_API_SECRET &&
                process.env.CLOUDINARY_CLOUD_NAME !== 'your-cloudinary-cloud-name' &&
                process.env.CLOUDINARY_API_KEY !== 'your-cloudinary-api-key' &&
                process.env.CLOUDINARY_API_SECRET !== 'your-cloudinary-api-secret';

            if (isCloudinaryConfigured) {
                try {
                    const file = req.files.profileImage;
                    const result = await cloudinary.uploader.upload(file.tempFilePath, {
                        folder: 'ems/employees',
                        public_id: `employee_${employeeId || Date.now()}`,
                        overwrite: true
                    });
                    profileImageUrl = result.secure_url;
                } catch (uploadError) {
                    console.error('⚠️ Cloudinary upload failed:', uploadError.message);
                }
            }
        }

        // Parse address - support both object and individual fields
        let parsedAddress = {};
        if (typeof address === 'string') {
            parsedAddress = JSON.parse(address);
        } else if (address) {
            parsedAddress = address;
        } else {
            parsedAddress = { street, city, state, country, postalCode };
        }

        const parsedEmergencyContact = typeof emergencyContact === 'string' 
            ? JSON.parse(emergencyContact) 
            : emergencyContact;

        // Create staff member
        const staff = await Staff.create({
            fullName,
            email: email.toLowerCase(),
            employeeId,
            phone: phone || mobile,
            mobile,
            department,
            position: position || designation,
            designation,
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
            joiningDate: joiningDate || dateOfJoining || new Date(),
            gender,
            address: parsedAddress,
            emergencyContact: parsedEmergencyContact,
            profileImage: profileImageUrl,
            isActive: true
        });

        // Update department employee count
        if (department) {
            await Department.findByIdAndUpdate(department, { $inc: { employeeCount: 1 } });
        }

        const populatedStaff = await Staff.findById(staff._id).populate('department', 'name');

        return res.status(201).json({
            success: true,
            message: 'Employee added successfully',
            data: populatedStaff
        });

    } catch (error) {
        console.error('Add staff error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error adding employee',
            error: error.message
        });
    }
};

module.exports = addStaff;
