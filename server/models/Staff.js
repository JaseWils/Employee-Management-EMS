const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    fullName: {
        type: String,
<<<<<<< HEAD
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    employeeId: {
        type: String,
        required: true,
        unique: true
    },
    phone: String,
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
    },
    position: String,
    dateOfBirth: Date,
    joiningDate: {
        type: Date,
        default: Date.now
    },
    address: {
        street: String,
        city: String,
        state: String,
        country: String,
        zipCode: String
    },
    emergencyContact: {
        name: String,
        relationship: String,
        phone: String
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other']
    },
    profileImage: String,
=======
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
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please enter a valid email'
        ]
    },
    mobile: {
        type: String,
        required: [true, 'Mobile number is required'],
        unique: true,
        trim: true,
        match: [/^[0-9]{10,15}$/, 'Please enter a valid mobile number']
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: [true, 'Department is required']
    },
    gender: {
        type: String,
        required: [true, 'Gender is required'],
        enum: {
            values: ['Male', 'Female', 'Other'],
            message: 'Gender must be Male, Female, or Other'
        }
    },
    dateOfBirth: {
        type: Date,
        required: [true, 'Date of birth is required'],
        validate: {
            validator: function(value) {
                return value < new Date();
            },
            message: 'Date of birth must be in the past'
        }
    },
    dateOfJoining: {
        type: Date,
        required: [true, 'Date of joining is required'],
        default: Date.now
    },
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
            required: [true, 'City is required'],
            trim: true,
            maxlength: [50, 'City cannot exceed 50 characters']
        },
        state: {
            type: String,
            required: [true, 'State is required'],
            trim: true,
            maxlength: [50, 'State cannot exceed 50 characters']
        },
        country: {
            type: String,
            required: [true, 'Country is required'],
            trim: true,
            maxlength: [50, 'Country cannot exceed 50 characters']
        },
        postalCode: {
            type: String,
            trim: true,
            maxlength: [20, 'Postal code cannot exceed 20 characters']
        }
    },
    designation: {
        type: String,
        trim: true,
        maxlength: [100, 'Designation cannot exceed 100 characters']
    },
    salary: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Salary'
    },
>>>>>>> 2b6bd551d067825577aa0957dbf4462a2172534d
    isActive: {
        type: Boolean,
        default: true
    },
<<<<<<< HEAD
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
=======
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
>>>>>>> 2b6bd551d067825577aa0957dbf4462a2172534d
    }
}, {
    timestamps: true
});

<<<<<<< HEAD
module.exports = mongoose.model('Staff', staffSchema);
=======
// Index for faster queries
staffSchema.index({ email: 1 });
staffSchema.index({ department: 1 });
staffSchema.index({ isActive: 1 });

// Virtual for full address
staffSchema.virtual('fullAddress').get(function() {
    const addr = this.address;
    if (!addr) return '';
    return [addr.street, addr.city, addr.state, addr.country, addr.postalCode]
        .filter(Boolean)
        .join(', ');
});

// Ensure virtuals are included in JSON output
staffSchema.set('toJSON', { virtuals: true });
staffSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Staff', staffSchema);
>>>>>>> 2b6bd551d067825577aa0957dbf4462a2172534d
