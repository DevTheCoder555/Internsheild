import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return formatDate(date);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function getRiskColor(riskLevel: string): string {
  switch (riskLevel) {
    case "safe":
      return "text-shield-safe";
    case "low":
      return "text-green-500";
    case "medium":
      return "text-shield-warning";
    case "high":
      return "text-orange-500";
    case "critical":
      return "text-shield-danger";
    default:
      return "text-gray-500";
  }
}

export function getRiskBgColor(riskLevel: string): string {
  switch (riskLevel) {
    case "safe":
      return "bg-shield-safe/10 border-shield-safe/20";
    case "low":
      return "bg-green-500/10 border-green-500/20";
    case "medium":
      return "bg-shield-warning/10 border-shield-warning/20";
    case "high":
      return "bg-orange-500/10 border-orange-500/20";
    case "critical":
      return "bg-shield-danger/10 border-shield-danger/20";
    default:
      return "bg-gray-500/10 border-gray-500/20";
  }
}

export function getScoreColor(score: number): string {
  if (score <= 20) return "text-shield-safe";
  if (score <= 40) return "text-green-500";
  if (score <= 60) return "text-shield-warning";
  if (score <= 80) return "text-orange-500";
  return "text-shield-danger";
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    .trim();
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function calculateScamPercentage(score: number): number {
  return Math.min(100, Math.max(0, score));
}

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case "low":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case "medium":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "high":
      return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    case "critical":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
}

export function getCategoryLabel(category: string): string {
  switch (category) {
    case "fake_company":
      return "Fake Company";
    case "fake_recruiter":
      return "Fake Recruiter";
    case "fake_internship":
      return "Fake Internship";
    case "payment_scam":
      return "Payment Scam";
    case "other":
      return "Other";
    default:
      return category;
  }
}

export function getCategoryColor(category: string): string {
  switch (category) {
    case "fake_company":
      return "bg-red-500/20 text-red-400";
    case "fake_recruiter":
      return "bg-orange-500/20 text-orange-400";
    case "fake_internship":
      return "bg-yellow-500/20 text-yellow-400";
    case "payment_scam":
      return "bg-purple-500/20 text-purple-400";
    case "other":
      return "bg-blue-500/20 text-blue-400";
    default:
      return "bg-gray-500/20 text-gray-400";
  }
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function rateLimiter(
  key: string,
  maxRequests: number,
  windowMs: number
): Promise<{ allowed: boolean; remaining: number }> {
  if (typeof window === "undefined") {
    return { allowed: true, remaining: maxRequests };
  }

  const storageKey = `rate_limit_${key}`;
  const now = Date.now();

  try {
    const stored = sessionStorage.getItem(storageKey);
    if (!stored) {
      sessionStorage.setItem(
        storageKey,
        JSON.stringify({ count: 1, resetAt: now + windowMs })
      );
      return { allowed: true, remaining: maxRequests - 1 };
    }

    const data = JSON.parse(stored);

    if (now > data.resetAt) {
      sessionStorage.setItem(
        storageKey,
        JSON.stringify({ count: 1, resetAt: now + windowMs })
      );
      return { allowed: true, remaining: maxRequests - 1 };
    }

    if (data.count >= maxRequests) {
      return { allowed: false, remaining: 0 };
    }

    data.count += 1;
    sessionStorage.setItem(storageKey, JSON.stringify(data));
    return { allowed: true, remaining: maxRequests - data.count };
  } catch {
    return { allowed: true, remaining: maxRequests };
  }
}
