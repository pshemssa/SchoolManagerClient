import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/api";
import { getDeviceId } from "../utils/deviceId";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const deviceId = getDeviceId();
      const response = await authService.login({ ...formData, deviceId });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">

      <div className="auth-header">
        <h1>SchoolSync</h1>
        <p>Parent & Student Portal</p>
      </div>

      <div className="auth-card">

        <div className="tabs">
          <button className="active">Sign In</button>
          <Link to="/register">
            <button>Register</button>
          </Link>
        </div>

        <form onSubmit={handleSubmit}>

          <label>Email</label>
          <input
            type="email"
            placeholder="parent@email.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />

          {error && <p className="error">{error}</p>}

          <button className="primary-btn" disabled={loading}>
            {loading ? "Loading..." : "Sign In"}
          </button>

        </form>

        <p className="forgot">Forgot password?</p>

      </div>

      <p className="staff">
        Staff? <a href={import.meta.env.VITE_ADMIN_PORTAL_URL || "http://localhost:3001"}><span>Go to Admin Portal</span></a>
      </p>

    </div>
  );
}