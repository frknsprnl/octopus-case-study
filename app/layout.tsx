import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import CartDrawer from "@/components/ui/CartDrawer";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Octopus",
  description: "Manage your smart signage, watch your company grow.",
  icons: {
    icon: [{ url: "/images/octo-single.svg", type: "image/svg+xml" }]
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={poppins.variable}>
      <body className="font-poppins antialiased">
          <ThemeProvider>
            <AuthProvider>
              <CartProvider>
                {children}
                <CartDrawer />
              </CartProvider>
            </AuthProvider>
          </ThemeProvider>
        </body>
    </html>
  );
}
