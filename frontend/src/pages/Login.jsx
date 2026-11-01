import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  FaCheckDouble, 
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

export default function Login() {
  const navigate = useNavigate();
  const { login, demoLogin, loading } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email.trim() || !password) {
      setErrorMsg("Please enter both email and password");
      return;
    }

    const result = await login(email.trim(), password);
    if (result.success) {
      toast.success(`Welcome back, ${result.user?.name || "User"}!`);
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
          <h1>TaskFlow</h1>
          <p>Sign in to your productivity workspace</p>
        </div>

        {/* Quick Demo Access Button */}
        <button
          type="button"
          className="btn-demo-quick"
          onClick={handleDemo}
          disabled={loading}
          id="btn-demo-login"
        >
          <FaBolt className="demo-bolt-icon" />
          <span>Instant Demo Login (One Click)</span>
        </button>

        <div className="auth-divider">
          <span>or sign in with credentials</span>
        </div>

        {errorMsg && <div className="auth-alert-error">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field-group">
            <label htmlFor="login-email">Email Address</label>
            <div className="auth-input-wrapper">
              <FaEnvelope className="input-icon" />
              <input
                id="login-email"
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
            <label htmlFor="login-password">Password</label>
            <div className="auth-input-wrapper">
              <FaLock className="input-icon" />
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
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
            id="login-submit-btn"
          >
            {loading ? (
              <>
                <FaSpinner className="spinner-icon" /> Signing in...
              </>
            ) : (
              "Sign In to TaskFlow"
            )}
          </button>
        </form>

        <div className="auth-footer-prompt">
          <span>Don't have an account?</span>
          <Link to="/signup" className="auth-switch-link" id="goto-signup-link">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}
