(()=>{var a={};a.id=641,a.ids=[641],a.modules={261:a=>{"use strict";a.exports=require("next/dist/shared/lib/router/utils/app-paths")},1927:(a,b,c)=>{"use strict";c.d(b,{IM:()=>l,ly:()=>m,vE:()=>i});var d=c(84326),e=c(55511),f=c.n(e);let g=`
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
    `);a.rows[0]?.exists!==!0&&(console.log("[DB-Init] Tables missing. Auto-creating database schemas..."),await (0,d.P)(g),await (0,d.P)(h));let b=await (0,d.P)("SELECT id FROM identity.users WHERE email ILIKE $1",[i]);if(!b.rows||0===b.rows.length){console.log("[DB-Init] Admin user lukajohn70@gmail.com not found. Triggering full database purge & admin provisioning...");let a=await l();return{initialized:a.success,message:a.message}}return k=!0,{initialized:!0,message:"Database tables verified and admin user active."}}catch(a){return console.warn("[DB-Init] Database check note:",a.message),{initialized:!1,message:a.message}}}},3295:a=>{"use strict";a.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},19121:a=>{"use strict";a.exports=require("next/dist/server/app-render/action-async-storage.external.js")},21402:()=>{},29021:a=>{"use strict";a.exports=require("fs")},29294:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-async-storage.external.js")},33873:a=>{"use strict";a.exports=require("path")},42449:a=>{"use strict";a.exports=require("pg")},44870:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},55511:a=>{"use strict";a.exports=require("crypto")},61570:()=>{},63033:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},84326:(a,b,c)=>{"use strict";c.d(b,{OV:()=>k,P:()=>j,h1:()=>i});let d=null,e=null,f=null;function g(){if(e)return e;try{let a=c(42449);return e=a.Pool?a:{Pool:a.default?.Pool||a}}catch(a){return f=a.message||"Cannot find module pg",null}}function h(){let a=process.env.DATABASE_URL||process.env.POSTGRES_URL||process.env.POSTGRES_PRISMA_URL||"";if(a.includes("REPLACE_WITH_SECURE_DATABASE_PASSWORD")&&(a=""),!a)try{let b=c(29021),d=c(33873);for(let c of[d.join(process.cwd(),".env"),d.join(process.cwd(),"..",".env"),"/home/gwylvxeo/manga.jlm.com.ng/.env","/home/gwylvxeo/manga.jlm.com.ng/apps/web-store/.env"])if(b.existsSync(c)){for(let d of b.readFileSync(c,"utf8").split(/\r?\n/)){let b=d.trim();if(b.startsWith("DATABASE_URL=")){let c=b.slice(13).trim().replace(/^["']|["']$/g,"");if(c&&!c.includes("REPLACE_WITH_SECURE_DATABASE_PASSWORD")){a=c,process.env.DATABASE_URL=a;break}}}if(a)break}}catch{}return a}function i(a){if(!a)return"";let b=a.trim(),c=(b=(b=(b=(b=b.replace(/\s*@\s*/g,"@")).replace(/\s*:\s*/g,":")).replace(/\s*\/\s*/g,"/")).replace(/@(localhost|hostname)([:\/]|$)/g,"@127.0.0.1$2")).match(/^(postgres(?:ql)?:\/\/[^:]+:)(.+)(@[^@\/]+(?::\d+)?\/.*)$/);if(c){let a=c[1],d=c[2],e=c[3];b=a+(d=d.replace(/%(?![0-9a-fA-F]{2})/g,"%25"))+e}return b}async function j(a,b=[]){return(function(){if(d)return d;let a=g();if(!a||!a.Pool)throw Error(`PostgreSQL driver 'pg' is not loaded: ${f||"Cannot find module pg"}. Please run npm install in cPanel.`);let b=i(h()),c="false"===process.env.DATABASE_SSL||"disable"===process.env.PGSSLMODE,e="true"===process.env.DATABASE_SSL||"require"===process.env.PGSSLMODE,j=b.includes("supabase")||b.includes("neon.tech")||b.includes("render.com")||b.includes("railway.app")||b.includes("pooler.supabase.com")||b.includes("rds.amazonaws.com")||b.includes("sslmode=require"),k=b.includes("localhost")||b.includes("127.0.0.1")||!b&&(!process.env.POSTGRES_HOST||"localhost"===process.env.POSTGRES_HOST||"127.0.0.1"===process.env.POSTGRES_HOST),l=!c&&(e||j||!k)?{rejectUnauthorized:!1}:void 0,m=(process.env.POSTGRES_HOST||"127.0.0.1").replace("localhost","127.0.0.1"),n=b?{connectionString:b,ssl:l,max:10,idleTimeoutMillis:3e4,connectionTimeoutMillis:6e3}:{host:m,port:parseInt(process.env.POSTGRES_PORT||"5432",10),user:process.env.POSTGRES_USER||"gwylvxeo_manga_user",password:process.env.POSTGRES_PASSWORD||"manga_password",database:process.env.POSTGRES_DB||"gwylvxeo_manga",ssl:l,max:10,idleTimeoutMillis:3e4,connectionTimeoutMillis:6e3},o=new a.Pool(n);return o.on("error",a=>{console.warn("[DB] Unexpected error on idle PostgreSQL client:",a?.message||a)}),d=o})().query(a,b)}async function k(){let a=g();if(!a||!a.Pool)return{connected:!1,driverInstalled:!1,error:`PostgreSQL driver ('pg') is not installed in the server's node_modules directory (${f||"Cannot find module pg"}). Click 'Run NPM Install' in cPanel to install dependencies.`};let b=i(h()),c=b?b.replace(/:[^:@]*@/,":****@"):"configured via host/user/port";try{let a=await j("SELECT version()");return{connected:!0,driverInstalled:!0,version:a.rows[0]?.version,sanitizedUrl:c}}catch(a){return{connected:!1,driverInstalled:!0,sanitizedUrl:c,error:a.message}}}},86439:a=>{"use strict";a.exports=require("next/dist/shared/lib/no-fallback-error.external")},98535:(a,b,c)=>{"use strict";c.r(b),c.d(b,{handler:()=>F,patchFetch:()=>E,routeModule:()=>A,serverHooks:()=>D,workAsyncStorage:()=>B,workUnitAsyncStorage:()=>C});var d={};c.r(d),c.d(d,{GET:()=>y,POST:()=>z});var e=c(90199),f=c(51152),g=c(88143),h=c(76215),i=c(10161),j=c(261),k=c(61907),l=c(46877),m=c(1391),n=c(86508),o=c(21338),p=c(62896),q=c(71858),r=c(96375),s=c(86439),t=c(12672),u=c(61965),v=c(77446),w=c(84326),x=c(1927);async function y(a){try{let{searchParams:b}=new URL(a.url),c="true"===b.get("force"),d=b.get("action"),e=await (0,w.OV)();if(!e.connected)return v.NextResponse.json({success:!1,database:"PostgreSQL",driverInstalled:e.driverInstalled,connected:!1,error:e.error,configuredTarget:e.sanitizedUrl||"not_configured",instructions:e.driverInstalled?"Ensure DATABASE_URL is set in cPanel with host 127.0.0.1: postgres://USER:PASSWORD@127.0.0.1:5432/DB_NAME, then click the blue SAVE button at the top-right and RESTART.":'The "pg" PostgreSQL driver module is missing in cPanel node_modules. Please click "Run NPM Install" in cPanel Setup Node.js App.'});let f=null;"purge"===d||"true"===b.get("purge")?f=(await (0,x.IM)()).message:await (0,x.ly)(c);let g={};for(let a of["catalog.categories","catalog.master_products","catalog.variants","offers.offers","vendor.vendors","identity.users","orders.orders","shipping.shipments"])try{let b=await (0,w.P)(`SELECT COUNT(*) as count FROM ${a}`);g[a]=parseInt(b.rows[0]?.count||"0",10)}catch{g[a]=-1}let h=!1;try{let a=await (0,w.P)("SELECT email, role FROM identity.users WHERE email ILIKE $1",[x.vE]);h=a.rows&&a.rows.length>0}catch{}let i=[];try{i=(await (0,w.P)(`
        SELECT mp.id, mp.title, c.name as category, v.business_name as seller, o.price_minor / 100 as price_ngn
        FROM catalog.master_products mp
        LEFT JOIN catalog.categories c ON c.id = mp.category_id
        LEFT JOIN catalog.variants var ON var.master_product_id = mp.id
        LEFT JOIN offers.offers o ON o.variant_id = var.id
        LEFT JOIN vendor.vendors v ON v.id = o.vendor_id
        WHERE mp.status = 'published'
        LIMIT 5
      `)).rows}catch{}let j=process.env.DATABASE_URL||process.env.POSTGRES_URL||"",k=(0,w.h1)(j),l=k?k.replace(/:[^:@]*@/,":****@"):"configured via POSTGRES_* envs";return v.NextResponse.json({success:!0,database:"PostgreSQL",connected:!0,driverInstalled:!0,version:e.version,host:l,purgeMessage:f,adminEmail:x.vE,adminConfigured:h,tableCounts:g,sampleProducts:i,ready:!0})}catch(a){return v.NextResponse.json({success:!1,error:a.message||"Unknown error occurred in /api/setup",stack:void 0},{status:200})}}async function z(a){try{let b=await a.json().catch(()=>({}));if("purge"===b.action){let a=await (0,x.IM)();return v.NextResponse.json(a)}let c=await (0,x.ly)();return v.NextResponse.json({success:!0,message:c.message})}catch(a){return v.NextResponse.json({success:!1,message:a.message},{status:500})}}let A=new e.AppRouteRouteModule({definition:{kind:f.RouteKind.APP_ROUTE,page:"/api/setup/route",pathname:"/api/setup",filename:"route",bundlePath:"app/api/setup/route"},distDir:".next",relativeProjectDir:"",resolvedPagePath:"/Applications/MAMP/htdocs/manga/apps/web-store/src/app/api/setup/route.ts",nextConfigOutput:"",userland:d}),{workAsyncStorage:B,workUnitAsyncStorage:C,serverHooks:D}=A;function E(){return(0,g.patchFetch)({workAsyncStorage:B,workUnitAsyncStorage:C})}async function F(a,b,c){var d;let e="/api/setup/route";"/index"===e&&(e="/");let g=await A.prepare(a,b,{srcPage:e,multiZoneDraftMode:!1});if(!g)return b.statusCode=400,b.end("Bad Request"),null==c.waitUntil||c.waitUntil.call(c,Promise.resolve()),null;let{buildId:v,params:w,nextConfig:x,isDraftMode:y,prerenderManifest:z,routerServerContext:B,isOnDemandRevalidate:C,revalidateOnlyGenerated:D,resolvedPathname:E}=g,F=(0,j.normalizeAppPath)(e),G=!!z.routes[E]&&(A.isDev||(0,t.isRouteCacheOwner)(E,A.cacheOwner,z.routes[E])),H=!!(z.dynamicRoutes[F]||G);if(H&&!y){let a=z.dynamicRoutes[F];if(a&&!1===a.fallback&&!G)throw new s.NoFallbackError}let I=null;!H||A.isDev||y||(I="/index"===(I=E)?"/":I);let J=!0===A.isDev||!H,K=H&&!J,L=a.method||"GET",M=(0,i.getTracer)(),N=M.getActiveScopeSpan(),O={params:w,prerenderManifest:z,renderOpts:{experimental:{cacheComponents:!!x.experimental.cacheComponents,authInterrupts:!!x.experimental.authInterrupts},supportsDynamicResponse:J,incrementalCache:(0,h.getRequestMeta)(a,"incrementalCache"),cacheLifeProfiles:null==(d=x.experimental)?void 0:d.cacheLife,isRevalidate:K,waitUntil:c.waitUntil,onClose:a=>{b.on("close",a)},onAfterTaskError:void 0,onInstrumentationRequestError:(b,c,d)=>A.onRequestError(a,b,d,B)},sharedContext:{buildId:v}},P=new k.NodeNextRequest(a),Q=new k.NodeNextResponse(b),R=l.NextRequestAdapter.fromNodeNextRequest(P,(0,l.signalFromNodeResponse)(b));try{let d=async c=>A.handle(R,O).finally(()=>{if(!c)return;c.setAttributes({"http.status_code":b.statusCode,"next.rsc":!1});let d=M.getRootSpanAttributes();if(!d)return;if(d.get("next.span_type")!==m.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${d.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let e=d.get("next.route");if(e){let a=`${L} ${e}`;c.setAttributes({"next.route":e,"http.route":e,"next.span_name":a}),c.updateName(a)}else c.updateName(`${L} ${a.url}`)}),g=async g=>{var i,j;let k=async({previousCacheEntry:f})=>{try{if(!(0,h.getRequestMeta)(a,"minimalMode")&&C&&D&&!f)return b.statusCode=404,b.setHeader("x-nextjs-cache","REVALIDATED"),b.end("This page could not be found"),null;let e=await d(g);a.fetchMetrics=O.renderOpts.fetchMetrics;let i=O.renderOpts.pendingWaitUntil;i&&c.waitUntil&&(c.waitUntil(i),i=void 0);let j=O.renderOpts.collectedTags;if(!H)return await (0,o.I)(P,Q,e,O.renderOpts.pendingWaitUntil),null;{let a=await e.blob(),b=(0,p.toNodeOutgoingHttpHeaders)(e.headers);j&&(b[r.NEXT_CACHE_TAGS_HEADER]=j),!b["content-type"]&&a.type&&(b["content-type"]=a.type);let c=void 0!==O.renderOpts.collectedRevalidate&&!(O.renderOpts.collectedRevalidate>=r.INFINITE_CACHE)&&O.renderOpts.collectedRevalidate,d=void 0===O.renderOpts.collectedExpire||O.renderOpts.collectedExpire>=r.INFINITE_CACHE?void 0:O.renderOpts.collectedExpire;return{value:{kind:u.CachedRouteKind.APP_ROUTE,status:e.status,body:Buffer.from(await a.arrayBuffer()),headers:b},cacheControl:{revalidate:c,expire:d}}}}catch(b){throw(null==f?void 0:f.isStale)&&await A.onRequestError(a,b,{routerKind:"App Router",routePath:e,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:K,isOnDemandRevalidate:C})},B),b}},l=await A.handleResponse({req:a,nextConfig:x,cacheKey:I,routeKind:f.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:z,isRoutePPREnabled:!1,isOnDemandRevalidate:C,revalidateOnlyGenerated:D,responseGenerator:k,waitUntil:c.waitUntil});if(!H)return null;if((null==l||null==(i=l.value)?void 0:i.kind)!==u.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(j=l.value)?void 0:j.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});(0,h.getRequestMeta)(a,"minimalMode")||b.setHeader("x-nextjs-cache",C?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),y&&b.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let m=(0,p.fromNodeOutgoingHttpHeaders)(l.value.headers);return(0,h.getRequestMeta)(a,"minimalMode")&&H||m.delete(r.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||b.getHeader("Cache-Control")||m.get("Cache-Control")||m.set("Cache-Control",(0,q.getCacheControlHeader)(l.cacheControl)),await (0,o.I)(P,Q,new Response(l.value.body,{headers:m,status:l.value.status||200})),null};N?await g(N):await M.withPropagatedContext(a.headers,()=>M.trace(m.BaseServerSpan.handleRequest,{spanName:`${L} ${a.url}`,kind:i.SpanKind.SERVER,attributes:{"http.method":L,"http.target":a.url}},g))}catch(b){if(b instanceof s.NoFallbackError||await A.onRequestError(a,b,{routerKind:"App Router",routePath:F,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:K,isOnDemandRevalidate:C})}),H)throw b;return await (0,o.I)(P,Q,new Response(null,{status:500})),null}}}};var b=require("../../../webpack-runtime.js");b.C(a);var c=b.X(0,[839,415],()=>b(b.s=98535));module.exports=c})();