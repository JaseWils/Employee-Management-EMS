import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const exportToPDF = (data, columns, title) => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.setTextColor(102, 126, 234);
    doc.text(title, 14, 22);
    
    // Add metadata
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
    
    // Prepare table data
    const tableData = data.map(item => 
        columns.map(col => item[col.field] || 'N/A')
    );
    
    // Add table
    doc.autoTable({
        head: [columns.map(col => col.header)],
        body: tableData,
        startY: 35,
        theme: 'striped',
        headStyles: {
            fillColor: [102, 126, 234],
            textColor: 255,
            fontSize: 10,
            fontStyle: 'bold'
        },
        styles: {
            fontSize: 9,
            cellPadding: 3
        },
        alternateRowStyles: {
            fillColor: [245, 247, 250]
        }
    });
    
    // Save PDF
    doc.save(`${title}_${Date.now()}.pdf`);
};

export const exportToExcel = (data, columns, title) => {
    // Prepare data for Excel
    const excelData = data.map(item => {
        const row = {};
        columns.forEach(col => {
            row[col.header] = item[col.field] || 'N/A';
        });
        return row;
    });
    
    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);
    
    // Set column widths
    const colWidths = columns.map(col => ({
        wch: Math.max(col.header.length, 15)
    }));
    ws['!cols'] = colWidths;
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, title.substring(0, 31));
    
    // Save file
    XLSX.writeFile(wb, `${title}_${Date.now()}.xlsx`);
};

export const exportToCSV = (data, columns, title) => {
    // Prepare CSV content
    const headers = columns.map(col => col.header).join(',');
    const rows = data.map(item => 
        columns.map(col => {
            const value = item[col.field] || '';
            return `"${value.toString().replace(/"/g, '""')}"`;
        }).join(',')
    );
    
    const csv = [headers, ...rows].join('\n');
    
    // Create blob and download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${title}_${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};