import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  FaCheckDouble, 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaBolt, 
  FaSpinner 
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import "./Auth.css";

export default function Signup() {
  const navigate = useNavigate();
  const { register, demoLogin, loading } = useAuth();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim() || !email.trim() || !password) {
      setErrorMsg("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long");
      return;
    }

    const result = await register(name.trim(), email.trim(), password);
    if (result.success) {
      toast.success(`Account created! Welcome, ${result.user?.name}!`);
      navigate("/todos");
    } else {
      setErrorMsg(result.message);
      toast.error(result.message);
    }
  };

  const handleDemo = async () => {
    setErrorMsg("");
    const result = await demoLogin();
    if (result.success) {
      toast.success("Welcome to Demo Mode!");
      navigate("/todos");
    } else {
      setErrorMsg(result.message);
      toast.error(result.message);
    }
  };

  return (
    <div className="auth-page-container">
      {/* Background ambient lighting */}
      <div className="ambient-bg">
        <div className="ambient-blob-1"></div>
        <div className="ambient-blob-2"></div>
      </div>

      <div className="auth-card glass-panel animate-scale-in">
        {/* Brand header */}
        <div className="auth-brand-header">
          <div className="auth-logo-badge">
            <FaCheckDouble />
          </div>
          <h1>Join TaskFlow</h1>
          <p>Supercharge your daily productivity</p>
        </div>

        {/* Quick Demo Access Button */}
        <button
          type="button"
          className="btn-demo-quick"
          onClick={handleDemo}
          disabled={loading}
          id="btn-demo-signup"
        >
          <FaBolt className="demo-bolt-icon" />
          <span>Try Demo Account Instantly</span>
        </button>

        <div className="auth-divider">
          <span>or create your personal account</span>
        </div>

        {errorMsg && <div className="auth-alert-error">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field-group">
            <label htmlFor="signup-name">Full Name</label>
            <div className="auth-input-wrapper">
              <FaUser className="input-icon" />
              <input
                id="signup-name"
                type="text"
                placeholder="e.g. John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>
          </div>

          <div className="auth-field-group">
            <label htmlFor="signup-email">Email Address</label>
            <div className="auth-input-wrapper">
              <FaEnvelope className="input-icon" />
              <input
                id="signup-email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="auth-field-group">
            <label htmlFor="signup-password">Password (min 6 characters)</label>
            <div className="auth-input-wrapper">
              <FaLock className="input-icon" />
              <input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="pwd-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-auth-submit"
            disabled={loading}
            id="signup-submit-btn"
          >
            {loading ? (
              <>
                <FaSpinner className="spinner-icon" /> Creating Account...
              </>
            ) : (
              "Get Started Free"
            )}
          </button>
        </form>

        <div className="auth-footer-prompt">
          <span>Already have an account?</span>
          <Link to="/" className="auth-switch-link" id="goto-login-link">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
