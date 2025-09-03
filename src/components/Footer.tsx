import { Link } from "react-router-dom";
import { PWAInstallButton } from "./PWAInstallButton";
export const Footer = () => {
  return <footer className="border-t border-border mt-auto bg-black">
      <div className="container mx-auto px-4 py-6 bg-black">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} NeuroDash. All rights reserved.
          </div>
          
          <div className="flex items-center gap-4">
            <nav className="flex gap-6">
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
            </nav>
            <PWAInstallButton />
          </div>
        </div>
      </div>
    </footer>;
};