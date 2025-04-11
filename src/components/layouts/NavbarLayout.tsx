
import React from "react";
import Navbar from "../Navbar";

interface NavbarLayoutProps {
  children: React.ReactNode;
}

const NavbarLayout: React.FC<NavbarLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default NavbarLayout;
