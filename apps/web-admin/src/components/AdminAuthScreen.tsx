import * as React from 'react';
import {
  ShieldCheck,
  AlertCircle,
  Lock,
  ExternalLink,
  Sparkles,
  Command,
  KeyRound,
} from 'lucide-react';
import { NokTriangleIcon } from './AdminSidebar.js';
import { MangaLogo } from './MangaLogo.js';

interface AdminAuthScreenProps {
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

export const AdminAuthScreen: React.FC<AdminAuthScreenProps> = ({
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
  const [isActive, setIsActive] = React.useState(false);

  // Clearance Request fields
  const [reqName, setReqName] = React.useState('');
  const [reqEmail, setReqEmail] = React.useState('');
  const [reqDept, setReqDept] = React.useState('Escrow & Settlement Operations');
  const [reqPin, setReqPin] = React.useState('');

  const handleClearanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqEmail) return;

    setLoginEmail(reqEmail);
    showToast(`Clearance request submitted for ${reqName || reqEmail}. Pending Lead Approval.`, 'success');
    setIsActive(false);
  };

  const fillDemoAdmin = () => {
    setLoginEmail('admin@manga.ng');
    setLoginPassword('AdminPass123!');
    showToast('Demo administrator credentials filled.', 'info');
  };

  return (
    <div className="auth-page-wrapper">
      <div className={`auth-container ${isActive ? 'active' : ''}`} id="adminAuthContainer">
        
        {/* =========================================================
            PANEL 1: CLEARANCE REQUEST (SIGN UP)
            ========================================================= */}
        <div className="auth-form-container auth-sign-up">
          <form onSubmit={handleClearanceSubmit}>
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
              Request Clearance
            </h2>

            <p style={{ margin: '0 0 10px', fontSize: '12px', color: 'var(--text-muted)' }}>
              Manga Marketsquare Operations Clearance Registry
            </p>

            <div className="auth-social-icons">
              <button
                type="button"
                className="auth-social-btn"
                title="Single Sign-On with Google Workspace"
                onClick={() => {
                  setReqEmail('ops@manga.ng');
                  setReqName('Manga Operations Officer');
                  showToast('Google Workspace enterprise identity verified.', 'info');
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
                title="Sign in with Microsoft Entra ID"
                onClick={() => showToast('Microsoft Entra ID token checked.', 'info')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M1 1h10v10H1zM13 1h10v10H13zM1 13h10v10H1zM13 13h10v10H13z"/>
                </svg>
              </button>
            </div>

            <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>
              or submit officer accreditation credentials
            </span>

            <div className="auth-input-group">
              <input
                type="text"
                required
                className="auth-input"
                placeholder="Staff Officer Full Name"
                value={reqName}
                onChange={(e) => setReqName(e.target.value)}
              />
            </div>

            <div className="auth-input-group">
              <input
                type="email"
                required
                className="auth-input"
                placeholder="Officer Email (e.g. officer@manga.ng)"
                value={reqEmail}
                onChange={(e) => setReqEmail(e.target.value)}
              />
            </div>

            <div className="auth-input-group">
              <select
                className="auth-input"
                value={reqDept}
                onChange={(e) => setReqDept(e.target.value)}
                style={{ cursor: 'pointer' }}
              >
                <option value="Escrow & Settlement Operations">Escrow & Settlement Operations</option>
                <option value="Marketplace Dispute Resolution">Marketplace Dispute Resolution</option>
                <option value="Vendor Verification & Compliance">Vendor Verification & CAC Audit</option>
                <option value="Logistics Dispatch Coordination">Logistics & Hub Coordination</option>
                <option value="Core Platform Engineering">Core Platform Engineering</option>
              </select>
            </div>

            <div className="auth-input-group">
              <input
                type="password"
                required
                className="auth-input"
                placeholder="Department Security PIN / Clearance Key"
                value={reqPin}
                onChange={(e) => setReqPin(e.target.value)}
              />
            </div>

            <button type="submit" className="auth-submit-btn">
              Submit Clearance Application
            </button>
          </form>
        </div>

        {/* =========================================================
            PANEL 2: SIGN IN (OPERATIONS CONSOLE)
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
                Admin Sign In
              </h2>

              <p style={{ margin: '0 0 10px', fontSize: '12px', color: 'var(--text-muted)' }}>
                Level 2 RBAC &bull; Providus Escrow & Dispute Governance
              </p>

              {/* Social Login Icons */}
              <div className="auth-social-icons">
                <button
                  type="button"
                  className="auth-social-btn"
                  title="Sign in with Google Workspace"
                  onClick={fillDemoAdmin}
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
                  title="Sign in with Microsoft Entra ID"
                  onClick={fillDemoAdmin}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M1 1h10v10H1zM13 1h10v10H13zM1 13h10v10H1zM13 13h10v10H13z"/>
                  </svg>
                </button>
              </div>

              <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                or authenticate with admin credentials
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
                  placeholder="Officer Email (admin@manga.ng)"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>

              <div className="auth-input-group">
                <input
                  type="password"
                  required
                  className="auth-input"
                  placeholder="Master Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </div>

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
                  onClick={fillDemoAdmin}
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
                  Demo: Lead Administrator
                </button>

                <a
                  href="#support"
                  onClick={(e) => {
                    e.preventDefault();
                    showToast('Security clearance reset requested.', 'info');
                  }}
                  style={{ color: 'var(--text-muted)', textDecoration: 'none' }}
                >
                  Lost Key?
                </a>
              </div>

              <button type="submit" disabled={authLoading} className="auth-submit-btn">
                {authLoading ? 'Verifying...' : 'Proceed to Security 2FA →'}
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
                Officer 2FA Challenge
              </h2>
              <p style={{ margin: '0 0 16px', fontSize: '11.5px', color: 'var(--text-muted)' }}>
                Hardware TOTP or backup email verification code
              </p>

              {/* Method tabs */}
              <div className="tab-pill-group" style={{ marginBottom: '14px', width: '100%' }}>
                <button
                  type="button"
                  className={`tab-pill ${twoFaMethod === 'google_authenticator' ? 'active' : ''}`}
                  onClick={() => setTwoFaMethod('google_authenticator')}
                  style={{ flex: 1 }}
                >
                  Authenticator TOTP
                </button>
                <button
                  type="button"
                  className={`tab-pill ${twoFaMethod === 'email' ? 'active' : ''}`}
                  onClick={() => setTwoFaMethod('email')}
                  style={{ flex: 1 }}
                >
                  Email Token
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
                  {authLoading ? 'Verifying...' : 'Authenticate'}
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
            {/* Left Overlay Panel */}
            <div className="auth-toggle-panel auth-toggle-left">
              <div style={{ marginBottom: '16px' }}>
                <MangaLogo variant="light" height={36} />
              </div>
              <h1>Command Console</h1>
              <p>
                Already have active Level 2 security clearance? Sign in to monitor platform ledger and fulfill orders.
              </p>
              <button
                type="button"
                className="ghost-btn"
                onClick={() => setIsActive(false)}
              >
                Sign In
              </button>
            </div>

            {/* Right Overlay Panel */}
            <div className="auth-toggle-panel auth-toggle-right">
              <div style={{ marginBottom: '16px' }}>
                <MangaLogo variant="light" height={36} />
              </div>
              <h1>Staff Clearance</h1>
              <p>
                New marketplace compliance officer or escrow auditor? Request credentials from security governance.
              </p>
              <button
                type="button"
                className="ghost-btn"
                onClick={() => setIsActive(true)}
              >
                Request Access
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
