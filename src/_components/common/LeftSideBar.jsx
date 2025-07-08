"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  RiInstagramLine,
  RiFacebookBoxLine,
  RiTwitterLine,
  RiPinterestLine,
  RiSnapchatLine,
  RiTiktokLine,
  RiBarChartLine,
  RiLogoutBoxLine,
} from "react-icons/ri";
import ConfirmPopup from "./ConfirmPopup";
import DarkModeSwitcher from "./DarkModeSwitcher";
import Image from "next/image";
import { toast } from "react-toastify";
import { Button } from "react-bootstrap";

const nav = [
  // {
  //   label: "Instagram",
  //   icon: <RiInstagramLine />,
  //   path: "/campaigns/instagram",
  // },
  // {
  //   label: "Facebook",
  //   icon: <RiFacebookBoxLine />,
  //   path: "/campaigns/facebook",
  // },
  // { label: "Twitter", icon: <RiTwitterLine />, path: "/campaigns/twitter" },
  // { label: "Snapchat", icon: <RiSnapchatLine />, path: "/campaigns/snapchat" },
  // { label: "TikTok", icon: <RiTiktokLine />, path: "/campaigns/tiktok" },
  // {
  //   label: "Pinterest",
  //   icon: <RiPinterestLine />,
  //   path: "/campaigns/pinterest",
  // },
  {
    label: "Analytics",
    icon: <RiBarChartLine />,
    path: "/campaigns/analytics",
  },
];

export default function LeftSidebar({ manageToggleButton, setToggleButton }) {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogout, setShowLogout] = useState(false);

  const active = (p) => pathname === p || pathname.startsWith(p + "/");

  const logout = () => {
    localStorage.removeItem("token");
    setShowLogout(false);
    toast.success("You have been logged out successfully!");
    router.replace("/sign-in");
  };
  return (
    <div className="sidebar-area" id="sidebar-area">
      <div className="logo position-relative d-flex align-items-center gap-3 justify-content-between">
        <Link
          href="/"
          className="d-block text-decoration-none position-relative"
        >
          <Image
            src="/images/new-logo.png"
            alt="Logo"
            width={0}
            height={0}
            sizes="100%"
          />
          <span className="logo-text fw-bold text-dark">
            Umbrella Performance
          </span>
        </Link>
        <Button
          className="sidebar-burger-menu bg-transparent p-0 border-0 opacity-0 z-n1 position-absolute top-50 end-0 translate-middle-y"
          id="sidebar-burger-menu"
          onClick={() => setToggleButton(false)}
        >
          <i className="ri-close-line"></i>
        </Button>
      </div>

      <aside
        id="layout-menu"
        className="layout-menu menu-vertical menu active h-100 overflow-auto"
        data-simplebar
      >
        <ul className="menu-inner">
          {nav?.map((nav, index) => {
            return (
              <li className="menu-item" key={index}>
                <Link
                  href={nav?.path}
                  // className="menu-link menu-toggle active"
                  className={`menu-link menu-toggle ${
                    active(nav?.path) ? "    active" : ""
                  }`}
                >
                  <span style={{ fontSize: "1.3rem" }}>{nav.icon}</span>
                  <span className="title">{nav.label}</span>
                  {/* <span className="count">18</span> */}
                </Link>
              </li>
            );
          })}

          <li className="menu-item">
            <Link
              href="#"
              className="menu-link"
              onClick={() => setShowLogout(true)}
            >
              <i className="ri-logout-box-r-line"></i>
              <span className="title">Logout</span>
            </Link>
          </li>
        </ul>
      </aside>
      <ConfirmPopup
        show={showLogout}
        title="Confirm Logout"
        message="Are you sure you want to sign out?"
        confirmText="Logout"
        onConfirm={logout}
        onCancel={() => setShowLogout(false)}
      />
    </div>
  );
}
