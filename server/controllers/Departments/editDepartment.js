const Department = require('../../models/Department');

<<<<<<< HEAD
const editDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, head, isActive } = req.body;

        const department = await Department.findById(id);

        if (!department) {
            return res.status(404).json({
                success: false,
                message: 'Department not found'
            });
        }

        // Check if new name conflicts with existing department
        if (name && name !== department.name) {
            const existingDept = await Department.findOne({
                _id: { $ne: id },
                name: { $regex: new RegExp(`^${name}$`, 'i') }
            });

            if (existingDept) {
                return res.status(400).json({
                    success: false,
                    message: 'Department name already exists'
                });
            }
        }

        const updatedDepartment = await Department.findByIdAndUpdate(
            id,
            { name, description, head, isActive },
            { new: true, runValidators: true }
        ).populate('head', 'fullName email');

        return res.status(200).json({
            success: true,
            message: 'Department updated successfully',
            data: updatedDepartment
        });

    } catch (error) {
        console.error('Edit department error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error updating department',
            error: error.message
        });
    }
};

module.exports = editDepartment;
=======
const editDept = async (req, res) => {
  const deptId = req.params.id;
  const { name, head, description, isActive } = req.body;

  if (!deptId) {
    return res.status(400).json({
      message: 'Dept ID not found'
    });
  }

  try {
    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (head !== undefined) updateFields.head = head;
    if (description !== undefined) updateFields.description = description;
    if (isActive !== undefined) updateFields.isActive = isActive;

    const updatedDept = await Department.findByIdAndUpdate(
      deptId,
      updateFields,
      { new: true, runValidators: true } 
    );

    if (!updatedDept) {
      return res.status(404).json({
        message: 'Department not found',
        error: true
      });
    }

    res.status(200).json({
        message: "Department Updated Successfully",
        data: updatedDept,
        success: true
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating department',
      error: error.message
    });
  }
};

module.exports = editDept;
>>>>>>> 2b6bd551d067825577aa0957dbf4462a2172534d
