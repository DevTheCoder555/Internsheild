import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Shield,
  ScanSearch,
  Camera,
  FileText,
  Users,
  Zap,
  Lock,
  Brain,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  ShieldAlert,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm text-blue-400 mb-6">
            <Shield className="h-4 w-4" />
            AI-Powered Scam Detection
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance max-w-4xl mx-auto">
            Don&apos;t Fall for{" "}
            <span className="gradient-text">Fake Internships</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto text-balance">
            InternShield AI analyzes internship offers, recruiter messages, and job ads in real-time to protect students from scams. Powered by advanced AI.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="shield" size="xl" asChild>
              <Link href="/scanner">
                <ScanSearch className="h-5 w-5 mr-2" />
                Scan Now - It&apos;s Free
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
            <Button variant="glass" size="xl" asChild>
              <Link href="/community">
                <Users className="h-5 w-5 mr-2" />
                Browse Reports
              </Link>
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-green-400" />
              100% Free
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="h-4 w-4 text-blue-400" />
              Private & Secure
            </span>
            <span className="flex items-center gap-1.5">
              <Brain className="h-4 w-4 text-purple-400" />
              AI-Powered Analysis
            </span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Four Powerful Detection Tools
            </h2>
            <p className="mt-4 text-gray-400 max-w-xl mx-auto">
              Comprehensive scam detection for every type of fraudulent internship or job offer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: ScanSearch,
                title: "Internship Ad Scanner",
                description:
                  "Paste WhatsApp messages, Telegram posts, LinkedIn ads, or email offers. Get instant scam analysis with detailed risk breakdown.",
                color: "text-blue-400",
                bgColor: "bg-blue-500/10",
                href: "/scanner",
              },
              {
                icon: FileText,
                title: "Offer Letter Analyzer",
                description:
                  "Upload offer letters as PDF or image. Our AI extracts and analyzes every detail for forgery indicators and scam patterns.",
                color: "text-purple-400",
                bgColor: "bg-purple-500/10",
                href: "/offer-letter",
              },
              {
                icon: Camera,
                title: "Screenshot OCR Scanner",
                description:
                  "Upload screenshots from any platform. Advanced OCR extracts text and our AI analyzes it for scam indicators.",
                color: "text-green-400",
                bgColor: "bg-green-500/10",
                href: "/analyzer",
              },
              {
                icon: Users,
                title: "Community Reports",
                description:
                  "Report scam companies and recruiters. Browse verified reports from other students to stay informed.",
                color: "text-orange-400",
                bgColor: "bg-orange-500/10",
                href: "/community",
              },
            ].map((feature) => (
              <Link key={feature.title} href={feature.href}>
                <Card className="glass-card-hover h-full cursor-pointer group">
                  <CardContent className="p-6">
                    <div className={`inline-flex rounded-lg p-3 ${feature.bgColor} mb-4`}>
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                    <div className="mt-4 flex items-center gap-1 text-sm text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Try now <ArrowRight className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              How It Works
            </h2>
            <p className="mt-4 text-gray-400">
              Three simple steps to verify any internship or job offer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "Submit Content",
                description:
                  "Paste text, upload a screenshot, or submit an offer letter. Any format works.",
                icon: Zap,
              },
              {
                step: "02",
                title: "AI Analysis",
                description:
                  "Gemini AI analyzes content for payment scams, fake recruiters, manipulation tactics, and unrealistic claims.",
                icon: Brain,
              },
              {
                step: "03",
                title: "Get Report",
                description:
                  "Receive a detailed risk score, red flags, AI explanation, and actionable recommendations.",
                icon: ShieldAlert,
              },
            ].map((item) => (
              <div key={item.step} className="text-center space-y-4">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-500/10 border border-blue-500/20">
                  <span className="text-2xl font-bold text-blue-400">{item.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Red Flags Section */}
      <section className="py-20 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Red Flags We Detect
              </h2>
              <p className="mt-4 text-gray-400">
                Our AI identifies these common scam patterns.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: "Payment Requests", desc: "Registration fees, training fees, security deposits" },
                { title: "Fake Email Domains", desc: "Gmail, Yahoo recruiters instead of company domains" },
                { title: "Urgency Tactics", desc: "\"Act now\", \"limited seats\", \"expires today\"" },
                { title: "Unrealistic Salary", desc: "Too-good-to-be-true compensation for simple work" },
                { title: "No Interview", desc: "Instant hiring without any assessment process" },
                { title: "Missing Details", desc: "No company website, address, or HR contact" },
              ].map((flag) => (
                <div key={flag.title} className="glass-card p-4 flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-white">{flag.title}</h4>
                    <p className="text-xs text-gray-400 mt-1">{flag.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-white/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto glass-card p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to Verify That Offer?
            </h2>
            <p className="text-gray-400 mb-8">
              Don&apos;t risk your time, money, or personal data. Scan any suspicious internship offer right now.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="shield" size="lg" asChild>
                <Link href="/scanner">
                  <ScanSearch className="h-5 w-5 mr-2" />
                  Start Scanning
                </Link>
              </Button>
              <Button variant="glass" size="lg" asChild>
                <Link href="/register">Create Free Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
