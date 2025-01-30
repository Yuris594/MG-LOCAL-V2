
import "./globals.css";
import theme from "./style";
import { Montserrat } from "next/font/google"
import { AuthProvider } from "@/context/authContext";
import { CssBaseline, ThemeProvider } from "@mui/material";

const inter = Montserrat({ 
  subsets: ["latin"],
  weight: ['400', '700'], 
});

export const metadata = {
  title: "MG-LOCAL",
  description: "...",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider> 
          <ThemeProvider theme={theme}>
            <CssBaseline />
              {children} 
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
