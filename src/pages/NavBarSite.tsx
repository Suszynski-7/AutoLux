import { useState } from "react";
import "../App.css";
import { Link } from "react-router";

interface NavBarProps {
  navItems: { label: string; path: string }[];
}

function NavBar({ navItems }: NavBarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="custom-navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <i className="fa-solid fa-car"></i> AutoLux
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
        >
          <i className="bi bi-list"></i>{" "}
        </button>

        <div className={`nav-links ${isOpen ? "show" : ""}`}>
          <ul>
            {navItems.map((item) => (
              <li key={item.label}>
                <Link to={item.path} onClick={() => setIsOpen(false)}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
