const Document = require('../../models/Document');

const getDocuments = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const { documentType, status, isExpired, search, page = 1, limit = 20 } = req.query;

        let query = {};

        if (employeeId) {
            query.employee = employeeId;
        }

        if (documentType) {
            query.documentType = documentType;
        }

        if (status) {
            query.status = status;
        }

        if (isExpired !== undefined) {
            query.isExpired = isExpired === 'true';
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $regex: search, $options: 'i' } }
            ];
        }

        const documents = await Document.find(query)
            .populate('employee', 'fullName email department')
            .populate('uploadedBy', 'name email')
            .populate('verifiedBy', 'name email')
            .sort({ uploadDate: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Document.countDocuments(query);

        // Get expiring soon count (within 30 days)
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        
        const expiringSoon = await Document.countDocuments({
            ...query,
            expiryDate: { $lte: thirtyDaysFromNow, $gte: new Date() },
            isExpired: false
        });

        return res.status(200).json({
            success: true,
            message: 'Documents retrieved successfully',
            data: documents,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit)
            },
            stats: {
                expiringSoon
            }
        });
    } catch (error) {
        console.error('Get documents error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error retrieving documents',
            error: error.message
        });
    }
};

module.exports = getDocuments;