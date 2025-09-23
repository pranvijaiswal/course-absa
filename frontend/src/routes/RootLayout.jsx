import React from "react";
import { Link, Outlet } from "react-router-dom";

function RootLayout() {
  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">SentiLearn</div>
        <div className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/analysis">Analysis</Link>
        </div>
      </nav>

      {/* Main content */}
      <main className="container">
        <Outlet />
      </main>
    </div>
  );
}

export default RootLayout;
