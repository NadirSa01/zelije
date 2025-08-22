import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useState, type ReactNode } from "react";
import logo from "@/assets/Logo.png";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LanguageSelector } from "@/components/ui/language-selector";

const ActiveNavLink = ({ to, children, className = "" }: { to: string; children: ReactNode; className?: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
      <Link
        to={to}
        className={`relative bg-transparent after:absolute after:left-0 after:bottom-0 after:h-0.5 after:rounded after:transition-all after:duration-300 after:origin-left hover:after:w-full ${
          isActive ? "after:w-full after:bg-black" : "after:w-0 after:bg-black"
        } ${className}`}
      >
        {children}
      </Link>
    </NavigationMenuLink>
  );
};

function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useTranslation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <div className="flex justify-center items-start p-3 md:p-5 bg-gray-950"></div>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex justify-center items-center p-2 bg-gray-100 sticky top-0 z-50">
        <NavigationMenu viewport={false}>
          <NavigationMenuList className="flex items-center gap-4 xl:gap-8">
            <NavigationMenuItem>
              <ActiveNavLink to="/">{t("navigation.home")}</ActiveNavLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <ActiveNavLink to="/Collections">
                {t("navigation.collections")}
              </ActiveNavLink>
            </NavigationMenuItem>

            <NavigationMenuItem className="mx-2 xl:mx-4">
              <NavigationMenuLink className="hover:opacity-90 transition-opacity">
                <img
                  src={logo}
                  alt="Logo"
                  className="h-14 md:h-16 lg:h-18 w-auto"
                />
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <ActiveNavLink to="/Contact">
                {t("navigation.contact")}
              </ActiveNavLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link
                  to="/cart"
                  className="relative inline-flex items-center justify-center hover:scale-110 transition-all duration-300"
                >
                  {/* Modern Shopping Cart Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 lg:w-7 lg:h-7 transition-colors duration-300"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                    />
                  </svg>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <LanguageSelector />
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden bg-gray-100 sticky top-0 z-50">
        {/* Mobile Header */}
        <div className="flex justify-between items-center p-4">
          <div className="flex-1 flex justify-center">
              <LanguageSelector />
          </div>
          {/* Logo */}
          <div className="flex-1 flex justify-center">
            <img src={logo} alt="Logo" className="h-12 w-auto" />
          </div>
          

          {/* Cart Icon */}
          <Link
            to="/cart"
            className="mr-4 hover:scale-110 transition-all duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 hover:text-blue-600 transition-colors duration-300"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
          </Link>

          {/* Hamburger Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-md hover:bg-gray-200 transition-colors duration-200"
            aria-label="Toggle mobile menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`w-6 h-6 transform transition-transform duration-300 ${
                isMobileMenuOpen ? "rotate-90" : ""
              }`}
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu Items */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out bg-gray-100 ${
            isMobileMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 py-4 space-y-1 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg">
            <Link
              to="/"
              className="block py-3 px-4 rounded-md hover:bg-gray-100 transition-colors duration-200 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/Collections"
              className="block py-3 px-4 rounded-md hover:bg-gray-100 transition-colors duration-200 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Collections
            </Link>
            <Link
              to="/Contact"
              className="block py-3 px-4 rounded-md hover:bg-gray-100 transition-colors duration-200 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact us
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default NavBar;
