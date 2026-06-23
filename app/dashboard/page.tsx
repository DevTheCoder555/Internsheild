"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardStats } from "@/components/dashboard/StatsCards";
import { useAuth } from "@/hooks/useAuth";
import { getScanReportsAction } from "@/actions/scan";
import { deleteScanReportAction } from "@/actions/scan";
import { formatDate, getRiskColor } from "@/lib/utils";
import type { ScanReport } from "@/types";
import { LayoutDashboard, ScanSearch, Trash2, Loader2, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/useToast";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [reports, setReports] = useState<ScanReport[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchReports = async () => {
      const result = await getScanReportsAction(1, 20);
      if (result.success && result.data) {
        setReports(result.data as ScanReport[]);
      }
      setLoading(false);
    };

    if (!authLoading && user) {
      fetchReports();
    }
  }, [authLoading, user]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this scan report?")) return;
    const result = await deleteScanReportAction(id);
    if (result.success) {
      setReports((prev) => prev.filter((r) => r.id !== id));
      toast({ type: "success", title: "Deleted", description: "Report deleted successfully." });
      router.refresh();
    } else {
      toast({ type: "error", title: "Error", description: result.error || "Failed to delete." });
    }
  };

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <LayoutDashboard className="h-12 w-12 text-gray-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Sign In Required</h1>
        <p className="text-gray-400 mb-6">Please sign in to access your dashboard.</p>
        <Button variant="shield" asChild>
          <Link href="/login">Sign In</Link>
        </Button>
      </div>
    );
  }

  const totalScans = reports.length;
  const highRiskCount = reports.filter((r) => r.risk_level === "high" || r.risk_level === "critical").length;
  const avgScamScore = totalScans > 0 ? reports.reduce((sum, r) => sum + r.scam_score, 0) / totalScans : 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <LayoutDashboard className="h-8 w-8 text-blue-400" />
          Dashboard
        </h1>
        <p className="text-gray-400 mt-2">
          Welcome back, {user.full_name || user.email}. Here&apos;s your activity overview.
        </p>
      </div>

      {/* Stats */}
      <DashboardStats
        totalScans={totalScans}
        totalReports={user.report_count || 0}
        avgScamScore={avgScamScore}
        highRiskCount={highRiskCount}
      />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <Link href="/scanner">
          <Card className="glass-card-hover cursor-pointer">
            <CardContent className="p-4 flex items-center gap-3">
              <ScanSearch className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-sm font-medium text-white">New Text Scan</p>
                <p className="text-xs text-gray-400">Analyze text content</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/analyzer">
          <Card className="glass-card-hover cursor-pointer">
            <CardContent className="p-4 flex items-center gap-3">
              <ScanSearch className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-sm font-medium text-white">OCR Scan</p>
                <p className="text-xs text-gray-400">Analyze screenshots</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/community">
          <Card className="glass-card-hover cursor-pointer">
            <CardContent className="p-4 flex items-center gap-3">
              <ShieldAlert className="h-5 w-5 text-purple-400" />
              <div>
                <p className="text-sm font-medium text-white">Community</p>
                <p className="text-xs text-gray-400">Browse reports</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Scans */}
      <Card className="bg-gray-900/50 border-white/10 mt-6">
        <CardHeader>
          <CardTitle className="text-white text-lg">Recent Scan Reports</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 bg-white/5 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : reports.length > 0 ? (
            <div className="space-y-2">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className={`text-lg font-bold ${getRiskColor(report.risk_level)}`}>
                      {report.scam_score}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-white truncate">
                        {report.company_name || report.input_text?.slice(0, 60) || "Scan Report"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {report.scan_type} &middot; {formatDate(report.created_at)}
                      </p>
                    </div>
                    <Badge
                      variant={
                        report.risk_level === "critical"
                          ? "critical"
                          : report.risk_level === "high"
                            ? "danger"
                            : report.risk_level === "medium"
                              ? "warning"
                              : "safe"
                      }
                    >
                      {report.risk_level}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 hover:text-red-400 ml-2"
                    onClick={() => handleDelete(report.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <ScanSearch className="h-10 w-10 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No scans yet</p>
              <p className="text-sm text-gray-500 mt-1">Start scanning to see your reports here.</p>
              <Button variant="shield" size="sm" asChild className="mt-4">
                <Link href="/scanner">Start Scanning</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
