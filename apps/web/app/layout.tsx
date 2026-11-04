import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import WorkspaceSession from "../components/WorkspaceSession";
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.SITE_URL || "https://mohammed-abba-isa-legacy.pages.dev",
  ),
  title: {
    default: "Hon. Mohammed Abba Isa — A Record of Inclusion",
    template: "%s | Mohammed Abba Isa",
  },
  description:
    "A source-led record of Mohammed Abba Isa’s disability-inclusion work, explored through reports, figures, themes and connections.",
  robots: {
    index: process.env.RELEASE_MODE === "public",
    follow: process.env.RELEASE_MODE === "public",
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <div className="national-watermark" aria-hidden="true" />
        <WorkspaceSession>{children}</WorkspaceSession>
        {process.env.RELEASE_MODE === "public" &&
          /^[a-z0-9-]+$/.test(
            process.env.NEXT_PUBLIC_GOATCOUNTER_CODE || "",
          ) && (
            <Script
              src="https://gc.zgo.at/count.js"
              data-goatcounter={`https://${process.env.NEXT_PUBLIC_GOATCOUNTER_CODE}.goatcounter.com/count`}
              strategy="afterInteractive"
            />
          )}
      </body>
    </html>
  );
}
