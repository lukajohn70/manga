exports.id=605,exports.ids=[605],exports.modules={1927:(a,b,c)=>{"use strict";c.d(b,{IM:()=>k,ly:()=>l,vE:()=>h});var d=c(84326),e=c(89886);let f=`
CREATE SCHEMA IF NOT EXISTS identity;
CREATE SCHEMA IF NOT EXISTS vendor;
CREATE SCHEMA IF NOT EXISTS catalog;
CREATE SCHEMA IF NOT EXISTS offers;
CREATE SCHEMA IF NOT EXISTS inventory;
CREATE SCHEMA IF NOT EXISTS orders;
CREATE SCHEMA IF NOT EXISTS shipping;
CREATE SCHEMA IF NOT EXISTS payments;

-- 1. Identity
CREATE TABLE IF NOT EXISTS identity.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(32),
    name VARCHAR(255),
    role VARCHAR(32) NOT NULL DEFAULT 'buyer',
    password_hash VARCHAR(255) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 1b. Password Reset Tokens (Expiring, Single-Use)
CREATE TABLE IF NOT EXISTS identity.password_resets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_password_resets_token ON identity.password_resets(token_hash);
CREATE INDEX IF NOT EXISTS idx_password_resets_email ON identity.password_resets(email);

-- 1c. Email Verification Codes (Expiring, 6-digit OTP for Registration)
CREATE TABLE IF NOT EXISTS identity.email_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    otp_code VARCHAR(16) NOT NULL,
    verification_token VARCHAR(128) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_email_verifications_email ON identity.email_verifications(email);
CREATE INDEX IF NOT EXISTS idx_email_verifications_token ON identity.email_verifications(verification_token);

-- 2. Vendors
CREATE TABLE IF NOT EXISTS vendor.vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    business_name VARCHAR(255) NOT NULL,
    legal_entity_type VARCHAR(64) NOT NULL DEFAULT 'LLC',
    tier VARCHAR(32) NOT NULL DEFAULT 'tier_1',
    status VARCHAR(32) NOT NULL DEFAULT 'active',
    rating NUMERIC(3,2) NOT NULL DEFAULT 4.90,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Categories
CREATE TABLE IF NOT EXISTS catalog.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(128) UNIQUE NOT NULL,
    name VARCHAR(128) NOT NULL,
    icon_url TEXT
);

-- 4. Products
CREATE TABLE IF NOT EXISTS catalog.master_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_name VARCHAR(128),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category_id UUID NOT NULL REFERENCES catalog.categories(id),
    status VARCHAR(32) NOT NULL DEFAULT 'published',
    image_url TEXT,
    gallery JSONB NOT NULL DEFAULT '[]',
    rating NUMERIC(3, 2) NOT NULL DEFAULT 4.9,
    reviews_count INT NOT NULL DEFAULT 100,
    attributes JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Variants
CREATE TABLE IF NOT EXISTS catalog.variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    master_product_id UUID NOT NULL REFERENCES catalog.master_products(id) ON DELETE CASCADE,
    sku_canonical VARCHAR(64) UNIQUE NOT NULL,
    option_values JSONB NOT NULL DEFAULT '{}',
    weight_g INT NOT NULL DEFAULT 500,
    dims_mm JSONB DEFAULT '{}'
);

-- 6. Offers
CREATE TABLE IF NOT EXISTS offers.offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES vendor.vendors(id),
    variant_id UUID NOT NULL REFERENCES catalog.variants(id),
    condition VARCHAR(32) NOT NULL DEFAULT 'new',
    price_minor BIGINT NOT NULL CHECK (price_minor > 0),
    compare_at_minor BIGINT,
    currency VARCHAR(3) NOT NULL DEFAULT 'NGN',
    status VARCHAR(32) NOT NULL DEFAULT 'active'
);

-- 7. Orders
CREATE TABLE IF NOT EXISTS orders.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(64) UNIQUE NOT NULL,
    buyer_id UUID,
    buyer_email VARCHAR(255),
    status VARCHAR(32) NOT NULL DEFAULT 'confirmed',
    currency VARCHAR(3) NOT NULL DEFAULT 'NGN',
    totals JSONB NOT NULL DEFAULT '{}',
    address_snapshot JSONB NOT NULL DEFAULT '{}',
    payment_method VARCHAR(64) NOT NULL DEFAULT 'paystack',
    payment_ref VARCHAR(128),
    idempotency_key VARCHAR(128),
    placed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders.order_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders.orders(id) ON DELETE CASCADE,
    product_id UUID,
    product_title VARCHAR(255) NOT NULL,
    seller_name VARCHAR(255) NOT NULL,
    unit_price_minor BIGINT NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'NGN',
    qty INT NOT NULL CHECK (qty > 0),
    image_url TEXT
);

-- 8. Shipping
CREATE TABLE IF NOT EXISTS shipping.shipments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders.orders(id) ON DELETE CASCADE,
    tracking_number VARCHAR(64) UNIQUE NOT NULL,
    carrier VARCHAR(64) NOT NULL DEFAULT 'Manga Express Fleet',
    status VARCHAR(32) NOT NULL DEFAULT 'in_transit',
    estimated_delivery TIMESTAMPTZ,
    events JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`,g=`
INSERT INTO catalog.categories (id, slug, name, icon_url)
VALUES
  ('55555555-5555-5555-5555-555555555551', 'computing', 'Phones & Computing', 'fa-laptop'),
  ('55555555-5555-5555-5555-555555555552', 'electronics', 'Electronics & Audio', 'fa-headphones'),
  ('55555555-5555-5555-5555-555555555553', 'fashion', 'Fashion & Streetwear', 'fa-shirt'),
  ('55555555-5555-5555-5555-555555555554', 'home', 'Home & Appliances', 'fa-couch'),
  ('55555555-5555-5555-5555-555555555555', 'digital', 'Software & Digital Assets', 'fa-code')
ON CONFLICT (slug) DO NOTHING;
`,h="lukajohn70@gmail.com",i=(0,e.Er)(process.env.ADMIN_INITIAL_PASSWORD||"MangaAdmin2026!SecurePlatform#"),j=!1;async function k(){try{return await (0,d.P)(f),await (0,d.P)(g),await (0,d.P)("TRUNCATE TABLE shipping.shipments CASCADE;"),await (0,d.P)("TRUNCATE TABLE orders.order_lines CASCADE;"),await (0,d.P)("TRUNCATE TABLE orders.orders CASCADE;"),await (0,d.P)("TRUNCATE TABLE offers.offers CASCADE;"),await (0,d.P)("TRUNCATE TABLE catalog.variants CASCADE;"),await (0,d.P)("TRUNCATE TABLE catalog.master_products CASCADE;"),await (0,d.P)("TRUNCATE TABLE vendor.vendors CASCADE;"),await (0,d.P)("DELETE FROM identity.users WHERE email != $1;",[h]),await (0,d.P)(`
      INSERT INTO identity.users (email, phone, name, role, password_hash, status)
      VALUES ($1, '+234 800 000 0000', 'Luka John', 'admin', $2, 'active')
      ON CONFLICT (email) DO UPDATE SET
        name = 'Luka John',
        role = 'admin',
        password_hash = $2,
        status = 'active';
      `,[h,i]),console.log("[DB-Purge] Database purged. All products removed. Admin user created: lukajohn70@gmail.com"),j=!0,{success:!0,message:"Database purged successfully. All products and dummy details removed. Admin user lukajohn70@gmail.com active."}}catch(a){return console.error("[DB-Purge] Error purging database:",a.message),{success:!1,message:a.message}}}async function l(a=!1){if(j&&!a)return{initialized:!0,message:"Already initialized in-memory"};try{let a=await (0,d.P)(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'catalog' 
        AND table_name = 'master_products'
      );
    `);a.rows[0]?.exists!==!0&&(console.log("[DB-Init] Tables missing. Auto-creating database schemas..."),await (0,d.P)(f),await (0,d.P)(g));let b=await (0,d.P)("SELECT id FROM identity.users WHERE email ILIKE $1",[h]);if(!b.rows||0===b.rows.length){console.log("[DB-Init] Admin user lukajohn70@gmail.com not found. Triggering full database purge & admin provisioning...");let a=await k();return{initialized:a.success,message:a.message}}return j=!0,{initialized:!0,message:"Database tables verified and admin user active."}}catch(a){return console.warn("[DB-Init] Database check note:",a.message),{initialized:!1,message:a.message}}}},21402:()=>{},61570:()=>{},84326:(a,b,c)=>{"use strict";c.d(b,{OV:()=>k,P:()=>j,h1:()=>i});let d=null,e=null,f=null;function g(){if(e)return e;try{let a=c(42449);return e=a.Pool?a:{Pool:a.default?.Pool||a}}catch(a){return f=a.message||"Cannot find module pg",null}}function h(){let a=process.env.DATABASE_URL||process.env.POSTGRES_URL||process.env.POSTGRES_PRISMA_URL||"";if(a.includes("REPLACE_WITH_SECURE_DATABASE_PASSWORD")&&(a=""),!a)try{let b=c(29021),d=c(33873);for(let c of[d.join(process.cwd(),".env"),d.join(process.cwd(),"..",".env"),"/home/gwylvxeo/manga.jlm.com.ng/.env","/home/gwylvxeo/manga.jlm.com.ng/apps/web-store/.env"])if(b.existsSync(c)){for(let d of b.readFileSync(c,"utf8").split(/\r?\n/)){let b=d.trim();if(b.startsWith("DATABASE_URL=")){let c=b.slice(13).trim().replace(/^["']|["']$/g,"");if(c&&!c.includes("REPLACE_WITH_SECURE_DATABASE_PASSWORD")){a=c,process.env.DATABASE_URL=a;break}}}if(a)break}}catch{}return a}function i(a){if(!a)return"";let b=a.trim(),c=(b=(b=(b=(b=b.replace(/\s*@\s*/g,"@")).replace(/\s*:\s*/g,":")).replace(/\s*\/\s*/g,"/")).replace(/@(localhost|hostname)([:\/]|$)/g,"@127.0.0.1$2")).match(/^(postgres(?:ql)?:\/\/[^:]+:)(.+)(@[^@\/]+(?::\d+)?\/.*)$/);if(c){let a=c[1],d=c[2],e=c[3];b=a+(d=d.replace(/%(?![0-9a-fA-F]{2})/g,"%25"))+e}return b}async function j(a,b=[]){return(function(){if(d)return d;let a=g();if(!a||!a.Pool)throw Error(`PostgreSQL driver 'pg' is not loaded: ${f||"Cannot find module pg"}. Please run npm install in cPanel.`);let b=i(h()),c="false"===process.env.DATABASE_SSL||"disable"===process.env.PGSSLMODE,e="true"===process.env.DATABASE_SSL||"require"===process.env.PGSSLMODE,j=b.includes("supabase")||b.includes("neon.tech")||b.includes("render.com")||b.includes("railway.app")||b.includes("pooler.supabase.com")||b.includes("rds.amazonaws.com")||b.includes("sslmode=require"),k=b.includes("localhost")||b.includes("127.0.0.1")||!b&&(!process.env.POSTGRES_HOST||"localhost"===process.env.POSTGRES_HOST||"127.0.0.1"===process.env.POSTGRES_HOST),l=!c&&(e||j||!k)?{rejectUnauthorized:!1}:void 0,m=(process.env.POSTGRES_HOST||"127.0.0.1").replace("localhost","127.0.0.1"),n=b?{connectionString:b,ssl:l,max:10,idleTimeoutMillis:3e4,connectionTimeoutMillis:6e3}:{host:m,port:parseInt(process.env.POSTGRES_PORT||"5432",10),user:process.env.POSTGRES_USER||"gwylvxeo_manga_user",password:process.env.POSTGRES_PASSWORD||"manga_password",database:process.env.POSTGRES_DB||"gwylvxeo_manga",ssl:l,max:10,idleTimeoutMillis:3e4,connectionTimeoutMillis:6e3},o=new a.Pool(n);return o.on("error",a=>{console.warn("[DB] Unexpected error on idle PostgreSQL client:",a?.message||a)}),d=o})().query(a,b)}async function k(){let a=g();if(!a||!a.Pool)return{connected:!1,driverInstalled:!1,error:`PostgreSQL driver ('pg') is not installed in the server's node_modules directory (${f||"Cannot find module pg"}). Click 'Run NPM Install' in cPanel to install dependencies.`};let b=i(h()),c=b?b.replace(/:[^:@]*@/,":****@"):"configured via host/user/port";try{let a=await j("SELECT version()");return{connected:!0,driverInstalled:!0,version:a.rows[0]?.version,sanitizedUrl:c}}catch(a){return{connected:!1,driverInstalled:!0,sanitizedUrl:c,error:a.message}}}},89886:(a,b,c)=>{"use strict";c.d(b,{BE:()=>l,DT:()=>x,Eb:()=>q,Er:()=>k,FY:()=>z,IX:()=>h,K5:()=>o,Q7:()=>m,Z4:()=>r,jH:()=>s,kY:()=>t,o7:()=>i,pQ:()=>v,pz:()=>j,xV:()=>w,xp:()=>y,yE:()=>u});var d=c(55511),e=c.n(d);let f=null;function g(){return process.env.SESSION_SECRET?process.env.SESSION_SECRET:process.env.JWT_SECRET&&!process.env.JWT_SECRET.includes("REPLACE_WITH")?process.env.JWT_SECRET:(f||(f=e().randomBytes(32).toString("hex")),f)}let h="manga_session",i="manga_csrf";function j(a=!0){return{httpOnly:!0,secure:a,sameSite:"lax",path:"/",maxAge:604800}}function k(a){if(!a||"string"!=typeof a)throw Error("Password must be a non-empty string");let b=e().randomBytes(16).toString("hex"),c=e().scryptSync(a,b,64);return`scrypt$${b}$${c.toString("hex")}`}function l(a,b){if(!a||!b||"string"!=typeof a||"string"!=typeof b)return!1;if(b.startsWith("scrypt$")){let c=b.split("$");if(3!==c.length)return!1;let[,d,f]=c;try{let b=e().scryptSync(a,d,64),c=Buffer.from(f,"hex");if(b.length!==c.length)return!1;return e().timingSafeEqual(b,c)}catch{return!1}}if(/^[a-f0-9]{64}$/i.test(b)){let c=e().createHash("sha256").update(a).digest("hex"),d=Buffer.from(c,"utf8"),f=Buffer.from(b,"utf8");return d.length===f.length&&e().timingSafeEqual(d,f)}return!1}function m(a){let b=g(),c=Math.floor(Date.now()/1e3),d={userId:a.id,email:a.email.toLowerCase().trim(),role:a.role,name:a.name,iat:c,exp:c+604800},f=Buffer.from(JSON.stringify(d)).toString("base64url"),h=e().createHmac("sha256",b).update(f).digest("base64url");return`${f}.${h}`}function n(a){if(!a||"string"!=typeof a||!a.includes("."))return null;let[b,c]=a.split(".");if(!b||!c)return null;let d=g(),f=e().createHmac("sha256",d).update(b).digest("base64url"),h=Buffer.from(c),i=Buffer.from(f);if(h.length!==i.length||!e().timingSafeEqual(h,i))return null;try{let a=JSON.parse(Buffer.from(b,"base64url").toString("utf8")),c=Math.floor(Date.now()/1e3);if(!a.exp||a.exp<c)return null;return a}catch{return null}}function o(a){let b=(a.headers.get("cookie")||"").match(RegExp(`(?:^|;\\s*)${h}=([^;]+)`));if(b&&b[1]){let a=n(decodeURIComponent(b[1]));if(a)return a}let c=a.headers.get("authorization")||"";return c.startsWith("Bearer ")?n(c.slice(7).trim()):null}let p=new Map;function q(a,b=5,c=9e5){let d=Date.now(),e=p.get(a);return!e||d>e.resetAt?(p.set(a,{count:1,resetAt:d+c}),{allowed:!0,remaining:b-1,retryAfterSeconds:0}):e.count>=b?{allowed:!1,remaining:0,retryAfterSeconds:Math.ceil((e.resetAt-d)/1e3)}:(e.count+=1,{allowed:!0,remaining:b-e.count,retryAfterSeconds:0})}function r(a){p.delete(a)}function s(){return e().randomBytes(32).toString("hex")}function t(a){if(["GET","HEAD","OPTIONS"].includes(a.method.toUpperCase()))return!0;let b=(a.headers.get("cookie")||"").match(RegExp(`(?:^|;\\s*)${i}=([^;]+)`)),c=b?decodeURIComponent(b[1]):null,d=a.headers.get("x-csrf-token")||a.headers.get("csrf-token")||a.headers.get("x-xsrf-token");if(c&&d&&c.length===d.length&&e().timingSafeEqual(Buffer.from(c),Buffer.from(d)))return!0;let f=a.headers.get("origin"),g=a.headers.get("host");if(f&&g)try{if(new URL(f).host===g)return!0}catch{}return!!(a.headers.get("authorization")||"").startsWith("Bearer ")}function u(){let a=e().randomBytes(32).toString("hex"),b=e().createHash("sha256").update(a).digest("hex");return{token:a,hash:b,expiresAt:new Date(Date.now()+9e5)}}function v(a){return e().createHash("sha256").update(a).digest("hex")}function w(a){return null==a?"":String(a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;").replace(/\//g,"&#x2F;").trim()}function x(a){if(!a||"string"!=typeof a)return!1;let b=a.trim();return!(b.length<5)&&!(b.length>254)&&/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/.test(b)}function y(a){return a&&"string"==typeof a?a.length<8?{valid:!1,reason:"Password must be at least 8 characters long"}:a.length>128?{valid:!1,reason:"Password must not exceed 128 characters"}:/[a-zA-Z]/.test(a)&&/[0-9]/.test(a)?{valid:!0}:{valid:!1,reason:"Password must contain both letters and numbers for adequate entropy"}:{valid:!1,reason:"Password is required"}}function z(a){if(!a||"string"!=typeof a)return!1;let b=a.replace(/[\s\-\(\)]/g,"");return/^\+?[0-9]{7,16}$/.test(b)}}};