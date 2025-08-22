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
              <ActiveNavLink to="/admin/dashboard">Dashboard</ActiveNavLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <ActiveNavLink to="/admin/clients">Clients</ActiveNavLink>
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
              <ActiveNavLink to="/admin/products">Products</ActiveNavLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <ActiveNavLink to="/admin/services">Services</ActiveNavLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <ActiveNavLink to="/admin/profile">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              </ActiveNavLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden bg-gray-100 sticky top-0 z-50">
        {/* Mobile Header */}
        <div className="flex justify-between items-center p-4">
          {/* Logo */}
          <div className="flex-1 flex justify-center">
            <img src={logo} alt="Logo" className="h-12 w-auto" />
          </div>

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
              to="/admin/dashboard"
              className="block py-3 px-4 rounded-md hover:bg-gray-100 transition-colors duration-200 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/admin/clients"
              className="block py-3 px-4 rounded-md hover:bg-gray-100 transition-colors duration-200 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Clients
            </Link>
            <Link
              to="/admin/products"
              className="block py-3 px-4 rounded-md hover:bg-gray-100 transition-colors duration-200 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              to="/admin/services"
              className="block py-3 px-4 rounded-md hover:bg-gray-100 transition-colors duration-200 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              to="/admin/profile"
              className="block py-3 px-4 rounded-md hover:bg-gray-100 transition-colors duration-200 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Profile
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default NavBar;
