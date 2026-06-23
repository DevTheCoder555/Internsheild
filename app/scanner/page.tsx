"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScanResultDisplay } from "@/components/scanner/ScanResultDisplay";
import { scanTextAction } from "@/actions/scan";
import { toast } from "@/hooks/useToast";
import type { ScanResult } from "@/types";
import { ScanSearch, Loader2, MessageSquare, Link2, Mail } from "lucide-react";

const platforms = [
  { value: "whatsapp", label: "WhatsApp", icon: MessageSquare },
  { value: "telegram", label: "Telegram", icon: MessageSquare },
  { value: "linkedin", label: "LinkedIn", icon: Link2 },
  { value: "email", label: "Email", icon: Mail },
  { value: "other", label: "Other", icon: ScanSearch },
];

export default function ScannerPage() {
  const [text, setText] = useState("");
  const [platform, setPlatform] = useState("whatsapp");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);

  const handleScan = async () => {
    if (!text.trim()) {
      toast({ type: "warning", title: "Empty Input", description: "Please paste the content you want to analyze." });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await scanTextAction(text, platform);
      if (response.success && response.result) {
        setResult(response.result);
        toast({ type: "success", title: "Analysis Complete", description: `Risk Level: ${response.result.risk_level.toUpperCase()}` });
      } else {
        toast({ type: "error", title: "Analysis Failed", description: response.error || "Please try again." });
      }
    } catch {
      toast({ type: "error", title: "Error", description: "An unexpected error occurred." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Internship Ad Scanner</h1>
        <p className="text-gray-400 mt-2">
          Paste any internship advertisement, message, or job offer text for AI-powered scam analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="space-y-4">
          <Card className="bg-gray-900/50 border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <ScanSearch className="h-5 w-5 text-blue-400" />
                Paste Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300 mb-2 block">Platform</Label>
                <div className="flex flex-wrap gap-2">
                  {platforms.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => setPlatform(p.value)}
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                        platform === p.value
                          ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                          : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <p.icon className="h-3 w-3" />
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="content" className="text-gray-300 mb-2 block">
                  Content to Analyze
                </Label>
                <Textarea
                  id="content"
                  placeholder="Paste the internship advertisement, WhatsApp message, Telegram post, LinkedIn message, or email offer here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={12}
                  className="bg-gray-800/50 border-white/10 resize-none"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">
                    Supports WhatsApp, Telegram, LinkedIn, Email, and other platforms
                  </span>
                  <span className={`text-xs ${text.length > 10000 ? "text-red-400" : "text-gray-500"}`}>
                    {text.length}/10,000
                  </span>
                </div>
              </div>

              <Button
                variant="shield"
                className="w-full"
                onClick={handleScan}
                disabled={loading || !text.trim()}
                size="lg"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <ScanSearch className="h-4 w-4" />
                    One-Click Verify
                  </span>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Sample Content */}
          <Card className="bg-gray-900/30 border-white/5">
            <CardContent className="p-4">
              <p className="text-xs text-gray-500 font-semibold mb-2">SAMPLE SCAM TEXT (for testing)</p>
              <button
                onClick={() =>
                  setText(
                    "URGENT! Limited seats available!! XYZ Technologies is offering internship with stipend of Rs. 50,000/month. No interview required. Send Rs. 2,500 registration fee to secure your spot. Contact: hr.xyztech@gmail.com. Hurry, only 3 days left! Instant joining. Guaranteed placement."
                  )
                }
                className="text-xs text-blue-400 hover:underline"
              >
                Load sample scam text
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Results Panel */}
        <div>
          {loading ? (
            <Card className="bg-gray-900/50 border-white/10 h-full">
              <CardContent className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-10 w-10 text-blue-400 animate-spin mb-4" />
                <p className="text-gray-400">Analyzing content with AI...</p>
                <p className="text-xs text-gray-500 mt-2">Checking for scam indicators</p>
              </CardContent>
            </Card>
          ) : result ? (
            <ScanResultDisplay result={result} />
          ) : (
            <Card className="bg-gray-900/50 border-white/10 h-full">
              <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                <ScanSearch className="h-12 w-12 text-gray-600 mb-4" />
                <p className="text-gray-400 font-medium">No Analysis Yet</p>
                <p className="text-sm text-gray-500 mt-1">
                  Paste content and click &quot;One-Click Verify&quot; to start the analysis.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
