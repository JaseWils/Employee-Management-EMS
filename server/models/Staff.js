const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    employeeId: {
        type: String,
        required: true,
        unique: true
    },
    phone: String,
    mobile: {
        type: String,
        trim: true,
        match: [/^[0-9]{10,15}$/, 'Please enter a valid mobile number']
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: [true, 'Department is required']
    },
    position: String,
    designation: {
        type: String,
        trim: true,
        maxlength: [100, 'Designation cannot exceed 100 characters']
    },
    gender: {
        type: String,
        enum: {
            values: ['Male', 'Female', 'Other', 'male', 'female', 'other'],
            message: 'Gender must be Male, Female, or Other'
        }
    },
    dateOfBirth: {
        type: Date,
        validate: {
            validator: function(value) {
                return !value || value < new Date();
            },
            message: 'Date of birth must be in the past'
        }
    },
    joiningDate: {
        type: Date,
        default: Date.now
    },
    dateOfJoining: {
        type: Date,
        default: Date.now
    },
    profileImage: String,
    photo: {
        type: String,
        default: ''
    },
    address: {
        street: {
            type: String,
            trim: true,
            maxlength: [200, 'Street address cannot exceed 200 characters']
        },
        city: {
            type: String,
            trim: true,
            maxlength: [50, 'City cannot exceed 50 characters']
        },
        state: {
            type: String,
            trim: true,
            maxlength: [50, 'State cannot exceed 50 characters']
        },
        country: {
            type: String,
            trim: true,
            maxlength: [50, 'Country cannot exceed 50 characters']
        },
        zipCode: String,
        postalCode: {
            type: String,
            trim: true,
            maxlength: [20, 'Postal code cannot exceed 20 characters']
        }
    },
    emergencyContact: {
        name: {
            type: String,
            trim: true
        },
        relationship: {
            type: String,
            trim: true
        },
        phone: {
            type: String,
            trim: true
        }
    },
    salary: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Salary'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Index for faster queries
staffSchema.index({ email: 1 });
staffSchema.index({ department: 1 });
staffSchema.index({ isActive: 1 });

// Virtual for full address
staffSchema.virtual('fullAddress').get(function() {
    const addr = this.address;
    if (!addr) return '';
    return [addr.street, addr.city, addr.state, addr.country, addr.postalCode || addr.zipCode]
        .filter(Boolean)
        .join(', ');
});

// Ensure virtuals are included in JSON output
staffSchema.set('toJSON', { virtuals: true });
staffSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Staff', staffSchema);
