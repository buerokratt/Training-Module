export const saveCsv = async (data: unknown, name: string) => {
  // @ts-ignore
  const blob = new Blob([data], { type: 'text/csv' });
  const fileName = name + '.csv';

  if (window.showSaveFilePicker) {
    const handle = await window.showSaveFilePicker({ suggestedName: fileName });
    const writable = await handle.createWritable();
    await writable.write(blob);
    writable.close();
  } else {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }
};
