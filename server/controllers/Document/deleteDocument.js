const Document = require('../../models/Document');
const cloudinary = require('cloudinary').v2;

const deleteDocument = async (req, res) => {
    try {
        const { documentId } = req.params;

        const document = await Document.findById(documentId);

        if (!document) {
            return res.status(404).json({
                success: false,
                message: 'Document not found'
            });
        }

        // Delete from Cloudinary
        if (document.cloudinaryId) {
            await cloudinary.uploader.destroy(document.cloudinaryId);
            
            // Delete previous versions too
            if (document.previousVersions && document.previousVersions.length > 0) {
                for (const version of document.previousVersions) {
                    if (version.cloudinaryId) {
                        await cloudinary.uploader.destroy(version.cloudinaryId);
                    }
                }
            }
        }

        await Document.findByIdAndDelete(documentId);

        return res.status(200).json({
            success: true,
            message: 'Document deleted successfully'
        });
    } catch (error) {
        console.error('Delete document error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error deleting document',
            error: error.message
        });
    }
};

module.exports = deleteDocument;