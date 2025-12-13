import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const VerifyResetPage = () => {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);

    const inputRefs = useRef([]);
    const navigate = useNavigate();
    const location = useLocation();
    const { verifyResetCode, forgotPassword } = useAuth();

    const email = location.state?.email;
    const [previewUrl, setPreviewUrl] = useState(location.state?.previewUrl || null);

    useEffect(() => {
        if (!email) {
            navigate('/forgot-password');
        }
    }, [email, navigate]);

    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [resendTimer]);

    const handleChange = (index, value) => {
        if (value.length > 1) {
            value = value[0];
        }

        if (!/^\d*$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6);
        if (!/^\d+$/.test(pastedData)) return;

        const newCode = [...code];
        for (let i = 0; i < pastedData.length; i++) {
            newCode[i] = pastedData[i];
        }
        setCode(newCode);

        if (pastedData.length === 6) {
            inputRefs.current[5]?.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const fullCode = code.join('');

        if (fullCode.length !== 6) {
            setError('Please enter the complete 6-digit code');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const data = await verifyResetCode(email, fullCode);
            // backend returns a resetToken upon successful verification
            navigate('/reset-password', { state: { email, resetToken: data.resetToken || data.resetToken, previewUrl } });
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid verification code');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (!canResend) return;

        try {
            const data = await forgotPassword(email);
            // If backend returned a preview URL (Ethereal), surface it for local dev
            if (data?.previewUrl) setPreviewUrl(data.previewUrl);
            setResendTimer(60);
            setCanResend(false);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend code');
        }
    };

    if (!email) return null;

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    {/* Back Link */}
                    <Link to="/forgot-password" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back
                    </Link>

                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                    </div>

                    {/* Title */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Enter Verification Code</h1>
                        <p className="text-gray-600 text-sm">
                            We've sent a 6-digit verification code to
                        </p>
                        <p className="text-indigo-600 font-medium">{email}</p>
                    </div>

                    {/* Ethereal preview link (dev only) */}
                    {previewUrl && (
                        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
                            <p className="font-medium text-yellow-800 mb-1">Dev Preview (Ethereal)</p>
                            <p>
                                <a href={previewUrl} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">
                                    Open email preview
                                </a>
                            </p>
                        </div>
                    )}

                    {/* Timer */}
                    <div className="text-center mb-6">
                        <p className="text-sm text-gray-500">
                            {canResend ? (
                                'You can resend the code now'
                            ) : (
                                <>The code expires in: <span className="text-indigo-600 font-medium">{Math.floor(resendTimer / 60)}:{(resendTimer % 60).toString().padStart(2, '0')}</span></>
                            )}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* OTP Inputs */}
                        <div className="flex justify-center space-x-3">
                            {code.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={handlePaste}
                                    className="w-12 h-14 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            ))}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Verifying...' : 'Verify Code'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600 text-sm">
                            Didn't receive the code?{' '}
                            <button
                                onClick={handleResend}
                                disabled={!canResend}
                                className={`font-semibold ${canResend ? 'text-indigo-600 hover:text-indigo-700' : 'text-gray-400 cursor-not-allowed'}`}
                            >
                                Resend code
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyResetPage;
