"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { CommunityReport } from "@/types";
import { upvoteReportAction } from "@/actions/community";
import { formatRelativeTime, getCategoryLabel, getCategoryColor } from "@/lib/utils";
import { ThumbsUp, Eye, AlertCircle, CheckCircle2, Clock, XCircle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface CommunityReportCardProps {
  report: CommunityReport;
}

export function CommunityReportCard({ report }: CommunityReportCardProps) {
  const [upvoting, setUpvoting] = useState(false);
  const [upvotes, setUpvotes] = useState(report.upvotes);
  const router = useRouter();

  const handleUpvote = async () => {
    setUpvoting(true);
    await upvoteReportAction(report.id);
    setUpvotes((prev) => prev + 1);
    setUpvoting(false);
    router.refresh();
  };

  const getStatusIcon = () => {
    switch (report.status) {
      case "verified":
        return <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />;
      case "under_review":
        return <Clock className="h-3.5 w-3.5 text-yellow-400" />;
      case "rejected":
        return <XCircle className="h-3.5 w-3.5 text-red-400" />;
      default:
        return <AlertCircle className="h-3.5 w-3.5 text-gray-400" />;
    }
  };

  const getStatusBadge = () => {
    switch (report.status) {
      case "verified":
        return <Badge variant="safe">Verified</Badge>;
      case "under_review":
        return <Badge variant="warning">Under Review</Badge>;
      case "rejected":
        return <Badge variant="danger">Rejected</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <Card className="bg-gray-900/50 border-white/10 hover:border-white/20 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryColor(report.category)}`}>
                {getCategoryLabel(report.category)}
              </span>
              {getStatusBadge()}
              {report.is_verified && (
                <Badge variant="info">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Confirmed Scam
                </Badge>
              )}
            </div>
            <h3 className="text-base font-semibold text-white leading-tight">{report.title}</h3>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-gray-400 line-clamp-3">{report.description}</p>

        {report.company_name && (
          <div className="text-xs text-gray-500">
            Company: <span className="text-gray-300">{report.company_name}</span>
          </div>
        )}

        {report.recruiter_name && (
          <div className="text-xs text-gray-500">
            Recruiter: <span className="text-gray-300">{report.recruiter_name}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUpvote}
              disabled={upvoting}
              className="text-gray-400 hover:text-green-400 gap-1.5 h-7 px-2"
            >
              <ThumbsUp className="h-3.5 w-3.5" />
              <span className="text-xs">{upvotes}</span>
            </Button>
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Eye className="h-3 w-3" />
              {report.view_count}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {report.user && (
              <div className="flex items-center gap-1.5">
                <Avatar className="h-5 w-5">
                  <AvatarFallback className="bg-blue-600 text-white text-[10px]">
                    {report.user.full_name?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-gray-400">{report.user.full_name}</span>
              </div>
            )}
            <span className="text-xs text-gray-500">{formatRelativeTime(report.created_at)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
