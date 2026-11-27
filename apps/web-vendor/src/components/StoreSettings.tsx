import * as React from 'react';
import {
  Store,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Save,
  Globe,
  Camera,
  CreditCard,
  FileText,
  Sparkles,
} from 'lucide-react';

interface StoreSettingsProps {
  storeName: string;
  onUpdateStoreName: (name: string) => void;
  showToast: (text: string, type?: 'success' | 'info' | 'error') => void;
}

export const StoreSettings: React.FC<StoreSettingsProps> = ({
  storeName,
  onUpdateStoreName,
  showToast,
}) => {
  const [name, setName] = React.useState(storeName);
  const [tagline, setTagline] = React.useState('Official Kaduna electronics distributor for Apple, Sony, Dell & Anker.');
  const [hubLocation, setHubLocation] = React.useState('Kaduna Central Hub & Warehouse');
  const [streetAddress, setStreetAddress] = React.useState('Suite 14, Apex Commercial Complex, Barnawa, Kaduna');
  const [phone, setPhone] = React.useState('+234 803 123 4567');
  const [email, setEmail] = React.useState('sales@apexelectronics.ng');
  const [slug, setSlug] = React.useState('apex-tech');
  const [returnPolicy, setReturnPolicy] = React.useState('7-day return guarantee for verified manufacturer defects or courier transit damage.');
  const [bankName, setBankName] = React.useState('Providus Bank');
  const [accountNumber, setAccountNumber] = React.useState('0123456789');
  const [accountName, setAccountName] = React.useState('Apex Electronics Ltd');
  const [cacNumber, setCacNumber] = React.useState('RC-1849204');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStoreName(name);
    showToast('Store settings and profile updated successfully!', 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '960px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2
            style={{
              fontFamily: 'Fraunces, Georgia, serif',
              fontSize: '22px',
              fontWeight: 800,
              color: 'var(--text-primary)',
              margin: '0 0 4px',
            }}
          >
            Store Profile & Settings
          </h2>
          <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-muted)' }}>
            Configure your storefront identity, customer contact lines, warehouse location, and settlement bank.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="status-pill good" style={{ padding: '4px 10px', fontSize: '11px' }}>
            <ShieldCheck size={13} /> CAC Accredited Merchant
          </span>
        </div>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Section 1: Storefront Identity & Preview */}
        <div className="vendor-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <div
              className="squircle"
              style={{
                width: '36px',
                height: '36px',
                backgroundColor: 'var(--accent-primary-glow)',
                color: 'var(--accent-primary)',
              }}
            >
              <Store size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
                Storefront Branding & Identity
              </h3>
              <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                How your store appears to customers browsing Manga
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                Store Business Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-line-strong)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                Storefront URL Slug
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-line-strong)',
                  borderRadius: '8px',
                  padding: '9px 12px',
                }}
              >
                <span style={{ color: 'var(--text-muted)', fontSize: '12.5px', marginRight: '4px' }}>manga.ng/stores/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--accent-primary)',
                    fontSize: '13px',
                    fontWeight: 700,
                    width: '100%',
                    outline: 'none',
                  }}
                />
              </div>
            </div>
          </div>

          <div style={{ marginTop: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
              Store Bio & Tagline
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-line-strong)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Section 2: Physical Location & Warehouse */}
        <div className="vendor-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <div
              className="squircle"
              style={{
                width: '36px',
                height: '36px',
                backgroundColor: 'var(--status-info-bg)',
                color: 'var(--status-info)',
              }}
            >
              <MapPin size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
                Fulfillment Hub & Dispatch Location
              </h3>
              <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                Where your packages are dispatched for carrier pickup
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                Designated Manga Logistics Hub
              </label>
              <input
                type="text"
                disabled
                value={hubLocation}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-well)',
                  border: '1px solid var(--border-line)',
                  color: 'var(--text-secondary)',
                  fontSize: '13px',
                  cursor: 'not-allowed',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                Store Warehouse Address
              </label>
              <input
                type="text"
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-line-strong)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginTop: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                Merchant Support Phone / WhatsApp *
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-line-strong)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                Store Business Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-line-strong)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Verified Payout Account */}
        <div className="vendor-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <div
              className="squircle"
              style={{
                width: '36px',
                height: '36px',
                backgroundColor: 'var(--status-good-bg)',
                color: 'var(--status-good)',
              }}
            >
              <CreditCard size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
                Verified Settlement Account
              </h3>
              <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                Direct bank settlement account connected to Providus NIBSS gateway
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                Bank Institution
              </label>
              <input
                type="text"
                disabled
                value={bankName}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-well)',
                  border: '1px solid var(--border-line)',
                  color: 'var(--text-secondary)',
                  fontSize: '13px',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                NUBAN Account Number
              </label>
              <input
                type="text"
                disabled
                value={accountNumber}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-well)',
                  border: '1px solid var(--border-line)',
                  color: 'var(--text-secondary)',
                  fontSize: '13px',
                  fontFamily: 'JetBrains Mono, monospace',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                Account Name & CAC
              </label>
              <input
                type="text"
                disabled
                value={`${accountName} (${cacNumber})`}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-well)',
                  border: '1px solid var(--border-line)',
                  color: 'var(--text-secondary)',
                  fontSize: '13px',
                }}
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 24px' }}>
            <Save size={15} />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
