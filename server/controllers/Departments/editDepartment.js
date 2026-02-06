const Department = require('../../models/Department');

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
