"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScanSearch, FileWarning, ShieldAlert, TrendingUp } from "lucide-react";

interface DashboardStatsProps {
  totalScans: number;
  totalReports: number;
  avgScamScore: number;
  highRiskCount: number;
}

export function DashboardStats({ totalScans, totalReports, avgScamScore, highRiskCount }: DashboardStatsProps) {
  const stats = [
    {
      title: "Total Scans",
      value: totalScans,
      icon: ScanSearch,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      iconBg: "bg-blue-500/20",
    },
    {
      title: "Community Reports",
      value: totalReports,
      icon: FileWarning,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      iconBg: "bg-purple-500/20",
    },
    {
      title: "High Risk Detections",
      value: highRiskCount,
      icon: ShieldAlert,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      iconBg: "bg-red-500/20",
    },
    {
      title: "Avg. Scam Score",
      value: Math.round(avgScamScore),
      suffix: "/100",
      icon: TrendingUp,
      color: avgScamScore > 60 ? "text-red-400" : avgScamScore > 40 ? "text-yellow-400" : "text-green-400",
      bgColor: avgScamScore > 60 ? "bg-red-500/10" : avgScamScore > 40 ? "bg-yellow-500/10" : "bg-green-500/10",
      iconBg: avgScamScore > 60 ? "bg-red-500/20" : avgScamScore > 40 ? "bg-yellow-500/20" : "bg-green-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="bg-gray-900/50 border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">{stat.title}</p>
                <p className={`text-2xl font-bold mt-1 ${stat.color}`}>
                  {stat.value}
                  {"suffix" in stat && stat.suffix && (
                    <span className="text-sm text-gray-500">{stat.suffix}</span>
                  )}
                </p>
              </div>
              <div className={`rounded-lg p-2.5 ${stat.iconBg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
