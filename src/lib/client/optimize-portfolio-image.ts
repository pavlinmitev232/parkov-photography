const maxPortfolioImageDimension = 2560;
const optimizationThresholdBytes = 1.5 * 1024 * 1024;
const webpQuality = 0.86;

function canvasToBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/webp", webpQuality);
  });
}

function getOptimizedFileName(name: string) {
  const baseName = name.replace(/\.[^.]+$/, "") || "portfolio-photo";
  return `${baseName}.webp`;
}

export async function optimizePortfolioImage(file: File) {
  if (file.size <= optimizationThresholdBytes) {
    return file;
  }

  let bitmap: ImageBitmap | null = null;

  try {
    bitmap = await createImageBitmap(file);
    const scale = Math.min(
      1,
      maxPortfolioImageDimension / bitmap.width,
      maxPortfolioImageDimension / bitmap.height,
    );
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");

    if (!context) {
      return file;
    }

    context.drawImage(bitmap, 0, 0, width, height);
    const optimizedBlob = await canvasToBlob(canvas);

    if (!optimizedBlob || optimizedBlob.size >= file.size) {
      return file;
    }

    return new File([optimizedBlob], getOptimizedFileName(file.name), {
      type: optimizedBlob.type,
      lastModified: file.lastModified,
    });
  } catch {
    return file;
  } finally {
    bitmap?.close();
  }
}
