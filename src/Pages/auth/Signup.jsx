import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { signupSchema } from "../../validations/auth.validation";
import { useAuth } from "../../context/AuthContext";



const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState('');

  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
    },
    validationSchema: signupSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setServerError('');
      try {
        await signup({
          fullName: values.fullName,
          email: values.email,
          phoneNumber: values.phoneNumber,
          password: values.password,
        });
        navigate('/');
      } catch (error) {
        setServerError(error.message || 'Signup failed. Please try again.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-[calc(100vh-70px)] flex flex-1">
      <div className="grid lg:grid-cols-2 w-full">
        {/* Form Section */}
        <div className="flex items-center justify-center p-6 lg:p-10">
          <div className="max-w-md w-full">
            <h1 className="text-3xl font-bold mb-2">Create Account</h1>
            <p className="text-slate-500 mb-8">Join EventQueue and start discovering amazing events</p>

            {serverError && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-500 px-4 py-3 rounded-lg mb-6 text-sm">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {serverError}
              </div>
            )}

            {/* Google Signup Button */}
            <a
              href="http://localhost:3000/api/auth/google"
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-sm font-medium text-slate-600">Continue with Google</span>
            </a>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-400">or create account with email</span>
              </div>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <div className={`flex items-center gap-3 px-4 py-3 border rounded-lg transition-all ${formik.touched.fullName && formik.errors.fullName ? 'border-red-500 focus-within:ring-red-100' : 'border-slate-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10'}`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Krishna Bhandari"
                    className="w-full outline-none text-sm"
                    value={formik.values.fullName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
                {formik.touched.fullName && formik.errors.fullName && (
                  <span className="text-red-500 text-xs mt-1">{formik.errors.fullName}</span>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <div className={`flex items-center gap-3 px-4 py-3 border rounded-lg transition-all ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-slate-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10'}`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    className="w-full outline-none text-sm"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
                {formik.touched.email && formik.errors.email && (
                  <span className="text-red-500 text-xs mt-1">{formik.errors.email}</span>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <div className={`flex items-center gap-3 px-4 py-3 border rounded-lg transition-all ${formik.touched.phoneNumber && formik.errors.phoneNumber ? 'border-red-500' : 'border-slate-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10'}`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  <input
                    type="tel"
                    name="phoneNumber"
                    placeholder="+977 9867256677"
                    className="w-full outline-none text-sm"
                    value={formik.values.phoneNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
                {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                  <span className="text-red-500 text-xs mt-1">{formik.errors.phoneNumber}</span>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <div className={`flex items-center gap-3 px-4 py-3 border rounded-lg transition-all ${formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-slate-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10'}`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Create a strong password"
                    className="w-full outline-none text-sm"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-400 hover:text-slate-600">
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
                {formik.touched.password && formik.errors.password && (
                  <span className="text-red-500 text-xs mt-1">{formik.errors.password}</span>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium mb-2">Confirm Password</label>
                <div className={`flex items-center gap-3 px-4 py-3 border rounded-lg transition-all ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-500' : 'border-slate-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10'}`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    className="w-full outline-none text-sm"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-slate-400 hover:text-slate-600">
                    {showConfirmPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                  <span className="text-red-500 text-xs mt-1">{formik.errors.confirmPassword}</span>
                )}
              </div>

              {/* Terms */}
              <div>
                <label className="flex items-start gap-2 text-sm text-slate-500 cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formik.values.agreeToTerms}
                    onChange={formik.handleChange}
                    className="mt-1 w-4 h-4 accent-primary"
                  />
                  <span>I agree to the <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link></span>
                </label>
                {formik.touched.agreeToTerms && formik.errors.agreeToTerms && (
                  <span className="text-red-500 text-xs mt-1">{formik.errors.agreeToTerms}</span>
                )}
              </div>

              <button
                type="submit"
                disabled={formik.isSubmitting}
                className="w-full bg-secondary text-white py-3 rounded-lg font-semibold bg-slate-900 flex items-center justify-center gap-2"
              >
                {formik.isSubmitting ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <p className="text-center text-slate-500 text-sm mt-6">
              Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign In</Link>
            </p>
          </div>
        </div>

        {/* Image Section */}
        <div className="hidden lg:flex relative bg-slate-900 items-center justify-center overflow-hidden">
          <img
            src="/images/woman.png"
            alt="Event Speaker"
            className="w-full h-full object-cover object-top"
          />
          {/* White card overlay to hide watermark */}
          <div className="absolute bottom-8 right-8 left-8 bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-xl">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Why Join EventQueue?</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-slate-600">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Access to 5000+ exclusive events
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-600">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Discounts and special offers
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-600">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Connect with a vibrant community
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-600">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Connect with Innovative Mindset
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
