"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScanResultDisplay } from "@/components/scanner/ScanResultDisplay";
import { scanImageAction, scanTextAction } from "@/actions/scan";
import { toast } from "@/hooks/useToast";
import { validateImageFile } from "@/lib/ocr";
import type { ScanResult } from "@/types";
import { FileText, Upload, Loader2, X, Image as ImageIcon } from "lucide-react";

export default function OfferLetterPage() {
  const [activeTab, setActiveTab] = useState("upload");
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [extractedText, setExtractedText] = useState("");

  const handleImageSelect = useCallback((file: File) => {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast({ type: "error", title: "Invalid File", description: validation.error });
      return;
    }
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  }, []);

  const handleTextScan = async () => {
    if (!text.trim()) {
      toast({ type: "warning", title: "Empty", description: "Please paste the offer letter text." });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const response = await scanTextAction(text, "email");
      if (response.success && response.result) {
        setResult(response.result);
        toast({ type: "success", title: "Analysis Complete", description: `Risk: ${response.result.risk_level}` });
      } else {
        toast({ type: "error", title: "Failed", description: response.error });
      }
    } catch {
      toast({ type: "error", title: "Error", description: "Unexpected error." });
    } finally {
      setLoading(false);
    }
  };

  const handleImageScan = async () => {
    if (!image) {
      toast({ type: "warning", title: "No Image", description: "Please upload an offer letter image." });
      return;
    }
    setLoading(true);
    setResult(null);
    const formData = new FormData();
    formData.append("image", image);
    formData.append("scanType", "offer_letter");
    try {
      const response = await scanImageAction(formData);
      if (response.success && response.result) {
        setResult(response.result);
        setExtractedText(response.extractedText || "");
        toast({ type: "success", title: "Analysis Complete", description: `Risk: ${response.result.risk_level}` });
      } else {
        toast({ type: "error", title: "Failed", description: response.error });
      }
    } catch {
      toast({ type: "error", title: "Error", description: "Unexpected error." });
    } finally {
      setLoading(false);
    }
  };

  const clearImage = () => {
    setImage(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setResult(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Offer Letter Analyzer</h1>
        <p className="text-gray-400 mt-2">
          Upload or paste an internship/job offer letter. Our AI checks for forgery indicators, scam patterns, and missing details.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Card className="bg-gray-900/50 border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-400" />
                Submit Offer Letter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full bg-gray-800/50">
                  <TabsTrigger value="upload" className="flex-1">Upload Image/PDF</TabsTrigger>
                  <TabsTrigger value="paste" className="flex-1">Paste Text</TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="space-y-4 mt-4">
                  {!preview ? (
                    <div
                      onDrop={(e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files[0];
                        if (file) handleImageSelect(file);
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      className="border-2 border-dashed border-white/10 rounded-xl p-10 text-center hover:border-purple-500/30 transition-colors cursor-pointer"
                      onClick={() => document.getElementById("offer-upload")?.click()}
                    >
                      <Upload className="h-10 w-10 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400">Drop offer letter image here or click to upload</p>
                      <p className="text-xs text-gray-500 mt-2">JPEG, PNG, WebP, BMP (max 10MB)</p>
                      <input
                        id="offer-upload"
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
                      <img src={preview} alt="Offer letter" className="w-full rounded-lg border border-white/10" />
                      <button onClick={clearImage} className="absolute top-2 right-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  <Button variant="shield" className="w-full" size="lg" onClick={handleImageScan} disabled={loading || !image}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <FileText className="h-4 w-4 mr-2" />}
                    {loading ? "Analyzing..." : "Analyze Offer Letter"}
                  </Button>
                </TabsContent>

                <TabsContent value="paste" className="space-y-4 mt-4">
                  <div>
                    <Label className="text-gray-300">Offer Letter Text</Label>
                    <Textarea
                      placeholder="Paste the offer letter text here..."
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      rows={12}
                      className="mt-2 bg-gray-800/50 border-white/10 resize-none"
                    />
                  </div>
                  <Button variant="shield" className="w-full" size="lg" onClick={handleTextScan} disabled={loading || !text.trim()}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <FileText className="h-4 w-4 mr-2" />}
                    {loading ? "Analyzing..." : "Analyze Text"}
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div>
          {loading ? (
            <Card className="bg-gray-900/50 border-white/10 h-full">
              <CardContent className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-10 w-10 text-purple-400 animate-spin mb-4" />
                <p className="text-gray-400">Analyzing offer letter...</p>
              </CardContent>
            </Card>
          ) : result ? (
            <ScanResultDisplay result={result} extractedText={extractedText} />
          ) : (
            <Card className="bg-gray-900/50 border-white/10 h-full">
              <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                <FileText className="h-12 w-12 text-gray-600 mb-4" />
                <p className="text-gray-400 font-medium">No Analysis Yet</p>
                <p className="text-sm text-gray-500 mt-1">Upload or paste an offer letter to begin analysis.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
