import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";

export const SidebarData = [

  {
    title: "Home",
    path: "/home",
    icon: <AiIcons.AiFillHome />,
    cName: "nav-text",
  },
  {
    title: "Manage Accounts",
    path: "/manage",
    icon: <IoIcons.IoMdList/>,
    cName: "nav-text",
  },
  {
    title: "Attendance",
    path: "/attendance",
    icon: <FaIcons.FaList />,
    cName: "nav-text",
  },
  
  {
    title: "Reports",
    path: "/",
    icon: <FaIcons.FaList />,
    cName: "nav-text",
  },
  {
   title: "Logout",
    path: "/",
    icon: <FaIcons.FaSignOutAlt />,
    cName: "nav-text",
  }
]; 