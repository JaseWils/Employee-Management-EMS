const Document = require('../../models/Document');
const createNotification = require('../Notification/createNotification');

const verifyDocument = async (req, res) => {
    try {
        const { documentId } = req.params;
        const { status, comments } = req.body; // status: 'approved' or 'rejected'

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be approved or rejected'
            });
        }

        const document = await Document.findByIdAndUpdate(
            documentId,
            {
                status,
                verifiedBy: req.user.id,
                verifiedAt: new Date(),
                ...(comments && { description: document.description + `\n\nVerification Comments: ${comments}` })
            },
            { new: true }
        ).populate('employee', 'fullName email');

        if (!document) {
            return res.status(404).json({
                success: false,
                message: 'Document not found'
            });
        }

        // Notify employee
        await createNotification({
            recipient: document.employee._id,
            sender: req.user.id,
            type: 'document_uploaded',
            title: `Document ${status}`,
            message: `Your ${document.documentType} document "${document.title}" has been ${status}`,
            data: { documentId: document._id },
            actionUrl: `/documents/${document._id}`,
            priority: 'high'
        });

        return res.status(200).json({
            success: true,
            message: `Document ${status} successfully`,
            data: document
        });
    } catch (error) {
        console.error('Verify document error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error verifying document',
            error: error.message
        });
    }
};

module.exports = verifyDocument;