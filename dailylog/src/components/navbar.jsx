import React, { useState } from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { Link } from "react-router-dom";
import { SidebarData } from "./sidebar";
import "../App.css";
import './navbar.css'
import LogoutForm from "./LogoutForm";
import { IconContext } from "react-icons";

function Navbar() {
  const [sidebar, setSidebar] = useState(false);
  const [showLogoutForm, setShowLogoutForm] = useState(false);

  const showSidebar = () => setSidebar(true);
  const closeSidebar = () => setSidebar(false);

  return (
    <>
      <IconContext.Provider value={{ color: "undefined" }}>
        <div className="navbar">
          <Link to="#" className="menu-bars" onMouseEnter={showSidebar} onMouseLeave={closeSidebar}>
            <FaIcons.FaBars />
          </Link>
          
        </div>
        <nav className={sidebar ? "nav-menu active" : "nav-menu"} onMouseEnter={showSidebar} onMouseLeave={closeSidebar}>
          <ul className="nav-menu-items">
            <li className="navbar-toggle">
              <Link to="#" className="menu-bars">
                <AiIcons.AiOutlineClose />
              </Link>
            </li>
            {SidebarData.map((item, index) => (
              <li key={index} className={item.cName}>
                <Link to={item.path}>
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {showLogoutForm && <LogoutForm />}
      </IconContext.Provider>
    </>
  );
}

export default Navbar;
