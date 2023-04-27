import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import '../../styles/header.scss'
const HeaderList = [
  {
    id: 1,
    name: 'Journey',
    path: '/'
  },
  {
    id: 2,
    name: 'Station',
    path: '/station'
  },
  {
    id: 3,
    name: 'Add Journey',
    path: '/add-journey'
  },
  {
    id: 4,
    name: 'Add Station',
    path: '/add-station'
  },
]
const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Hide toggle button on desktop view
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const setResponsiveness = () => {
      setIsMobile(window.innerWidth < 768);
    };
    setResponsiveness();
    window.addEventListener("resize", setResponsiveness);
    return () => {
      window.removeEventListener("resize", setResponsiveness);
    };
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <nav className="nav">
      <div className="nav-menu">
        <div className="nav-menu__container">
          {HeaderList.map(item => (
            <NavLink
              key={item.id}
              // exact
              to={`${item.path}`}
              style={({ isActive }) => ({
                color: isActive ? '#fff' : '#545e6f',
                background: isActive ? '#555' : '#333',
              })}
              className={`nav-menu__item ${location === item.path ? 'is-active' : ''}`} >
              {item.name}
            </NavLink>
          ))}
        </div>

      </div>
      {isMobile && (
        <div className="nav-right">
          <button
            className={`nav-toggle ${isOpen ? 'is-active' : ''}`}
            onClick={handleToggle}
          >
            X
          </button>
        </div>
      )}
    </nav>
  );
};

export default Nav;
