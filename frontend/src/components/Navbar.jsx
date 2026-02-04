import React from 'react';
import { Link, useLocation } from 'react-router';
import { Scan, History } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="navbar bg-base-100 shadow-sm px-4 sm:px-8 z-10 relative">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl gap-2 text-primary normal-case">
          <Scan className="w-6 h-6" />
          AI Receipt Scanner
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1 gap-2">
          <li>
            <Link 
              to="/" 
              className={isActive('/') ? 'active font-bold text-primary' : ''}
            >
              <Scan className="w-4 h-4" />
              Scan
            </Link>
          </li>
          <li>
            <Link 
              to="/logs" 
              className={isActive('/logs') ? 'active font-bold text-primary' : ''}
            >
              <History className="w-4 h-4" />
              History
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;