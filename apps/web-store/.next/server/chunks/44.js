exports.id=44,exports.ids=[44],exports.modules={1927:(a,b,c)=>{"use strict";c.d(b,{IM:()=>l,ly:()=>m,vE:()=>i});var d=c(84326),e=c(55511),f=c.n(e);let g=`
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
`,h=`
INSERT INTO catalog.categories (id, slug, name, icon_url)
VALUES
  ('55555555-5555-5555-5555-555555555551', 'computing', 'Phones & Computing', 'fa-laptop'),
  ('55555555-5555-5555-5555-555555555552', 'electronics', 'Electronics & Audio', 'fa-headphones'),
  ('55555555-5555-5555-5555-555555555553', 'fashion', 'Fashion & Streetwear', 'fa-shirt'),
  ('55555555-5555-5555-5555-555555555554', 'home', 'Home & Appliances', 'fa-couch'),
  ('55555555-5555-5555-5555-555555555555', 'digital', 'Software & Digital Assets', 'fa-code')
ON CONFLICT (slug) DO NOTHING;
`,i="lukajohn70@gmail.com",j=f().createHash("sha256").update("12").digest("hex"),k=!1;async function l(){try{return await (0,d.P)(g),await (0,d.P)(h),await (0,d.P)("TRUNCATE TABLE shipping.shipments CASCADE;"),await (0,d.P)("TRUNCATE TABLE orders.order_lines CASCADE;"),await (0,d.P)("TRUNCATE TABLE orders.orders CASCADE;"),await (0,d.P)("TRUNCATE TABLE offers.offers CASCADE;"),await (0,d.P)("TRUNCATE TABLE catalog.variants CASCADE;"),await (0,d.P)("TRUNCATE TABLE catalog.master_products CASCADE;"),await (0,d.P)("TRUNCATE TABLE vendor.vendors CASCADE;"),await (0,d.P)("DELETE FROM identity.users WHERE email != $1;",[i]),await (0,d.P)(`
      INSERT INTO identity.users (email, phone, name, role, password_hash, status)
      VALUES ($1, '+234 800 000 0000', 'Luka John', 'admin', $2, 'active')
      ON CONFLICT (email) DO UPDATE SET
        name = 'Luka John',
        role = 'admin',
        password_hash = $2,
        status = 'active';
      `,[i,j]),console.log("[DB-Purge] Database purged. All products removed. Admin user created: lukajohn70@gmail.com"),k=!0,{success:!0,message:"Database purged successfully. All products and dummy details removed. Admin user lukajohn70@gmail.com active."}}catch(a){return console.error("[DB-Purge] Error purging database:",a.message),{success:!1,message:a.message}}}async function m(a=!1){if(k&&!a)return{initialized:!0,message:"Already initialized in-memory"};try{let a=await (0,d.P)(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'catalog' 
        AND table_name = 'master_products'
      );
    `);a.rows[0]?.exists!==!0&&(console.log("[DB-Init] Tables missing. Auto-creating database schemas..."),await (0,d.P)(g),await (0,d.P)(h));let b=await (0,d.P)("SELECT id FROM identity.users WHERE email ILIKE $1",[i]);if(!b.rows||0===b.rows.length){console.log("[DB-Init] Admin user lukajohn70@gmail.com not found. Triggering full database purge & admin provisioning...");let a=await l();return{initialized:a.success,message:a.message}}return k=!0,{initialized:!0,message:"Database tables verified and admin user active."}}catch(a){return console.warn("[DB-Init] Database check note:",a.message),{initialized:!1,message:a.message}}}},21402:()=>{},61570:()=>{},82518:(a,b,c)=>{"use strict";c.d(b,{BR:()=>i,bX:()=>h,ni:()=>j});var d=c(84326),e=c(1927),f=c(55511),g=c.n(f);async function h(a){let b=`MNG-${new Date().getFullYear()}-${Math.floor(1e5+9e5*Math.random())}`,c=a.paymentRef||`PSK-${Date.now().toString(36).toUpperCase()}`,f=new Date().toISOString();try{await (0,e.ly)();let g=`
      INSERT INTO orders.orders (
        order_number,
        buyer_id,
        buyer_email,
        status,
        currency,
        totals,
        address_snapshot,
        payment_method,
        payment_ref,
        idempotency_key,
        placed_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id, order_number, status, currency, placed_at;
    `,h=a.buyerId&&36===a.buyerId.length?a.buyerId:null,i=`IDEMP-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,j=(await (0,d.P)(g,[b,h,a.buyerEmail.toLowerCase().trim(),"confirmed","NGN",JSON.stringify(a.totals),JSON.stringify(a.customer),a.paymentMethod||"Paystack Escrow",c,i,f])).rows[0].id;for(let b of a.items){let a=`
        INSERT INTO orders.order_lines (
          order_id,
          product_id,
          product_title,
          seller_name,
          unit_price_minor,
          currency,
          qty,
          image_url
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
      `,c=36===b.id.length?b.id:null,e=Math.round(100*b.priceNgn);await (0,d.P)(a,[j,c,b.name,b.seller||"Manga Verified Vendor",e,"NGN",b.quantity,b.image||null])}let k=`
      INSERT INTO shipping.shipments (
        order_id,
        tracking_number,
        carrier,
        status,
        estimated_delivery,
        events
      ) VALUES ($1, $2, $3, $4, NOW() + INTERVAL '24 hours', $5);
    `,l=[{status:"order_confirmed",location:"Kaduna / Lagos Regional Station",time:f,description:"Payment verified and escrow locked. Vendor preparing package."}];return await (0,d.P)(k,[j,b,"Manga Express Courier Fleet","in_transit",JSON.stringify(l)]),{orderNumber:b,orderId:j,status:"confirmed",currency:"NGN",paymentRef:c,placedAt:f,source:"database_postgres"}}catch(a){return console.warn("[DB Orders] createDbOrder failed to save to PostgreSQL, fallback generated:",a.message),{orderNumber:b,orderId:g().randomUUID(),status:"confirmed",currency:"NGN",paymentRef:c,placedAt:f,source:"fallback_resilient"}}}async function i(a){let b=a.trim();try{await (0,e.ly)();let a=`
      SELECT
        o.id as order_id,
        o.order_number,
        o.buyer_email,
        o.status as order_status,
        o.currency,
        o.totals,
        o.address_snapshot,
        o.payment_method,
        o.placed_at,
        s.carrier,
        s.status as shipment_status,
        s.estimated_delivery,
        s.events,
        json_agg(
          json_build_object(
            'title', ol.product_title,
            'seller', ol.seller_name,
            'priceNgn', ol.unit_price_minor / 100,
            'qty', ol.qty,
            'image', ol.image_url
          )
        ) as items
      FROM orders.orders o
      LEFT JOIN shipping.shipments s ON s.order_id = o.id
      LEFT JOIN orders.order_lines ol ON ol.order_id = o.id
      WHERE o.order_number ILIKE $1
      GROUP BY o.id, o.order_number, o.buyer_email, o.status, o.currency, o.totals, o.address_snapshot, o.payment_method, o.placed_at, s.carrier, s.status, s.estimated_delivery, s.events
      LIMIT 1;
    `,c=await (0,d.P)(a,[b]);if(c.rows&&c.rows.length>0){let a=c.rows[0];return{orderNumber:a.order_number,status:a.shipment_status||a.order_status,placedAt:a.placed_at,currency:a.currency,totals:a.totals,address:a.address_snapshot,items:a.items,parcels:[{trackingNumber:a.order_number,carrier:a.carrier||"Manga Express Fleet",status:a.shipment_status||"in_transit",estimatedDelivery:a.estimated_delivery||"Tomorrow by 5:00 PM",events:a.events||[]}],source:"database_postgres"}}}catch(a){console.warn("[DB Orders] getDbOrderByRef note:",a.message)}return null}async function j(a){try{await (0,e.ly)();let b=`
      SELECT
        o.id as order_id,
        o.order_number,
        o.status,
        o.currency,
        o.totals,
        o.address_snapshot,
        o.payment_method,
        o.placed_at,
        json_agg(
          json_build_object(
            'title', ol.product_title,
            'seller', ol.seller_name,
            'priceNgn', ol.unit_price_minor / 100,
            'qty', ol.qty,
            'image', ol.image_url
          )
        ) as items
      FROM orders.orders o
      LEFT JOIN orders.order_lines ol ON ol.order_id = o.id
      WHERE o.buyer_email ILIKE $1
      GROUP BY o.id, o.order_number, o.status, o.currency, o.totals, o.address_snapshot, o.payment_method, o.placed_at
      ORDER BY o.placed_at DESC
      LIMIT 20;
    `,c=await (0,d.P)(b,[a.toLowerCase().trim()]);if(c.rows&&c.rows.length>0)return c.rows.map(a=>({orderRef:a.order_number,createdAt:a.placed_at,totalNgn:a.totals?.totalNgn||a.totals?.grandTotal||0,totalUsd:a.totals?.totalUsd||Math.round((a.totals?.totalNgn||0)/1400),paymentMethod:a.payment_method,status:a.status,items:a.items||[],shippingAddress:a.address_snapshot}))}catch(a){console.warn("[DB Orders] getDbOrdersByEmail error:",a.message)}return[]}},84326:(a,b,c)=>{"use strict";c.d(b,{OV:()=>k,P:()=>j,h1:()=>i});let d=null,e=null,f=null;function g(){if(e)return e;try{let a=c(42449);return e=a.Pool?a:{Pool:a.default?.Pool||a}}catch(a){return f=a.message||"Cannot find module pg",null}}function h(){let a=process.env.DATABASE_URL||process.env.POSTGRES_URL||process.env.POSTGRES_PRISMA_URL||"";if(a.includes("REPLACE_WITH_SECURE_DATABASE_PASSWORD")&&(a=""),!a)try{let b=c(29021),d=c(33873);for(let c of[d.join(process.cwd(),".env"),d.join(process.cwd(),"..",".env"),"/home/gwylvxeo/manga.jlm.com.ng/.env","/home/gwylvxeo/manga.jlm.com.ng/apps/web-store/.env"])if(b.existsSync(c)){for(let d of b.readFileSync(c,"utf8").split(/\r?\n/)){let b=d.trim();if(b.startsWith("DATABASE_URL=")){let c=b.slice(13).trim().replace(/^["']|["']$/g,"");if(c&&!c.includes("REPLACE_WITH_SECURE_DATABASE_PASSWORD")){a=c,process.env.DATABASE_URL=a;break}}}if(a)break}}catch{}return a}function i(a){if(!a)return"";let b=a.trim(),c=(b=(b=(b=(b=b.replace(/\s*@\s*/g,"@")).replace(/\s*:\s*/g,":")).replace(/\s*\/\s*/g,"/")).replace(/@(localhost|hostname)([:\/]|$)/g,"@127.0.0.1$2")).match(/^(postgres(?:ql)?:\/\/[^:]+:)(.+)(@[^@\/]+(?::\d+)?\/.*)$/);if(c){let a=c[1],d=c[2],e=c[3];b=a+(d=d.replace(/%(?![0-9a-fA-F]{2})/g,"%25"))+e}return b}async function j(a,b=[]){return(function(){if(d)return d;let a=g();if(!a||!a.Pool)throw Error(`PostgreSQL driver 'pg' is not loaded: ${f||"Cannot find module pg"}. Please run npm install in cPanel.`);let b=i(h()),c="false"===process.env.DATABASE_SSL||"disable"===process.env.PGSSLMODE,e="true"===process.env.DATABASE_SSL||"require"===process.env.PGSSLMODE,j=b.includes("supabase")||b.includes("neon.tech")||b.includes("render.com")||b.includes("railway.app")||b.includes("pooler.supabase.com")||b.includes("rds.amazonaws.com")||b.includes("sslmode=require"),k=b.includes("localhost")||b.includes("127.0.0.1")||!b&&(!process.env.POSTGRES_HOST||"localhost"===process.env.POSTGRES_HOST||"127.0.0.1"===process.env.POSTGRES_HOST),l=!c&&(e||j||!k)?{rejectUnauthorized:!1}:void 0,m=(process.env.POSTGRES_HOST||"127.0.0.1").replace("localhost","127.0.0.1"),n=b?{connectionString:b,ssl:l,max:10,idleTimeoutMillis:3e4,connectionTimeoutMillis:6e3}:{host:m,port:parseInt(process.env.POSTGRES_PORT||"5432",10),user:process.env.POSTGRES_USER||"gwylvxeo_manga_user",password:process.env.POSTGRES_PASSWORD||"manga_password",database:process.env.POSTGRES_DB||"gwylvxeo_manga",ssl:l,max:10,idleTimeoutMillis:3e4,connectionTimeoutMillis:6e3},o=new a.Pool(n);return o.on("error",a=>{console.warn("[DB] Unexpected error on idle PostgreSQL client:",a?.message||a)}),d=o})().query(a,b)}async function k(){let a=g();if(!a||!a.Pool)return{connected:!1,driverInstalled:!1,error:`PostgreSQL driver ('pg') is not installed in the server's node_modules directory (${f||"Cannot find module pg"}). Click 'Run NPM Install' in cPanel to install dependencies.`};let b=i(h()),c=b?b.replace(/:[^:@]*@/,":****@"):"configured via host/user/port";try{let a=await j("SELECT version()");return{connected:!0,driverInstalled:!0,version:a.rows[0]?.version,sanitizedUrl:c}}catch(a){return{connected:!1,driverInstalled:!0,sanitizedUrl:c,error:a.message}}}}};