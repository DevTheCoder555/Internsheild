"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createCommunityReportAction } from "@/actions/community";
import { toast } from "@/hooks/useToast";
import { Send, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const categories = [
  { value: "fake_company", label: "Fake Company" },
  { value: "fake_recruiter", label: "Fake Recruiter" },
  { value: "fake_internship", label: "Fake Internship" },
  { value: "payment_scam", label: "Payment Scam" },
  { value: "other", label: "Other" },
];

export function ReportForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    try {
      const result = await createCommunityReportAction({
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as "fake_company" | "fake_recruiter" | "fake_internship" | "payment_scam" | "other",
        companyName: formData.get("companyName") as string || undefined,
        recruiterName: formData.get("recruiterName") as string || undefined,
        recruiterContact: formData.get("recruiterContact") as string || undefined,
      });

      if (result.success) {
        toast({ type: "success", title: "Report Submitted", description: "Thank you for helping protect the community." });
        router.push("/community");
        router.refresh();
      } else {
        toast({ type: "error", title: "Submission Failed", description: result.error || "Please try again." });
      }
    } catch {
      toast({ type: "error", title: "Error", description: "An unexpected error occurred." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-gray-900/50 border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-blue-400" />
          Report a Scam
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="category" className="text-gray-300">Category</Label>
            <select
              id="category"
              name="category"
              required
              className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-white ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="title" className="text-gray-300">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g. Fake internship offer from XYZ company"
              required
              minLength={5}
              className="mt-1 bg-gray-800/50 border-white/10"
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-gray-300">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe the scam in detail. Include what happened, how you were contacted, and any red flags you noticed..."
              required
              minLength={20}
              rows={5}
              className="mt-1 bg-gray-800/50 border-white/10"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="companyName" className="text-gray-300">Company Name (if known)</Label>
              <Input
                id="companyName"
                name="companyName"
                placeholder="Company name"
                className="mt-1 bg-gray-800/50 border-white/10"
              />
            </div>
            <div>
              <Label htmlFor="recruiterName" className="text-gray-300">Recruiter Name (if known)</Label>
              <Input
                id="recruiterName"
                name="recruiterName"
                placeholder="Recruiter name"
                className="mt-1 bg-gray-800/50 border-white/10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="recruiterContact" className="text-gray-300">Recruiter Contact (email/phone)</Label>
            <Input
              id="recruiterContact"
              name="recruiterContact"
              placeholder="Email or phone number"
              className="mt-1 bg-gray-800/50 border-white/10"
            />
          </div>

          <Button
            type="submit"
            variant="shield"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Submitting...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Submit Report
              </span>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
