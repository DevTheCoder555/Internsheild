"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CommunityReportCard } from "@/components/community/ReportCard";
import { ReportForm } from "@/components/community/ReportForm";
import { getCommunityReportsAction } from "@/actions/community";
import { useAuth } from "@/hooks/useAuth";
import type { CommunityReport } from "@/types";
import { Search, Filter, Users, Plus, Loader2 } from "lucide-react";
import Link from "next/link";

const categoryFilters = [
  { value: "all", label: "All" },
  { value: "fake_company", label: "Fake Company" },
  { value: "fake_recruiter", label: "Fake Recruiter" },
  { value: "fake_internship", label: "Fake Internship" },
  { value: "payment_scam", label: "Payment Scam" },
  { value: "other", label: "Other" },
];

export default function CommunityPage() {
  const { user } = useAuth();
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getCommunityReportsAction(1, 12, category, search || undefined);
      if (result.success && result.data) {
        setReports(result.data);
        setTotal(result.total || 0);
      }
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    } finally {
      setLoading(false);
    }
  }, [category, search]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Users className="h-8 w-8 text-blue-400" />
            Community Reports
          </h1>
          <p className="text-gray-400 mt-2">
            Browse and report fake companies, scam recruiters, and fraudulent internships.
          </p>
        </div>
        {user && (
          <Button variant="shield" onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-2" />
            {showForm ? "Close Form" : "Report a Scam"}
          </Button>
        )}
      </div>

      {showForm && user && (
        <div className="mb-8 animate-fade-in">
          <ReportForm />
        </div>
      )}

      {!user && (
        <Card className="bg-blue-500/10 border-blue-500/20 mb-8">
          <CardContent className="p-4 flex items-center justify-between">
            <p className="text-sm text-blue-300">
              Sign in to report scam companies and recruiters to help protect other students.
            </p>
            <Button variant="shield" size="sm" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search reports by title, company, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-gray-900/50 border-white/10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categoryFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setCategory(f.value)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                category === f.value
                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
        <span>{total} report{total !== 1 ? "s" : ""} found</span>
      </div>

      {/* Reports Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="bg-gray-900/50 border-white/10 animate-pulse">
              <CardContent className="p-6 space-y-3">
                <div className="h-4 w-20 bg-white/5 rounded" />
                <div className="h-5 w-3/4 bg-white/5 rounded" />
                <div className="h-3 w-full bg-white/5 rounded" />
                <div className="h-3 w-2/3 bg-white/5 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : reports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((report) => (
            <CommunityReportCard key={report.id} report={report} />
          ))}
        </div>
      ) : (
        <Card className="bg-gray-900/50 border-white/10">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Users className="h-12 w-12 text-gray-600 mb-4" />
            <p className="text-gray-400 font-medium">No Reports Found</p>
            <p className="text-sm text-gray-500 mt-1">
              {search || category !== "all"
                ? "Try adjusting your search or filter."
                : "Be the first to report a scam!"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
