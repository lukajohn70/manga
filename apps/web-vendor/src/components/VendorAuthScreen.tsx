import * as React from 'react';
import {
  Store,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Lock,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Layers,
} from 'lucide-react';
import { NokTriangleIcon } from './VendorSidebar.js';
import { MangaLogo } from './MangaLogo.js';

interface VendorAuthScreenProps {
  loginEmail: string;
  setLoginEmail: (val: string) => void;
  loginPassword: string;
  setLoginPassword: (val: string) => void;
  authStep: 'credentials' | '2fa';
  setAuthStep: (val: 'credentials' | '2fa') => void;
  twoFaMethod: 'google_authenticator' | 'email';
  setTwoFaMethod: (val: 'google_authenticator' | 'email') => void;
  twoFaCode: string;
  setTwoFaCode: (val: string) => void;
  authError: string | null;
  authLoading: boolean;
  onSubmitLogin: (e: React.FormEvent) => void;
  onSubmit2fa: (e: React.FormEvent) => void;
  totpSecret: string;
  testOtp: string | null;
  calculateTotpCode: (secret: string) => string;
  showToast: (text: string, type?: 'success' | 'info' | 'error') => void;
}

export const VendorAuthScreen: React.FC<VendorAuthScreenProps> = ({
  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  authStep,
  setAuthStep,
  twoFaMethod,
  setTwoFaMethod,
  twoFaCode,
  setTwoFaCode,
  authError,
  authLoading,
  onSubmitLogin,
  onSubmit2fa,
  totpSecret,
  testOtp,
  calculateTotpCode,
  showToast,
}) => {
  // Toggle between Sign In (false) and Sign Up (true)
  const [isActive, setIsActive] = React.useState(false);

  // Sign up fields
  const [regName, setRegName] = React.useState('');
  const [regStoreName, setRegStoreName] = React.useState('');
  const [regEmail, setRegEmail] = React.useState('');
  const [regPassword, setRegPassword] = React.useState('');
  const [regCategory, setRegCategory] = React.useState('Electronics & Audio');

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regEmail || !regStoreName) return;

    // Prefill the login form with new merchant's email & pass
    setLoginEmail(regEmail);
    if (regPassword) setLoginPassword(regPassword);

    showToast(`Store "${regStoreName}" registered! Please sign in to verify.`, 'success');
    setIsActive(false);
  };

  const fillDemoMerchant = () => {
    setLoginEmail('vendor@manga.ng');
    setLoginPassword('VendorPass123!');
    showToast('Demo merchant credentials filled (Apex Electronics Ltd).', 'info');
  };

  return (
    <div className="auth-page-wrapper">
      <div className={`auth-container ${isActive ? 'active' : ''}`} id="authContainer">
        
        {/* =========================================================
            PANEL 1: SIGN UP (CREATE MERCHANT STORE)
            ========================================================= */}
        <div className="auth-form-container auth-sign-up">
          <form onSubmit={handleSignUpSubmit}>
            <div style={{ marginBottom: '12px', textAlign: 'center' }}>
              <MangaLogo height={34} />
            </div>
            
            <h2
              style={{
                fontFamily: 'Fraunces, Georgia, serif',
                fontSize: '20px',
                fontWeight: 800,
                margin: '0 0 2px',
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
              }}
            >
              Open Your Store
            </h2>
            
            <p style={{ margin: '0 0 10px', fontSize: '12px', color: 'var(--text-muted)' }}>
              Sell directly to customers nationwide on Manga Marketsquare
            </p>

            {/* Social Registration */}
            <div className="auth-social-icons">
              <button
                type="button"
                className="auth-social-btn"
                title="Register with Google"
                onClick={() => {
                  setRegEmail('merchant@gmail.com');
                  setRegStoreName('Apex Retail Store');
                  showToast('Google OAuth merchant profile simulated.', 'info');
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </button>
              <button
                type="button"
                className="auth-social-btn"
                title="Register with Apple"
                onClick={() => showToast('Apple Business ID simulated.', 'info')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.64 1.35-.57.65-1.07 1.71-.93 2.74 1 .08 2.03-.49 2.65-1.24z"/>
                </svg>
              </button>
            </div>

            <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>
              or enter your business details for accreditation
            </span>

            <div className="auth-input-group">
              <input
                type="text"
                required
                className="auth-input"
                placeholder="Merchant / Owner Full Name"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
              />
            </div>

            <div className="auth-input-group">
              <input
                type="text"
                required
                className="auth-input"
                placeholder="Store / Company Name (e.g. Apex Electronics Ltd)"
                value={regStoreName}
                onChange={(e) => setRegStoreName(e.target.value)}
              />
            </div>

            <div className="auth-input-group">
              <input
                type="email"
                required
                className="auth-input"
                placeholder="Business Email (e.g. sales@store.ng)"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
              />
            </div>

            <div className="auth-input-group">
              <input
                type="password"
                required
                className="auth-input"
                placeholder="Create Secure Password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
              />
            </div>

            <div className="auth-input-group">
              <select
                className="auth-input"
                value={regCategory}
                onChange={(e) => setRegCategory(e.target.value)}
                style={{ cursor: 'pointer' }}
              >
                <option value="Electronics & Audio">Electronics & Audio Gear</option>
                <option value="Fashion & Apparel">Fashion, Leather & Apparel</option>
                <option value="Computers & Accessories">Computers & Accessories</option>
                <option value="Crafts & Art">Art, Terracotta & Cultural Crafts</option>
                <option value="Home & Living">Home Living & Furniture</option>
              </select>
            </div>

            <button type="submit" className="auth-submit-btn">
              Create Store & Start Selling
            </button>
          </form>
        </div>

        {/* =========================================================
            PANEL 2: SIGN IN (MERCHANT CONSOLE)
            ========================================================= */}
        <div className="auth-form-container auth-sign-in">
          {authStep === 'credentials' ? (
            <form onSubmit={onSubmitLogin}>
              <div style={{ marginBottom: '12px', textAlign: 'center' }}>
                <MangaLogo height={34} />
              </div>

              <h2
                style={{
                  fontFamily: 'Fraunces, Georgia, serif',
                  fontSize: '20px',
                  fontWeight: 800,
                  margin: '0 0 2px',
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                }}
              >
                Sign In to Store
              </h2>

              <p style={{ margin: '0 0 10px', fontSize: '12px', color: 'var(--text-muted)' }}>
                Access your Manga merchant catalog, orders & payouts
              </p>

              {/* Social Login Icons */}
              <div className="auth-social-icons">
                <button
                  type="button"
                  className="auth-social-btn"
                  title="Sign in with Google"
                  onClick={fillDemoMerchant}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  className="auth-social-btn"
                  title="Sign in with Apple"
                  onClick={fillDemoMerchant}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.64 1.35-.57.65-1.07 1.71-.93 2.74 1 .08 2.03-.49 2.65-1.24z"/>
                  </svg>
                </button>
              </div>

              <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                or sign in with your merchant email
              </span>

              {authError && (
                <div
                  className="status-pill bad"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '11.5px',
                    marginBottom: '10px',
                    textAlign: 'left',
                  }}
                >
                  <AlertCircle size={13} />
                  <span>{authError}</span>
                </div>
              )}

              <div className="auth-input-group">
                <input
                  type="email"
                  required
                  className="auth-input"
                  placeholder="Merchant Email (vendor@manga.ng)"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>

              <div className="auth-input-group">
                <input
                  type="password"
                  required
                  className="auth-input"
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </div>

              {/* Forgot password & Demo pill */}
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '11.5px',
                  margin: '4px 0 8px',
                }}
              >
                <button
                  type="button"
                  onClick={fillDemoMerchant}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-gold)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '11px',
                    padding: 0,
                  }}
                >
                  Demo: Apex Electronics
                </button>

                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    showToast('Reset link sent to merchant email.', 'info');
                  }}
                  style={{ color: 'var(--text-muted)', textDecoration: 'none' }}
                >
                  Forgot password?
                </a>
              </div>

              <button type="submit" disabled={authLoading} className="auth-submit-btn">
                {authLoading ? 'Verifying...' : 'Sign In to Store →'}
              </button>
            </form>
          ) : (
            /* 2FA Verification Panel */
            <form onSubmit={onSubmit2fa}>
              <div
                className="squircle"
                style={{
                  width: '44px',
                  height: '44px',
                  backgroundColor: 'var(--accent-primary-glow)',
                  color: 'var(--accent-primary)',
                  marginBottom: '10px',
                }}
              >
                <Lock size={20} />
              </div>

              <h2
                style={{
                  fontFamily: 'Fraunces, Georgia, serif',
                  fontSize: '20px',
                  fontWeight: 800,
                  margin: '0 0 4px',
                  color: 'var(--text-primary)',
                }}
              >
                Two-Factor Security
              </h2>
              <p style={{ margin: '0 0 16px', fontSize: '11.5px', color: 'var(--text-muted)' }}>
                Enter the 6-digit verification code to access your store
              </p>

              {/* Method tabs */}
              <div className="tab-pill-group" style={{ marginBottom: '14px', width: '100%' }}>
                <button
                  type="button"
                  className={`tab-pill ${twoFaMethod === 'google_authenticator' ? 'active' : ''}`}
                  onClick={() => setTwoFaMethod('google_authenticator')}
                  style={{ flex: 1 }}
                >
                  Authenticator App
                </button>
                <button
                  type="button"
                  className={`tab-pill ${twoFaMethod === 'email' ? 'active' : ''}`}
                  onClick={() => setTwoFaMethod('email')}
                  style={{ flex: 1 }}
                >
                  Email OTP
                </button>
              </div>

              <div className="auth-input-group">
                <input
                  type="text"
                  required
                  maxLength={6}
                  className="auth-input"
                  style={{
                    fontSize: '22px',
                    textAlign: 'center',
                    letterSpacing: '8px',
                    fontFamily: 'JetBrains Mono, monospace',
                  }}
                  placeholder="000000"
                  value={twoFaCode}
                  onChange={(e) => setTwoFaCode(e.target.value.replace(/\D/g, ''))}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '8px 12px',
                  backgroundColor: 'var(--bg-well)',
                  borderRadius: '8px',
                  fontSize: '11px',
                  marginBottom: '14px',
                }}
              >
                <span style={{ color: 'var(--text-muted)' }}>
                  Code:{' '}
                  <strong style={{ color: 'var(--accent-gold)' }}>
                    {twoFaMethod === 'google_authenticator'
                      ? calculateTotpCode(totpSecret)
                      : testOtp || '882194'}
                  </strong>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const code =
                      twoFaMethod === 'google_authenticator'
                        ? calculateTotpCode(totpSecret)
                        : testOtp || '882194';
                    setTwoFaCode(code);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-primary)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '11px',
                  }}
                >
                  (Autofill)
                </button>
              </div>

              <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setAuthStep('credentials')}
                  style={{ flex: 1 }}
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={authLoading || twoFaCode.length !== 6}
                  className="btn btn-primary"
                  style={{ flex: 2 }}
                >
                  {authLoading ? 'Verifying...' : 'Launch Console'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* =========================================================
            SLIDING TOGGLE CONTAINER (CLAY GRADIENT OVERLAY)
            ========================================================= */}
        <div className="auth-toggle-container">
          <div className="auth-toggle">
            {/* Left Overlay Panel (Shown when Create Store is active) */}
            <div className="auth-toggle-panel auth-toggle-left">
              <div style={{ marginBottom: '16px' }}>
                <MangaLogo variant="light" height={36} />
              </div>
              <h1>Welcome Back!</h1>
              <p>
                Already have a verified Manga store? Sign in to manage your inventory, customer orders, and bank settlements.
              </p>
              <button
                type="button"
                className="ghost-btn"
                onClick={() => setIsActive(false)}
              >
                Sign In
              </button>
            </div>

            {/* Right Overlay Panel (Shown by default when Sign In is active) */}
            <div className="auth-toggle-panel auth-toggle-right">
              <div style={{ marginBottom: '16px' }}>
                <MangaLogo variant="light" height={36} />
              </div>
              <h1>Grow on Manga!</h1>
              <p>
                Reach verified buyers across Nigeria with zero listing barriers and instant Providus escrow security.
              </p>
              <button
                type="button"
                className="ghost-btn"
                onClick={() => setIsActive(true)}
              >
                Register Store
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Return to Customer Storefront Link */}
      <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '12px' }}>
        <a
          href="http://localhost:3000"
          style={{
            color: 'var(--text-muted)',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          <span>← Return to Manga Customer Storefront</span>
          <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
};
