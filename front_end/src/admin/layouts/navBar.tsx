import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState, type ReactNode } from "react";
import logo from "@/assets/Logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import { useLogoutMutation } from "@/services/auth/authApi";
import { useDispatch } from "react-redux";
import { clearCredentials } from "@/redux/slices/adminSlice";

const ActiveNavLink = ({
  to,
  children,
  className = "",
}: {
  to: string;
  children: ReactNode;
  className?: string;
}) => {
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
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();
  const dispatch=useDispatch()
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    await logout()
      .unwrap()
      .then(() => {
        dispatch(clearCredentials())
        navigate("/admin");
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
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
              <ActiveNavLink to="/admin/service-orders">
                Service Orders
              </ActiveNavLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <ActiveNavLink to="/admin/orders">Orders</ActiveNavLink>
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
              <ActiveNavLink to="/admin/messages">Message</ActiveNavLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`${navigationMenuTriggerStyle()} relative bg-transparent after:absolute after:left-0 after:bottom-0 after:h-0.5 after:rounded after:transition-all after:duration-300 after:origin-left hover:after:w-full after:w-0 after:bg-black`}
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
            isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
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
              to="/admin/service-orders"
              className="block py-3 px-4 rounded-md hover:bg-gray-100 transition-colors duration-200 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Service Orders
            </Link>
            <Link
              to="/admin/orders"
              className="block py-3 px-4 rounded-md hover:bg-gray-100 transition-colors duration-200 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Orders
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
              to="/admin/messages"
              className="block py-3 px-4 rounded-md hover:bg-gray-100 transition-colors duration-200 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Message
            </Link>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleLogout();
              }}
              className="w-full text-left py-3 px-4 rounded-md hover:bg-red-50 transition-colors duration-200 font-medium text-red-600 flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default NavBar;
