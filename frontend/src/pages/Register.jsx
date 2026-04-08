import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Mail, Lock, User, Building2, Eye, EyeOff } from 'lucide-react';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';
import './Auth.css';

/**
 * Register page — creates a new student account on Rentify.
 */
export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', campus: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast, showToast } = useToast();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page page">
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">R</div>
          <h1>Create account</h1>
          <p>Join Rentify and start renting on campus</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} id="register-form">
          <div className="form-group">
            <label className="form-label" htmlFor="reg-name">Full Name</label>
            <div className="input-icon-wrapper">
              <User size={18} className="input-icon" />
              <input
                type="text"
                id="reg-name"
                name="name"
                className="form-input input-with-icon"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                required
                minLength={2}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">Email</label>
            <div className="input-icon-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                id="reg-email"
                name="email"
                className="form-input input-with-icon"
                placeholder="you@university.edu"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">Password</label>
            <div className="input-icon-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="reg-password"
                name="password"
                className="form-input input-with-icon"
                placeholder="Min 6 characters"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-campus">Campus (optional)</label>
            <div className="input-icon-wrapper">
              <Building2 size={18} className="input-icon" />
              <input
                type="text"
                id="reg-campus"
                name="campus"
                className="form-input input-with-icon"
                placeholder="e.g. MIT, Stanford"
                value={form.campus}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg auth-submit"
            disabled={loading}
            id="register-submit"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
