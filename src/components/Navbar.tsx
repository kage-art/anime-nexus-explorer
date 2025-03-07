
import { useState, useEffect } from 'react';
import { Moon, Sun, Search, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchBar from './SearchBar';

interface NavbarProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const Navbar = ({ toggleTheme, isDarkMode }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <a 
              href="/" 
              className="text-xl md:text-2xl font-bold text-primary transition-all duration-300 animate-in"
            >
              AnimeNexus
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a
              href="#"
              className="font-medium text-foreground/80 hover:text-primary transition-colors duration-200"
            >
              Home
            </a>
            <a
              href="#"
              className="font-medium text-foreground/80 hover:text-primary transition-colors duration-200"
            >
              Browse
            </a>
            <a
              href="#"
              className="font-medium text-foreground/80 hover:text-primary transition-colors duration-200"
            >
              New Releases
            </a>
            <a
              href="#"
              className="font-medium text-foreground/80 hover:text-primary transition-colors duration-200"
            >
              My List
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSearch}
              className="text-foreground/80 hover:text-primary transition-all duration-200"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-foreground/80 hover:text-primary transition-all duration-200"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-foreground/80 hover:text-primary transition-all duration-200"
              onClick={toggleMobileMenu}
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div 
        className={`w-full py-3 px-4 bg-background/95 backdrop-blur-lg border-b border-border transition-all duration-300 ${
          isSearchOpen ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="container mx-auto">
          <SearchBar onClose={toggleSearch} />
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-background/95 backdrop-blur-xl z-40 md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 translate-x-full pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-8 text-lg">
          <a
            href="#"
            className="font-medium text-foreground hover:text-primary transition-colors duration-200"
            onClick={toggleMobileMenu}
          >
            Home
          </a>
          <a
            href="#"
            className="font-medium text-foreground hover:text-primary transition-colors duration-200"
            onClick={toggleMobileMenu}
          >
            Browse
          </a>
          <a
            href="#"
            className="font-medium text-foreground hover:text-primary transition-colors duration-200"
            onClick={toggleMobileMenu}
          >
            New Releases
          </a>
          <a
            href="#"
            className="font-medium text-foreground hover:text-primary transition-colors duration-200"
            onClick={toggleMobileMenu}
          >
            My List
          </a>
          <div className="pt-6 flex items-center space-x-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                toggleTheme();
                toggleMobileMenu();
              }}
              className="h-10 w-10 rounded-full"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
