const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    documentType: {
        type: String,
        enum: [
            'contract',
            'id_proof',
            'address_proof',
            'educational_certificate',
            'experience_letter',
            'medical_certificate',
            'tax_document',
            'nda',
            'offer_letter',
            'resignation',
            'other'
        ],
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    cloudinaryId: String,
    fileType: String, // pdf, jpg, png, etc.
    fileSize: Number, // in bytes
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    uploadDate: {
        type: Date,
        default: Date.now
    },
    expiryDate: Date,
    isExpired: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'expired'],
        default: 'pending'
    },
    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    verifiedAt: Date,
    description: String,
    tags: [String],
    version: {
        type: Number,
        default: 1
    },
    previousVersions: [{
        fileUrl: String,
        cloudinaryId: String,
        uploadedAt: Date,
        version: Number
    }],
    accessControl: {
        isPublic: {
            type: Boolean,
            default: false
        },
        allowedRoles: [String],
        allowedUsers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }]
    },
    metadata: {
        originalName: String,
        encoding: String,
        mimetype: String
    }
}, {
    timestamps: true
});

// Index for searching
documentSchema.index({ employee: 1, documentType: 1 });
documentSchema.index({ expiryDate: 1 });
documentSchema.index({ tags: 1 });

// Check if document is expired
documentSchema.pre('save', function(next) {
    if (this.expiryDate && new Date() > this.expiryDate) {
        this.isExpired = true;
        this.status = 'expired';
    }
    next();
});

module.exports = mongoose.model('Document', documentSchema);