exports.id=598,exports.ids=[598],exports.modules={1927:(a,b,c)=>{"use strict";c.d(b,{IM:()=>l,ly:()=>m,vE:()=>i});var d=c(84326),e=c(55511),f=c.n(e);let g=`
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
    `);a.rows[0]?.exists!==!0&&(console.log("[DB-Init] Tables missing. Auto-creating database schemas..."),await (0,d.P)(g),await (0,d.P)(h));let b=await (0,d.P)("SELECT id FROM identity.users WHERE email ILIKE $1",[i]);if(!b.rows||0===b.rows.length){console.log("[DB-Init] Admin user lukajohn70@gmail.com not found. Triggering full database purge & admin provisioning...");let a=await l();return{initialized:a.success,message:a.message}}return k=!0,{initialized:!0,message:"Database tables verified and admin user active."}}catch(a){return console.warn("[DB-Init] Database check note:",a.message),{initialized:!1,message:a.message}}}},21402:()=>{},61570:()=>{},71592:(a,b,c)=>{"use strict";c.d(b,{Re:()=>i,hE:()=>g,qC:()=>h});var d=c(84326),e=c(1927);function f(a){let b=a.price_minor?Math.round(Number(a.price_minor)/100):5e4,c=a.compare_at_minor?Math.round(Number(a.compare_at_minor)/100):Math.round(1.25*b),d=Math.round(b/1400),e=Math.round(c/1400),f="digital"===a.category_slug;return{id:a.id,title:a.title,brand:a.brand_name||"Generic",category:a.category_slug||"computing",categoryName:a.category_name||"General Products",priceNgn:b,oldPriceNgn:c,priceUsd:d,oldPriceUsd:e,image:a.image_url||"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85",rating:parseFloat(a.rating)||4.9,reviewsCount:parseInt(a.reviews_count,10)||120,storeName:a.vendor_name||"Official Store",type:f?"digital":"physical",deliveryEstimate:f?"Instant Digital Download / License Key":"Manga Express • Tomorrow (Kaduna/Lagos)",offerId:a.offer_id,stockLeft:parseInt(a.stock_left,10)||25}}async function g(a={}){try{await (0,e.ly)();let b=["mp.status = 'published'"],c=[],g=1;a.category&&"all"!==a.category&&"flash"!==a.category&&(b.push(`c.slug = $${g}`),c.push(a.category),g++),a.q&&a.q.trim()&&(b.push(`(
        mp.title ILIKE $${g} OR 
        mp.description ILIKE $${g} OR 
        mp.brand_name ILIKE $${g} OR 
        v.business_name ILIKE $${g}
      )`),c.push(`%${a.q.trim()}%`),g++);let h=b.join(" AND "),i=a.limit||50,j=a.offset||0,k=`
      SELECT
        mp.id,
        mp.title,
        mp.brand_name,
        mp.description,
        mp.image_url,
        mp.rating,
        mp.reviews_count,
        mp.attributes,
        c.slug as category_slug,
        c.name as category_name,
        o.id as offer_id,
        o.price_minor,
        o.compare_at_minor,
        o.currency,
        v.business_name as vendor_name,
        COALESCE((
          SELECT SUM(on_hand - reserved) 
          FROM inventory.stock_levels sl 
          WHERE sl.variant_id = var.id
        ), 25) as stock_left
      FROM catalog.master_products mp
      JOIN catalog.categories c ON c.id = mp.category_id
      LEFT JOIN LATERAL (
        SELECT id FROM catalog.variants WHERE master_product_id = mp.id LIMIT 1
      ) var ON true
      LEFT JOIN LATERAL (
        SELECT id, vendor_id, price_minor, compare_at_minor, currency 
        FROM offers.offers 
        WHERE variant_id = var.id AND status = 'active' 
        ORDER BY price_minor ASC LIMIT 1
      ) o ON true
      LEFT JOIN vendor.vendors v ON v.id = o.vendor_id
      WHERE ${h}
      ORDER BY mp.created_at DESC
      LIMIT $${g} OFFSET $${g+1}
    `;c.push(i,j);let l=((await (0,d.P)(k,c)).rows||[]).map(f);return{items:l,total:l.length,source:"database_postgres"}}catch(a){console.warn("[DB Catalog] Database query error:",a.message)}return{items:[],total:0,source:"fallback_resilient"}}async function h(a){try{await (0,e.ly)();let b=`
      SELECT
        mp.id,
        mp.title,
        mp.brand_name,
        mp.description,
        mp.image_url,
        mp.rating,
        mp.reviews_count,
        mp.attributes,
        c.slug as category_slug,
        c.name as category_name,
        o.id as offer_id,
        o.price_minor,
        o.compare_at_minor,
        o.currency,
        v.id as vendor_id,
        v.business_name as vendor_name,
        v.tier as vendor_tier,
        v.rating as vendor_rating
      FROM catalog.master_products mp
      JOIN catalog.categories c ON c.id = mp.category_id
      LEFT JOIN LATERAL (
        SELECT id FROM catalog.variants WHERE master_product_id = mp.id LIMIT 1
      ) var ON true
      LEFT JOIN LATERAL (
        SELECT id, vendor_id, price_minor, compare_at_minor, currency 
        FROM offers.offers 
        WHERE variant_id = var.id AND status = 'active' 
        ORDER BY price_minor ASC LIMIT 1
      ) o ON true
      LEFT JOIN vendor.vendors v ON v.id = o.vendor_id
      WHERE mp.id = $1 OR mp.title ILIKE $1
      LIMIT 1
    `,c=await (0,d.P)(b,[a]);if(c.rows&&c.rows.length>0){let a=c.rows[0],b=a.price_minor?Math.round(Number(a.price_minor)/100):0,d=a.compare_at_minor?Math.round(Number(a.compare_at_minor)/100):void 0;return{product:{id:a.id,sku:"SKU-"+a.id.slice(0,8),title:a.title,brand:a.brand_name||"Generic",description:a.description||"",category:a.category_slug||"computing",categoryName:a.category_name||"General Products",priceNgn:b,oldPriceNgn:d,priceUsd:Math.round(b/1400),oldPriceUsd:d?Math.round(d/1400):void 0,image:a.image_url||"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85",gallery:[a.image_url||"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85"],storeName:a.vendor_name||"Verified Merchant",vendorTier:a.vendor_tier||"tier_1",vendorRating:4.9,vendorLocation:"Kaduna Hub",rating:parseFloat(a.rating)||5,reviewsCount:parseInt(a.reviews_count,10)||0,type:"digital"===a.category_slug?"digital":"physical",stockLeft:25,deliveryEstimate:"Manga Express • Tomorrow",warranty:"1 Year Warranty",hook:a.title,scannableBenefits:[],narrativeStory:a.description||"",specs:[],boxContents:[],trustShipping:{warrantyDuration:"1 Year Official Warranty",returnPolicy:"7-Day Return Guarantee",kadunaSameDay:!0,nationwideDelivery:"24-48h Delivery",sellerAccredited:!0,escrowProtected:!0},faq:[],highlights:[],variants:[]},source:"database_postgres"}}return{product:null,source:"database_postgres"}}catch(a){console.warn("[DB Catalog] getProductById error:",a.message)}return{product:null,source:"fallback_resilient"}}async function i(){try{await (0,e.ly)();let a=`
      SELECT
        c.id,
        c.slug,
        c.name,
        c.icon_url,
        COUNT(mp.id) as product_count
      FROM catalog.categories c
      LEFT JOIN catalog.master_products mp ON mp.category_id = c.id AND mp.status = 'published'
      GROUP BY c.id, c.slug, c.name, c.icon_url
      ORDER BY c.name ASC
    `,b=await (0,d.P)(a);if(b.rows&&b.rows.length>0)return b.rows.map(a=>({id:a.id,slug:a.slug,name:a.name,icon:a.icon_url||"fa-tag",count:parseInt(a.product_count,10)||0}))}catch(a){console.warn("[DB Catalog] getDbCategories note:",a.message)}return[{id:"1",slug:"computing",name:"Phones & Computing",icon:"fa-laptop",count:8},{id:"2",slug:"electronics",name:"Electronics & Audio",icon:"fa-headphones",count:6},{id:"3",slug:"fashion",name:"Fashion & Streetwear",icon:"fa-shirt",count:5},{id:"4",slug:"home",name:"Home & Appliances",icon:"fa-couch",count:4},{id:"5",slug:"digital",name:"Software & Digital Assets",icon:"fa-code",count:3}]}},84326:(a,b,c)=>{"use strict";c.d(b,{OV:()=>k,P:()=>j,h1:()=>i});let d=null,e=null,f=null;function g(){if(e)return e;try{let a=c(42449);return e=a.Pool?a:{Pool:a.default?.Pool||a}}catch(a){return f=a.message||"Cannot find module pg",null}}function h(){let a=process.env.DATABASE_URL||process.env.POSTGRES_URL||process.env.POSTGRES_PRISMA_URL||"";if(a.includes("REPLACE_WITH_SECURE_DATABASE_PASSWORD")&&(a=""),!a)try{let b=c(29021),d=c(33873);for(let c of[d.join(process.cwd(),".env"),d.join(process.cwd(),"..",".env"),"/home/gwylvxeo/manga.jlm.com.ng/.env","/home/gwylvxeo/manga.jlm.com.ng/apps/web-store/.env"])if(b.existsSync(c)){for(let d of b.readFileSync(c,"utf8").split(/\r?\n/)){let b=d.trim();if(b.startsWith("DATABASE_URL=")){let c=b.slice(13).trim().replace(/^["']|["']$/g,"");if(c&&!c.includes("REPLACE_WITH_SECURE_DATABASE_PASSWORD")){a=c,process.env.DATABASE_URL=a;break}}}if(a)break}}catch{}return a}function i(a){if(!a)return"";let b=a.trim(),c=(b=(b=(b=(b=b.replace(/\s*@\s*/g,"@")).replace(/\s*:\s*/g,":")).replace(/\s*\/\s*/g,"/")).replace(/@(localhost|hostname)([:\/]|$)/g,"@127.0.0.1$2")).match(/^(postgres(?:ql)?:\/\/[^:]+:)(.+)(@[^@\/]+(?::\d+)?\/.*)$/);if(c){let a=c[1],d=c[2],e=c[3];b=a+(d=d.replace(/%(?![0-9a-fA-F]{2})/g,"%25"))+e}return b}async function j(a,b=[]){return(function(){if(d)return d;let a=g();if(!a||!a.Pool)throw Error(`PostgreSQL driver 'pg' is not loaded: ${f||"Cannot find module pg"}. Please run npm install in cPanel.`);let b=i(h()),c="false"===process.env.DATABASE_SSL||"disable"===process.env.PGSSLMODE,e="true"===process.env.DATABASE_SSL||"require"===process.env.PGSSLMODE,j=b.includes("supabase")||b.includes("neon.tech")||b.includes("render.com")||b.includes("railway.app")||b.includes("pooler.supabase.com")||b.includes("rds.amazonaws.com")||b.includes("sslmode=require"),k=b.includes("localhost")||b.includes("127.0.0.1")||!b&&(!process.env.POSTGRES_HOST||"localhost"===process.env.POSTGRES_HOST||"127.0.0.1"===process.env.POSTGRES_HOST),l=!c&&(e||j||!k)?{rejectUnauthorized:!1}:void 0,m=(process.env.POSTGRES_HOST||"127.0.0.1").replace("localhost","127.0.0.1"),n=b?{connectionString:b,ssl:l,max:10,idleTimeoutMillis:3e4,connectionTimeoutMillis:6e3}:{host:m,port:parseInt(process.env.POSTGRES_PORT||"5432",10),user:process.env.POSTGRES_USER||"gwylvxeo_manga_user",password:process.env.POSTGRES_PASSWORD||"manga_password",database:process.env.POSTGRES_DB||"gwylvxeo_manga",ssl:l,max:10,idleTimeoutMillis:3e4,connectionTimeoutMillis:6e3},o=new a.Pool(n);return o.on("error",a=>{console.warn("[DB] Unexpected error on idle PostgreSQL client:",a?.message||a)}),d=o})().query(a,b)}async function k(){let a=g();if(!a||!a.Pool)return{connected:!1,driverInstalled:!1,error:`PostgreSQL driver ('pg') is not installed in the server's node_modules directory (${f||"Cannot find module pg"}). Click 'Run NPM Install' in cPanel to install dependencies.`};let b=i(h()),c=b?b.replace(/:[^:@]*@/,":****@"):"configured via host/user/port";try{let a=await j("SELECT version()");return{connected:!0,driverInstalled:!0,version:a.rows[0]?.version,sanitizedUrl:c}}catch(a){return{connected:!1,driverInstalled:!0,sanitizedUrl:c,error:a.message}}}}};