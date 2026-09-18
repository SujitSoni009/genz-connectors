import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Network, Search, Bell, Menu } from 'lucide-react';
import { Button } from '../ui/Button';

export function Navbar() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const isLandingPage = location.pathname === '/';

  if (isAuthPage) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6 md:gap-10">
          <Link to="/" className="group flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 transition-all duration-300 group-hover:scale-105 group-hover:shadow-md">
              <Network className="h-5 w-5 text-white transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:rotate-12" />
            </div>
            <span className="inline-block font-serif text-xl font-bold transition-colors duration-300 group-hover:text-primary-700">GenZ Connectors</span>
          </Link>
          {!isLandingPage && (
            <nav className="hidden md:flex gap-6">
              <Link to="/dashboard" className="text-sm font-medium text-stone-600 transition-colors hover:text-primary-600 animated-underline">Dashboard</Link>
              <Link to="/discover" className="text-sm font-medium text-stone-600 transition-colors hover:text-primary-600 animated-underline">Discover</Link>
              <Link to="/projects" className="text-sm font-medium text-stone-600 transition-colors hover:text-primary-600 animated-underline">Projects</Link>
              <Link to="/events" className="text-sm font-medium text-stone-600 transition-colors hover:text-primary-600 animated-underline">Events</Link>
            </nav>
          )}
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          {isLandingPage ? (
            <nav className="flex items-center space-x-4">
              <Link to="/login" className="hidden sm:block text-sm font-medium text-stone-600 transition-colors hover:text-primary-600 animated-underline">
                Sign In
              </Link>
              <Button className="hover-lift hover-glow" asChild>
                <Link to="/signup">Get Started</Link>
              </Button>
            </nav>
          ) : (
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="hidden sm:inline-flex hover:text-primary-600 hover:bg-primary-50">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary-600 hover:bg-primary-50">
                <Bell className="h-5 w-5 transition-transform duration-300 hover:rotate-12 hover:scale-110" />
              </Button>
              <Link to="/profile/setup" className="h-8 w-8 overflow-hidden rounded-full border border-stone-200 bg-stone-100 flex items-center justify-center transition-all duration-300 hover:border-primary-300 hover:shadow-md hover:scale-105">
                <span className="text-sm font-medium text-stone-600">JD</span>
              </Link>
              <Button variant="ghost" size="icon" className="md:hidden hover:text-primary-600 hover:bg-primary-50">
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
