import React from "react";
import Footer from "./Footer";
import TopHeader from "./Header";

export default function AppLayout({ children }) {
  return (
    <div>
      {/* <TopHeader /> */}
      {children}
      {/* <Footer /> */}
    </div>
  );
}
