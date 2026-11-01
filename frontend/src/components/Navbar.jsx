import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  FaCheckDouble, 
  FaTrashAlt, 
  FaTasks, 
  FaSun, 
  FaMoon, 
  FaSignOutAlt, 
  FaUserCircle 
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../context/ToastContext";
import "./Navbar.css";

export default function Navbar({ trashCount = 0 }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.info("Logged out successfully");
    navigate("/");
  };

  const isTrash = location.pathname === "/trash";

  return (
    <header className="navbar-container">
      <div className="navbar-content">
        {/* Brand Logo */}
        <Link to="/todos" className="navbar-brand">
          <div className="brand-icon-wrapper">
            <FaCheckDouble className="brand-icon" />
          </div>
          <div className="brand-text">
            <span className="brand-title">TaskFlow</span>
            <span className="brand-tag">PRO</span>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <nav className="navbar-nav">
          <Link 
            to="/todos" 
            className={`nav-link ${!isTrash ? "nav-link-active" : ""}`}
            id="nav-tasks-link"
          >
            <FaTasks className="nav-icon" />
            <span>Tasks</span>
          </Link>

          <Link 
            to="/trash" 
            className={`nav-link ${isTrash ? "nav-link-active" : ""}`}
            id="nav-trash-link"
          >
            <FaTrashAlt className="nav-icon" />
            <span>Trash</span>
            {trashCount > 0 && <span className="trash-badge">{trashCount}</span>}
          </Link>
        </nav>

        {/* Right Action Controls */}
        <div className="navbar-actions">
          {/* Theme Toggle Button */}
          <button 
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            id="theme-toggle-btn"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? (
              <FaSun className="theme-icon sun-icon" />
            ) : (
              <FaMoon className="theme-icon moon-icon" />
            )}
          </button>

          {/* User Profile Info */}
          <div className="user-profile-wrapper">
            <button 
              className="user-profile-btn"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              id="user-profile-btn"
              aria-expanded={showProfileMenu}
            >
              <div className="user-avatar">
                {user?.name ? user.name.charAt(0).toUpperCase() : <FaUserCircle />}
              </div>
              <div className="user-details">
                <span className="user-name">{user?.name || "Productive User"}</span>
              </div>
            </button>

            {showProfileMenu && (
              <div className="profile-dropdown glass-panel animate-scale-in">
                <div className="dropdown-header">
                  <div className="dropdown-name">{user?.name}</div>
                  <div className="dropdown-email">{user?.email}</div>
                </div>
                <div className="dropdown-divider"></div>
                <button 
                  className="dropdown-item logout-item"
                  onClick={handleLogout}
                  id="dropdown-logout-btn"
                >
                  <FaSignOutAlt />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
