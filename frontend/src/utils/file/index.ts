export const downloadFile = (fileName: string, file: Blob) => {
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");

  link.href = url;

  link.setAttribute("download", fileName);

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
