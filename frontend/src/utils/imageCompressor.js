/**
 * Compresses an image File using HTML5 Canvas to avoid huge Base64 payloads.
 * Returns a Promise that resolves to a compressed Data URL string.
 */
export async function compressImage(file, maxWidth = 1024, maxHeight = 1024, quality = 0.75) {
  if (!file || !file.type || !file.type.startsWith('image/')) {
    return '';
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result || '');
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        resolve(canvas.toDataURL(mimeType, quality));
      };
      img.onerror = () => resolve(e.target?.result || '');
      img.src = e.target?.result;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}
