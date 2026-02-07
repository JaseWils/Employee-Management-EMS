# Salary Management System Documentation

## Overview
The Salary Management module handles employee compensation including basic salary, allowances, and deductions. This comprehensive system ensures accurate payroll processing and transparent salary management.

## Salary Components

### 1. Basic Salary
- The base salary amount for an employee
- Set per employee based on position, experience, and company policy
- Forms the foundation for calculating total compensation

### 2. Allowances (Added to basic salary)
Allowances are additional benefits provided to employees on top of their basic salary:

- **House Rent Allowance (HRA):** Housing support to help cover accommodation costs
- **Transport Allowance:** Commute support for daily travel expenses
- **Medical Allowance:** Healthcare coverage for medical expenses
- **Food Allowance:** Meal support or cafeteria benefits
- **Bonus:** Performance-based or annual bonuses
- **Other:** Miscellaneous allowances (e.g., communication, special duty, etc.)

### 3. Deductions (Subtracted from total)
Deductions are amounts subtracted from the gross salary:

- **Tax:** Income tax deduction as per applicable tax laws
- **Insurance:** Health/life insurance premiums
- **Provident Fund:** Retirement savings contribution
- **Loan:** Loan repayments (if any outstanding loans)
- **Advance:** Recovery of salary advances taken previously
- **Other:** Miscellaneous deductions (e.g., damages, unpaid leave, etc.)

## Salary Calculation Formula

```
Gross Salary = Basic Salary + Total Allowances
Total Allowances = HRA + Transport + Medical + Food + Bonus + Other Allowances
Total Deductions = Tax + Insurance + Provident Fund + Loan + Advance + Other Deductions
Net Salary = Gross Salary - Total Deductions
```

### Example Calculation:
```
Basic Salary:     $5,000
HRA:             $1,000
Transport:       $  200
Medical:         $  300
Food:            $  150
Total Allowances: $1,650

Tax:             $  800
Insurance:       $  150
Provident Fund:  $  250
Total Deductions: $1,200

Gross Salary:    $6,650 ($5,000 + $1,650)
Net Salary:      $5,450 ($6,650 - $1,200)
```

## How to Use the Salary Management System

### Adding a New Salary Record

1. Navigate to **Salary → Manage Salary** in the main menu
2. Click the **"Add Salary"** button at the top right
3. Fill in the salary form:
   - **Select Employee:** Choose the employee from the dropdown
   - **Basic Salary:** Enter the base salary amount
   - **Allowances Section:** Add applicable allowances
     - House Rent Allowance
     - Transport Allowance
     - Medical Allowance
     - Food Allowance
     - Bonus (if applicable)
     - Other allowances
   - **Deductions Section:** Add applicable deductions
     - Tax amount
     - Insurance premium
     - Provident Fund contribution
     - Loan repayment (if applicable)
     - Advance recovery (if applicable)
     - Other deductions
4. Review the automatically calculated **Net Salary**
5. Click **"Save"** to create the salary record

### Viewing Salary Records

1. Go to **Salary → Manage Salary**
2. View the table showing all employee salary records with:
   - Employee Name and ID
   - Department
   - Basic Salary
   - Total Allowances
   - Total Deductions
   - Net Salary
3. Use the search box to find specific employees
4. Use the "Show entries" dropdown to control how many records are displayed

### Editing Salary Information

1. Navigate to **Salary → Manage Salary**
2. Find the employee record you want to update
3. Click the **"Edit"** button next to the employee's row
4. Update the fields as needed:
   - Modify basic salary
   - Update allowances
   - Adjust deductions
5. Review the recalculated net salary
6. Click **"Save Changes"** to update the record

### Deleting Salary Records

1. Go to **Salary → Manage Salary**
2. Locate the salary record to delete
3. Click the **"Delete"** button
4. Confirm the deletion in the popup dialog
5. The record will be permanently removed from the system

**Note:** Exercise caution when deleting salary records, as this action cannot be undone.

## Processing Payroll

Once salary structures are set up, you can process monthly payroll:

1. Navigate to **Payroll → Process Payroll**
2. Select the month and year for payroll processing
3. Review the list of employees and their calculated salaries
4. Verify all salary components are correct
5. Click **"Process Payroll"** button
6. System generates payslips for all employees
7. Payslips can be:
   - Viewed online
   - Downloaded as PDF
   - Sent via email (if configured)

## Best Practices

### Setting Up Salaries
- Always verify employee information before creating salary records
- Ensure all statutory deductions (tax, provident fund) comply with local laws
- Document the rationale for salary adjustments
- Review and update salary records annually or as per company policy

### Regular Maintenance
- **Monthly:** Review and update allowances that may vary (bonuses, overtime)
- **Quarterly:** Verify tax deductions are accurate
- **Annually:** Conduct salary reviews and implement approved increments
- **As needed:** Update deductions for loan repayments or salary advances

### Security Considerations
- Salary information is highly sensitive
- Access to salary management should be restricted to authorized HR personnel
- Always log out when finished working with salary data
- Regular backups are recommended to prevent data loss

## API Endpoints Reference

For developers integrating with the salary management system:

### Create Salary
- **Endpoint:** `POST /api/v1/salary/add`
- **Auth Required:** Yes
- **Payload:** Employee ID, basic salary, allowances, deductions

### Get All Salaries
- **Endpoint:** `GET /api/v1/salary/all`
- **Auth Required:** Yes
- **Returns:** Array of all salary records

### Get Employee Salary
- **Endpoint:** `GET /api/v1/salary/employee/:employeeId`
- **Auth Required:** Yes
- **Returns:** Salary record for specific employee

### Update Salary
- **Endpoint:** `PUT /api/v1/salary/edit/:id`
- **Auth Required:** Yes
- **Payload:** Updated salary information

### Delete Salary
- **Endpoint:** `DELETE /api/v1/salary/delete/:id`
- **Auth Required:** Yes
- **Returns:** Success confirmation

## Troubleshooting

### Common Issues and Solutions

**Issue:** Cannot create salary for an employee
- **Solution:** Ensure the employee exists in the system first. Navigate to Employees → Employee List to verify.

**Issue:** Net salary calculation seems incorrect
- **Solution:** Double-check all allowances and deductions. Ensure no duplicate entries exist.

**Issue:** Cannot find a salary record
- **Solution:** Use the search function. Verify the employee has a salary record created.

**Issue:** Payroll processing fails
- **Solution:** Ensure all active employees have valid salary records. Check for any missing required fields.

## Support

For additional assistance with salary management:
- **Email:** support@ems.com
- **Phone:** +1 (555) 123-4567
- **Documentation:** See the Help Center within the application
- **Training:** Contact HR for salary management system training sessions

---

**Last Updated:** 2026-02-07  
**Version:** 1.0  
**Maintained By:** HR Department & IT Team
