import Tesseract from "tesseract.js";

export interface OCRResult {
  text: string;
  confidence: number;
  language: string;
}

export async function extractTextFromImage(
  imageSource: string | File | Blob
): Promise<OCRResult> {
  try {
    const result = await Tesseract.recognize(imageSource, "eng+hin", {
      logger: (m) => {
        if (m.status === "recognizing text") {
          console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
        }
      },
    });

    return {
      text: result.data.text.trim(),
      confidence: result.data.confidence,
      language: "eng",
    };
  } catch (error) {
    console.error("OCR extraction error:", error);
    throw new Error(
      "Failed to extract text from image. Please ensure the image is clear and readable."
    );
  }
}

export async function extractTextFromMultipleImages(
  images: (string | File | Blob)[]
): Promise<OCRResult> {
  const results: string[] = [];
  let totalConfidence = 0;

  for (const image of images) {
    const result = await extractTextFromImage(image);
    results.push(result.text);
    totalConfidence += result.confidence;
  }

  return {
    text: results.join("\n\n---\n\n"),
    confidence: totalConfidence / images.length,
    language: "eng",
  };
}

export function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/bmp", "image/tiff"];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Invalid file type. Please upload JPEG, PNG, WebP, BMP, or TIFF images.",
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: "File is too large. Maximum size is 10MB.",
    };
  }

  return { valid: true };
}
