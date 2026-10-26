import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Textflow · Customer message generator",
  description: "Fill reusable templates and export personalized customer messages locally.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
    >
      <body >{children}</body>
    </html>
  );
}
