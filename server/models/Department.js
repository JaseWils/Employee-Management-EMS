const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
<<<<<<< HEAD
        required: true,
        unique: true,
        trim: true
    },
    description: String,
    head: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff'
=======
        required: [true, 'Department name is required'],
        unique: true,
        trim: true,
        maxlength: [50, 'Department name cannot exceed 50 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    head: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    employeeCount: {
        type: Number,
        default: 0
>>>>>>> 2b6bd551d067825577aa0957dbf4462a2172534d
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Department', departmentSchema);