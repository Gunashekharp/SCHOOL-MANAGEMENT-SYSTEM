export const downloadCSV = (data: any[], filename: string) => {
  if (!data || !data.length) {
    alert("No data available to export.");
    return;
  }

  const headers = Object.keys(data[0]).join(',');
  
  const rows = data.map(row =>
    Object.values(row).map(val => {
      const strVal = String(val);
      // Escape quotes and wrap in quotes if there are commas, quotes, or newlines
      if (strVal.includes(',') || strVal.includes('"') || strVal.includes('\n')) {
        return `"${strVal.replace(/"/g, '""')}"`;
      }
      return strVal;
    }).join(',')
  );

  const csvContent = [headers, ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
