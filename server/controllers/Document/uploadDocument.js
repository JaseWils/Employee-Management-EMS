const Document = require('../../models/Document');
const cloudinary = require('cloudinary').v2;
const createNotification = require('../Notification/createNotification');

// Check if Cloudinary is properly configured
const isCloudinaryConfigured = () => {
    return process.env.CLOUDINARY_API_KEY && 
           process.env.CLOUDINARY_API_KEY !== 'your-cloudinary-api-key' &&
           process.env.CLOUDINARY_CLOUD_NAME !== 'your-cloudinary-cloud-name';
};

const uploadDocument = async (req, res) => {
    try {
        // Check if Cloudinary is configured
        if (!isCloudinaryConfigured()) {
            return res.status(503).json({
                success: false,
                message: 'Document upload service unavailable. Cloudinary is not configured. Please contact administrator.'
            });
        }

        const {
            employeeId,
            title,
            documentType,
            description,
            expiryDate,
            tags,
            isPublic = false
        } = req.body;

        if (!req.files || !req.files.document) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const file = req.files.document;

        // Validate file type
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.mimetype)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid file type. Only PDF, JPG, PNG, DOC, DOCX allowed'
            });
        }

        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            return res.status(400).json({
                success: false,
                message: 'File size exceeds 10MB limit'
            });
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: `ems/documents/${employeeId}`,
            resource_type: 'auto',
            access_mode: isPublic ? 'public' : 'authenticated'
        });

        // Create document record
        const document = await Document.create({
            employee: employeeId,
            title,
            documentType,
            fileUrl: result.secure_url,
            cloudinaryId: result.public_id,
            fileType: file.mimetype,
            fileSize: file.size,
            uploadedBy: req.user.id,
            description,
            expiryDate,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            accessControl: {
                isPublic
            },
            metadata: {
                originalName: file.name,
                encoding: file.encoding,
                mimetype: file.mimetype
            }
        });

        // Send notification to employee
        await createNotification({
            recipient: employeeId,
            sender: req.user.id,
            type: 'document_uploaded',
            title: 'New Document Uploaded',
            message: `A new ${documentType} document has been uploaded: ${title}`,
            data: { documentId: document._id },
            actionUrl: `/documents/${document._id}`
        });

        return res.status(201).json({
            success: true,
            message: 'Document uploaded successfully',
            data: document
        });
    } catch (error) {
        console.error('Upload document error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error uploading document',
            error: error.message
        });
    }
};

module.exports = uploadDocument;