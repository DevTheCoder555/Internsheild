"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import type { ScanResult } from "@/types";
import {
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Download,
} from "lucide-react";
import { getRiskColor, getScoreColor } from "@/lib/utils";

interface ScanResultDisplayProps {
  result: ScanResult;
  extractedText?: string;
}

export function ScanResultDisplay({ result, extractedText }: ScanResultDisplayProps) {
  const getRiskIcon = () => {
    switch (result.risk_level) {
      case "safe":
        return <ShieldCheck className="h-6 w-6 text-shield-safe" />;
      case "low":
        return <ShieldCheck className="h-6 w-6 text-green-500" />;
      case "medium":
        return <AlertTriangle className="h-6 w-6 text-shield-warning" />;
      case "high":
        return <ShieldAlert className="h-6 w-6 text-orange-500" />;
      case "critical":
        return <ShieldX className="h-6 w-6 text-shield-danger" />;
      default:
        return <Info className="h-6 w-6 text-gray-500" />;
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <XCircle className="h-4 w-4 text-red-400" />;
      case "high":
        return <AlertTriangle className="h-4 w-4 text-orange-400" />;
      case "medium":
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      default:
        return <Info className="h-4 w-4 text-green-400" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "payment_scam":
        return "Payment Scam";
      case "fake_recruiter":
        return "Fake Recruiter";
      case "psychological_manipulation":
        return "Manipulation";
      case "unrealistic_claims":
        return "Unrealistic Claims";
      case "missing_details":
        return "Missing Details";
      default:
        return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "payment_scam":
        return "bg-purple-500/20 text-purple-400";
      case "fake_recruiter":
        return "bg-red-500/20 text-red-400";
      case "psychological_manipulation":
        return "bg-orange-500/20 text-orange-400";
      case "unrealistic_claims":
        return "bg-yellow-500/20 text-yellow-400";
      case "missing_details":
        return "bg-blue-500/20 text-blue-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const progressColor =
    result.scam_score <= 20
      ? "bg-green-500"
      : result.scam_score <= 40
        ? "bg-green-400"
        : result.scam_score <= 60
          ? "bg-yellow-500"
          : result.scam_score <= 80
            ? "bg-orange-500"
            : "bg-red-500";

  return (
    <div className="space-y-6">
      {/* Score Overview */}
      <Card className="bg-gray-900/50 border-white/10 backdrop-blur">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-white">Analysis Result</CardTitle>
            <Badge
              variant={
                result.risk_level === "safe"
                  ? "safe"
                  : result.risk_level === "critical"
                    ? "critical"
                    : result.risk_level === "high"
                      ? "danger"
                      : "warning"
              }
            >
              {result.risk_level.toUpperCase()} RISK
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className={`text-5xl font-bold ${getScoreColor(result.scam_score)}`}>
                {result.scam_score}
              </div>
              <div className="text-xs text-gray-400 mt-1">SCAM SCORE</div>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                {getRiskIcon()}
                <span className={`font-semibold capitalize ${getRiskColor(result.risk_level)}`}>
                  {result.risk_level} Risk
                </span>
              </div>
              <Progress value={result.scam_score} className="h-2 bg-gray-800" indicatorClassName={progressColor} />
              <p className="text-xs text-gray-500">
                {result.scam_score <= 20
                  ? "This content appears safe. No major red flags detected."
                  : result.scam_score <= 40
                    ? "Low risk detected. Some minor concerns found."
                    : result.scam_score <= 60
                      ? "Moderate risk. Several suspicious elements detected."
                      : result.scam_score <= 80
                        ? "High risk. Multiple scam indicators found."
                        : "Critical risk. This is very likely a scam."}
              </p>
            </div>
          </div>

          <Separator className="bg-white/10" />

          {/* AI Explanation */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-400" />
              AI Analysis
            </h4>
            <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
              {result.ai_explanation}
            </p>
          </div>

          {/* Extracted Info */}
          {result.extracted_info && Object.values(result.extracted_info).some(Boolean) && (
            <>
              <Separator className="bg-white/10" />
              <div>
                <h4 className="text-sm font-semibold text-white mb-3">Extracted Information</h4>
                <div className="grid grid-cols-2 gap-3">
                  {result.extracted_info.company_name && (
                    <div className="rounded-lg bg-white/5 p-3">
                      <p className="text-xs text-gray-400">Company</p>
                      <p className="text-sm text-white font-medium">{result.extracted_info.company_name}</p>
                    </div>
                  )}
                  {result.extracted_info.recruiter_name && (
                    <div className="rounded-lg bg-white/5 p-3">
                      <p className="text-xs text-gray-400">Recruiter</p>
                      <p className="text-sm text-white font-medium">{result.extracted_info.recruiter_name}</p>
                    </div>
                  )}
                  {result.extracted_info.recruiter_email && (
                    <div className="rounded-lg bg-white/5 p-3">
                      <p className="text-xs text-gray-400">Email</p>
                      <p className="text-sm text-white font-medium">{result.extracted_info.recruiter_email}</p>
                    </div>
                  )}
                  {result.extracted_info.salary_mentioned && (
                    <div className="rounded-lg bg-white/5 p-3">
                      <p className="text-xs text-gray-400">Salary</p>
                      <p className="text-sm text-white font-medium">{result.extracted_info.salary_mentioned}</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Red Flags */}
      {result.red_flags.length > 0 && (
        <Card className="bg-gray-900/50 border-white/10 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-red-400" />
              Red Flags ({result.red_flags.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {result.red_flags.map((flag, index) => (
              <div
                key={index}
                className="rounded-lg border border-white/5 bg-white/5 p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getSeverityIcon(flag.severity)}
                    <span className="text-sm font-medium text-white">{flag.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryColor(flag.category)}`}>
                      {getCategoryLabel(flag.category)}
                    </span>
                    <Badge
                      variant={
                        flag.severity === "critical"
                          ? "critical"
                          : flag.severity === "high"
                            ? "danger"
                            : flag.severity === "medium"
                              ? "warning"
                              : "safe"
                      }
                    >
                      {flag.severity}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-300">{flag.description}</p>
                {flag.evidence && (
                  <div className="rounded bg-red-500/10 border border-red-500/20 px-3 py-2">
                    <p className="text-xs text-red-300 font-mono">&quot;{flag.evidence}&quot;</p>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {result.recommendations.length > 0 && (
        <Card className="bg-gray-900/50 border-white/10 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-3 text-sm text-gray-300">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
                  {rec}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Extracted Text (for OCR) */}
      {extractedText && (
        <Card className="bg-gray-900/50 border-white/10 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-lg text-white">Extracted Text</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono bg-black/30 rounded-lg p-4 max-h-64 overflow-auto">
              {extractedText}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
