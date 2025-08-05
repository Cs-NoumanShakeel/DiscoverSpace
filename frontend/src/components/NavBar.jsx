import { Link } from "react-router-dom";
import earthicon from '../assets/earth.png';
import { useState, useEffect } from "react";
import "../styles/nav.css";

export default function NavBar() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMouseEnter = (menu) => {
    setActiveMenu(menu);
  };

  const handleMouseLeave = () => {
    setActiveMenu(null);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileDropdownClick = (menu) => {
    if (activeMenu === menu) {
      setActiveMenu(null);
    } else {
      setActiveMenu(menu);
    }
  };

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
        setActiveMenu(null);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav className="navbar">
      <div className="left">
        <Link to='/'><img src={earthicon} alt='Earth Logo' className='logo' /></Link>
      </div>

      {/* Mobile Toggle Button */}
      <div className="mobile-toggle" onClick={toggleMobileMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className={`middle ${isMobileMenuOpen ? 'active' : ''}`}>
        <div 
          className="dropdown"
          onMouseEnter={() => handleMouseEnter("APOD")}
          onMouseLeave={handleMouseLeave}
        >
          <span onClick={() => handleMobileDropdownClick("APOD")}>APOD</span>
          {activeMenu === "APOD" && (
            <div className="submenu">
              <Link to="/apod/today" onClick={() => setIsMobileMenuOpen(false)}>Today</Link>
              <Link to="/apod/archive" onClick={() => setIsMobileMenuOpen(false)}>Archive</Link>    
            </div>
          )}
        </div>

        <div 
          className="dropdown"
          onMouseEnter={() => handleMouseEnter("mission")}
          onMouseLeave={handleMouseLeave}
        >
          <span onClick={() => handleMobileDropdownClick("mission")}>Missions</span>
          {activeMenu === "mission" && (
            <div className="submenu">
              <Link to="/mission/upcoming" onClick={() => setIsMobileMenuOpen(false)}>Upcoming</Link>
              <Link to="/mission/historical" onClick={() => setIsMobileMenuOpen(false)}>Historical</Link>
            </div>
          )}
        </div>

        <Link to='/planet/planets' onClick={() => setIsMobileMenuOpen(false)}>Planets</Link>
        
        <div 
          className="dropdown"
          onMouseEnter={() => handleMouseEnter("Spacecraft & Launches")}
          onMouseLeave={handleMouseLeave}
        >
          <span onClick={() => handleMobileDropdownClick("Spacecraft & Launches")}>Spacecrafts & Launches</span>
          {activeMenu === "Spacecraft & Launches" && (
            <div className="submenu">
              <Link to="/spacecraftlaunches/spacecraft" onClick={() => setIsMobileMenuOpen(false)}>Spacecraft</Link>
              <Link to="/Spacecraftlaunches/launches" onClick={() => setIsMobileMenuOpen(false)}>Launches (Space X)</Link>
            </div>
          )}
        </div>
      </div>

      <div className={`right ${isMobileMenuOpen ? 'active' : ''}`}>
        <Link to='/register' onClick={() => setIsMobileMenuOpen(false)}>Sign up</Link>
        <Link to='/contribute' onClick={() => setIsMobileMenuOpen(false)}>Contribute</Link>
      </div>
    </nav>
  );
}