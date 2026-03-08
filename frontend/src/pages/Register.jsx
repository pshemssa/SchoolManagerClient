// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { authService } from '../services/api';
// import { getDeviceId } from '../utils/deviceId';

// export default function Register() {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     role: 'student'
//   });
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');
//     setLoading(true);

//     try {
//       const deviceId = getDeviceId();
//       const response = await authService.register({ ...formData, deviceId });
      
//       setSuccess(response.data.message);
//       setTimeout(() => navigate('/login'), 2000);
//     } catch (err) {
//       setError(err.response?.data?.error || 'Registration failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
//       <h2>Register</h2>
//       <form onSubmit={handleSubmit}>
//         <div style={{ marginBottom: '15px' }}>
//           <input
//             type="text"
//             placeholder="Full Name"
//             value={formData.name}
//             onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//             required
//             style={{ width: '100%', padding: '10px', fontSize: '16px' }}
//           />
//         </div>
//         <div style={{ marginBottom: '15px' }}>
//           <input
//             type="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//             required
//             style={{ width: '100%', padding: '10px', fontSize: '16px' }}
//           />
//         </div>
//         <div style={{ marginBottom: '15px' }}>
//           <input
//             type="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//             required
//             style={{ width: '100%', padding: '10px', fontSize: '16px' }}
//           />
//         </div>
//         <div style={{ marginBottom: '15px' }}>
//           <select
//             value={formData.role}
//             onChange={(e) => setFormData({ ...formData, role: e.target.value })}
//             style={{ width: '100%', padding: '10px', fontSize: '16px' }}
//           >
//             <option value="student">Student</option>
//             <option value="parent">Parent</option>
//           </select>
//         </div>
//         {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
//         {success && <div style={{ color: 'green', marginBottom: '10px' }}>{success}</div>}
//         <button 
//           type="submit" 
//           disabled={loading}
//           style={{ width: '100%', padding: '10px', fontSize: '16px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}
//         >
//           {loading ? 'Loading...' : 'Register'}
//         </button>
//       </form>
//       <p style={{ marginTop: '15px', textAlign: 'center' }}>
//         Already have an account? <a href="/login">Login</a>
//       </p>
//     </div>
//   );
// }

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/api";
import { getDeviceId } from "../utils/deviceId";
import { Shield } from "lucide-react";

export default function Register() {

  const [formData, setFormData] = useState({
     name: "",
     email: "",
     password: "", 
     role: "parent",
     studentId: ""
    }); 
    const [error, setError] = useState(""); const [success, setSuccess] = useState(""); const [loading, setLoading] = useState(false); const navigate = useNavigate(); const handleSubmit = async (e) => { e.preventDefault(); setError(""); setSuccess(""); setLoading(true); try { const deviceId = getDeviceId(); const response = await authService.register({ ...formData, deviceId }); setSuccess(response.data.message); setTimeout(() => navigate("/login"), 2000); } catch (err) { setError(err.response?.data?.error || "Registration failed"); } finally { setLoading(false); } };

  return (
    <div className="auth-container">

      <div className="auth-header">
          <div style={{ marginBottom: "25px" }}>
          <div
            style={{
              background: "#0f172a",
              width: "70px",
              height: "70px",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 10px auto",
            }}
          >
            <Shield size={30} color="#60a5fa" />
          </div>
        <h1>SchoolSync</h1>
        <p>Parent & Student Portal</p>
      </div>
      </div>
      <div className="auth-card">

        <div className="tabs">
          <Link to="/login">
            <button>Sign In</button>
          </Link>

          <button className="active">Register</button>
        </div>

        <form onSubmit={handleSubmit}>

          <label>Full Name</label>
          <input
            type="text"
            placeholder="Sarah Johnson"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
          />

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

          {/* <label>Phone Number</label>
<input
  type="tel"
  placeholder="+250 7xx xxx xxx"
  value={formData.phone}
  onChange={(e) =>
    setFormData({ ...formData, phone: e.target.value })
  }
  required
/> */}
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

          <select
            value={formData.role}
            onChange={(e) =>
              setFormData({ ...formData, role: e.target.value })
            }
          >
            <option value="parent">Parent</option>
          </select>

          <label>Student ID</label>
          <input
            type="text"
            placeholder="Enter student ID from admin"
            value={formData.studentId}
            onChange={(e) =>
              setFormData({ ...formData, studentId: e.target.value })
            }
            required
          />

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <button className="primary-btn" disabled={loading}>
            {loading ? "Loading..." : "Create Account"}
          </button>


<p className="info-text">
  Device will need admin verification before full access.
</p>
        </form>

      </div>
      <br/>
<p className="admin-link">
  Staff? <a href={import.meta.env.VITE_ADMIN_PORTAL_URL || "http://localhost:3001"}>Go to Admin Portal</a>
</p>
    </div>
  );
}