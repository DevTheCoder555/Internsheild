"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScanResultDisplay } from "@/components/scanner/ScanResultDisplay";
import { scanImageAction } from "@/actions/scan";
import { toast } from "@/hooks/useToast";
import { validateImageFile } from "@/lib/ocr";
import type { ScanResult } from "@/types";
import { Camera, Upload, Loader2, X, Image as ImageIcon } from "lucide-react";

export default function AnalyzerPage() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [extractedText, setExtractedText] = useState<string>("");
  const [ocrProgress, setOcrProgress] = useState(0);

  const handleImageSelect = useCallback((file: File) => {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast({ type: "error", title: "Invalid File", description: validation.error });
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setExtractedText("");
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleImageSelect(file);
    },
    [handleImageSelect]
  );

  const handleScan = async () => {
    if (!image) {
      toast({ type: "warning", title: "No Image", description: "Please upload an image to analyze." });
      return;
    }

    setLoading(true);
    setResult(null);
    setOcrProgress(0);

    const formData = new FormData();
    formData.append("image", image);
    formData.append("scanType", "screenshot");

    try {
      setOcrProgress(30);
      const response = await scanImageAction(formData);
      setOcrProgress(100);

      if (response.success && response.result) {
        setResult(response.result);
        setExtractedText(response.extractedText || "");
        toast({
          type: "success",
          title: "Analysis Complete",
          description: `Risk Level: ${response.result.risk_level.toUpperCase()}`,
        });
      } else {
        toast({ type: "error", title: "Analysis Failed", description: response.error });
      }
    } catch {
      toast({ type: "error", title: "Error", description: "An unexpected error occurred." });
    } finally {
      setLoading(false);
      setOcrProgress(0);
    }
  };

  const clearImage = () => {
    setImage(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setResult(null);
    setExtractedText("");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Screenshot OCR Scanner</h1>
        <p className="text-gray-400 mt-2">
          Upload screenshots from WhatsApp, Telegram, Email, or any platform. Our OCR extracts the text and AI analyzes it for scams.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Panel */}
        <div className="space-y-4">
          <Card className="bg-gray-900/50 border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <Camera className="h-5 w-5 text-green-400" />
                Upload Screenshot
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!preview ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className="border-2 border-dashed border-white/10 rounded-xl p-12 text-center hover:border-blue-500/30 transition-colors cursor-pointer"
                  onClick={() => document.getElementById("image-upload")?.click()}
                >
                  <Upload className="h-10 w-10 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 font-medium">Drop image here or click to upload</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Supports JPEG, PNG, WebP, BMP (max 10MB)
                  </p>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/bmp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageSelect(file);
                    }}
                  />
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Uploaded screenshot"
                    className="w-full rounded-lg border border-white/10"
                  />
                  <button
                    onClick={clearImage}
                    className="absolute top-2 right-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="mt-2 flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-xs text-gray-500">{image?.name}</span>
                    <span className="text-xs text-gray-600">
                      ({((image?.size || 0) / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                </div>
              )}

              {loading && ocrProgress > 0 && ocrProgress < 100 && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Extracting text...</span>
                    <span className="text-blue-400">{ocrProgress}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-300 rounded-full"
                      style={{ width: `${ocrProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <Button
                variant="shield"
                className="w-full"
                size="lg"
                onClick={handleScan}
                disabled={loading || !image}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {ocrProgress > 0 && ocrProgress < 100 ? "Extracting Text..." : "Analyzing..."}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    OCR Scan & Analyze
                  </span>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results Panel */}
        <div>
          {loading ? (
            <Card className="bg-gray-900/50 border-white/10 h-full">
              <CardContent className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-10 w-10 text-blue-400 animate-spin mb-4" />
                <p className="text-gray-400">Processing image...</p>
                <p className="text-xs text-gray-500 mt-2">OCR extraction in progress</p>
              </CardContent>
            </Card>
          ) : result ? (
            <ScanResultDisplay result={result} extractedText={extractedText} />
          ) : (
            <Card className="bg-gray-900/50 border-white/10 h-full">
              <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                <Camera className="h-12 w-12 text-gray-600 mb-4" />
                <p className="text-gray-400 font-medium">No Analysis Yet</p>
                <p className="text-sm text-gray-500 mt-1">
                  Upload a screenshot to begin OCR text extraction and AI analysis.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
