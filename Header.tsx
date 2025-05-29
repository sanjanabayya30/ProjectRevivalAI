import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Brain, Github, Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary-600" />
            <span className="font-bold text-xl text-gray-900">Project Revival AI</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <NavLink to="/" label="Home" currentPath={location.pathname} />
            <NavLink to="/upload" label="Upload Project" currentPath={location.pathname} />
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-primary-600 transition-colors flex items-center gap-1"
            >
              <Github className="h-4 w-4" />
              <span>GitHub</span>
            </a>
          </nav>
          
          <button 
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 animate-in">
          <div className="container-custom py-3 space-y-2">
            <MobileNavLink to="/" label="Home" onClick={toggleMenu} />
            <MobileNavLink to="/upload" label="Upload Project" onClick={toggleMenu} />
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block py-2 px-3 rounded-md text-gray-600 hover:text-primary-600 hover:bg-gray-100 transition-colors"
              onClick={toggleMenu}
            >
              <div className="flex items-center gap-2">
                <Github className="h-4 w-4" />
                <span>GitHub</span>
              </div>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

interface NavLinkProps {
  to: string;
  label: string;
  currentPath: string;
}

const NavLink: React.FC<NavLinkProps> = ({ to, label, currentPath }) => {
  const isActive = currentPath === to;
  
  return (
    <Link 
      to={to} 
      className={`transition-colors ${
        isActive 
          ? 'text-primary-600 font-medium' 
          : 'text-gray-600 hover:text-primary-600'
      }`}
    >
      {label}
    </Link>
  );
};

interface MobileNavLinkProps {
  to: string;
  label: string;
  onClick: () => void;
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ to, label, onClick }) => {
  return (
    <Link 
      to={to} 
      className="block py-2 px-3 rounded-md text-gray-600 hover:text-primary-600 hover:bg-gray-100 transition-colors"
      onClick={onClick}
    >
      {label}
    </Link>
  );
};

export default Header;