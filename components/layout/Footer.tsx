import Link from "next/link";
import { Shield} from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-gray-950">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">
                Intern<span className="text-blue-400">Shield</span> AI
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Protecting students from fake internships, scam recruiters, and fraudulent job offers using AI-powered detection.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/scanner" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Text Scanner
                </Link>
              </li>
              <li>
                <Link href="/analyzer" className="text-sm text-gray-400 hover:text-white transition-colors">
                  OCR Analyzer
                </Link>
              </li>
              <li>
                <Link href="/offer-letter" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Offer Letter Check
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Community Reports
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          {/* <div>
            <h3 className="text-sm font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/docs" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <span className="text-sm text-gray-400">API Reference</span>
              </li>
              <li>
                <span className="text-sm text-gray-400">Safety Tips</span>
              </li>
              <li>
                <span className="text-sm text-gray-400">Blog</span>
              </li>
            </ul>
          </div> */}

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4"></h3>
            <ul className="space-y-2">
            </ul>
            {/* <div className="flex gap-3 mt-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer">
                <Github className="h-4 w-4" />
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer">
                <Twitter className="h-4 w-4" />
              </span>
            </div> */}
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} InternShield AI. All rights reserved.
          </p>
          {/* <p className="text-sm text-gray-500 flex items-center gap-1">
            Made with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> for students everywhere
          </p> */}
        </div>
      </div>
    </footer>
  );
}
