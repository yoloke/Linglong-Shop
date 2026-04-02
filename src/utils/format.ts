export const formatFileSize = (size: string | number | undefined | null): string => {
  if (size === undefined || size === null || size === "") {
    return "--";
  }

  const numSize = Number(size);
  if (Number.isNaN(numSize)) {
    return "--";
  }

  const KB = 1024;
  const MB = KB * 1024;
  const GB = MB * 1024;

  if (numSize >= GB) {
    return `${(numSize / GB).toFixed(2)} GB`;
  }

  if (numSize >= MB) {
    return `${(numSize / MB).toFixed(2)} MB`;
  }

  return `${(numSize / KB).toFixed(2)} KB`;
};
