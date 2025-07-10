/* eslint-disable @next/next/no-img-element */

import React, { useState } from "react";
import LeftSidebar from "./LeftSideBar";
import TopHeader from "./Header";

export default function AuthLayout({ children }) {
  const [manageToggleButton, setToggleButton] = useState(false);
  return (
    <>
      <div className="dashboard-wrapper">
        <div className="dashboard-sidebar">
          <LeftSidebar
            manageToggleButton={manageToggleButton}
            setToggleButton={setToggleButton}
          />
        </div>
        <div className="dashboard-content main-container">
          <TopHeader
            manageToggleButton={manageToggleButton}
            setToggleButton={setToggleButton}
          />

          <main className="flex-grow-1 p-4 ">{children}</main>
        </div>
      </div>
    </>
  );
}
