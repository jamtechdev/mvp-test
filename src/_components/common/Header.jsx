"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaSun, FaSearch, FaBell, FaCog, FaExpand } from "react-icons/fa";
import { MdLanguage } from "react-icons/md";
import { Dropdown } from "react-bootstrap";
import DarkModeSwitcher from "./DarkModeSwitcher";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function TopHeader({ manageToggleButton, setToggleButton }) {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter(); // ← and this

  // Add / remove className on <body>
  // useEffect(() => {
  //   if(!manageToggleButton)
  //   document.body.classList.toggle("sidebar-collapsed", collapsed);

  //   // cleanup in case the component unmounts while collapsed
  //   return () => document.body.classList.remove("sidebar-collapsed");
  // }, [collapsed]);

  useEffect(() => {
    document.body.classList.toggle("sidebar-collapsed", manageToggleButton);

    return () => {
      document.body.classList.remove("sidebar-collapsed");
    };
  }, [manageToggleButton]);
  const logout = () => {
    localStorage.removeItem("token");
    false;
    toast.success("You have been logged out successfully!");
    router.replace("/sign-in");
  };
  return (
    <header className="top-header d-flex justify-content-between align-items-center px-3 py-2 shadow-sm ">
      {/* Logo & Toggle Button */}
      <div className="d-flex align-items-center gap-3 cursor-pointer">
        <i
          // onClick={() => setCollapsed((c) => !c)}
          onClick={() => setToggleButton((prev) => !prev)}
          className="ri-menu-2-line"
        ></i>
      </div>

      {/* Right Section */}
      <div className="d-flex align-items-center gap-3 profile-dropdown">
        <DarkModeSwitcher />
        <Dropdown>
          <Dropdown.Toggle
            // variant="link"
            className="d-flex align-items-center gap-1 icon-dropdown p-0 profile-toggle"
          >
            <Image
              src="/images/dummy-user.jpg"
              alt="User Avatar"
              width={32}
              height={32}
              className="rounded-circle"
            />
            <div>
              <span>Olivia</span>
              <i className="ri-arrow-drop-down-line"></i>
            </div>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <div className="p-2 profile-sec-header">
              <Image
                src="/images/dummy-user.jpg"
                alt="User Avatar"
                width={32}
                height={32}
                className="rounded-circle"
              />
              <div>
                <h3>Olivia</h3>
                <p>oli@gmail.com</p>
              </div>
            </div>
            <Dropdown.Item>
              <i className="ri-account-circle-line"></i> Profile
            </Dropdown.Item>
            <Dropdown.Item onClick={logout}>
              <i className="ri-logout-box-r-line"></i> Logout
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </header>
  );
}
