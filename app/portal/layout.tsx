import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressive Studio — Portal",
  description: "Portal interno de Impressive Studio",
};

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
