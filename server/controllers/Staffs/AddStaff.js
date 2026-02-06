const Staff = require('../../models/Staff');
<<<<<<< HEAD
const User = require('../../models/User');
const cloudinary = require('cloudinary').v2;

const addStaff = async (req, res) => {
    try {
        const {
            fullName,
            email,
            employeeId,
            phone,
            department,
            position,
            dateOfBirth,
            joiningDate,
            gender,
            address,
            emergencyContact
        } = req.body;

        console.log('📝 Received data:', {
            fullName,
            email,
            employeeId,
            department,
            hasFile: !!req.files
        });

        // Check if employee ID already exists
        const existingStaff = await Staff.findOne({ employeeId });
        if (existingStaff) {
            return res.status(400).json({
                success: false,
                message: 'Employee ID already exists'
            });
        }

        // Check if email already exists
        const existingEmail = await Staff.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
        }

        let profileImageUrl = null;

        // Upload profile image ONLY if Cloudinary is configured AND file exists
        if (req.files && req.files.profileImage) {
            // Check if Cloudinary is properly configured
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
                    
                    console.log('📸 Uploading image to Cloudinary...');
                    const result = await cloudinary.uploader.upload(file.tempFilePath, {
                        folder: 'ems/employees',
                        public_id: `employee_${employeeId}`,
                        overwrite: true
                    });

                    profileImageUrl = result.secure_url;
                    console.log('✅ Image uploaded successfully');
                } catch (uploadError) {
                    console.error('⚠️ Cloudinary upload failed:', uploadError.message);
                    // Continue without image instead of failing
                    console.log('⚠️ Continuing without profile image');
                }
            } else {
                console.log('⚠️ Cloudinary not configured, skipping image upload');
            }
        }

        // Parse address if it's a string
        const parsedAddress = typeof address === 'string' ? JSON.parse(address) : address;
        const parsedEmergencyContact = typeof emergencyContact === 'string' ? JSON.parse(emergencyContact) : emergencyContact;

        console.log('💾 Creating staff record...');

        // Create staff member
        const staff = await Staff.create({
            fullName,
            email,
            employeeId,
            phone,
            department,
            position,
            dateOfBirth,
            joiningDate: joiningDate || new Date(),
            gender,
            address: parsedAddress,
            emergencyContact: parsedEmergencyContact,
            profileImage: profileImageUrl,
            isActive: true
        });

        const populatedStaff = await Staff.findById(staff._id).populate('department', 'name');

        console.log('✅ Employee created successfully:', staff.fullName);

        return res.status(201).json({
            success: true,
            message: 'Employee added successfully',
            data: populatedStaff
        });

    } catch (error) {
        console.error('❌ Add staff error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error adding employee',
            error: error.message
        });
    }
};

module.exports = addStaff;
=======
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
>>>>>>> 2b6bd551d067825577aa0957dbf4462a2172534d
