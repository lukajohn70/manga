"use strict";(()=>{var a={};a.id=765,a.ids=[765],a.modules={261:a=>{a.exports=require("next/dist/shared/lib/router/utils/app-paths")},3295:a=>{a.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:a=>{a.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},19121:a=>{a.exports=require("next/dist/server/app-render/action-async-storage.external.js")},29021:a=>{a.exports=require("fs")},29294:a=>{a.exports=require("next/dist/server/app-render/work-async-storage.external.js")},33873:a=>{a.exports=require("path")},42449:a=>{a.exports=require("pg")},44870:a=>{a.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},55511:a=>{a.exports=require("crypto")},61339:(a,b,c)=>{c.r(b),c.d(b,{handler:()=>D,patchFetch:()=>C,routeModule:()=>y,serverHooks:()=>B,workAsyncStorage:()=>z,workUnitAsyncStorage:()=>A});var d={};c.r(d),c.d(d,{GET:()=>x});var e=c(90199),f=c(51152),g=c(88143),h=c(76215),i=c(10161),j=c(261),k=c(61907),l=c(46877),m=c(1391),n=c(86508),o=c(21338),p=c(62896),q=c(71858),r=c(96375),s=c(86439),t=c(12672),u=c(61965),v=c(77446),w=c(71592);async function x(a){try{let{searchParams:b}=new URL(a.url),c=b.get("q")||"",d=b.get("category")||"",e=b.get("type"),f=parseInt(b.get("limit")||"50",10),g=parseInt(b.get("offset")||"0",10),h=await (0,w.hE)({q:c,category:d,type:"digital"===e||"physical"===e?e:void 0,limit:f,offset:g});return v.NextResponse.json(h)}catch(b){let a=await (0,w.hE)({});return v.NextResponse.json({...a,source:"fallback_resilient",error:b?.message})}}let y=new e.AppRouteRouteModule({definition:{kind:f.RouteKind.APP_ROUTE,page:"/api/products/route",pathname:"/api/products",filename:"route",bundlePath:"app/api/products/route"},distDir:".next",relativeProjectDir:"",resolvedPagePath:"/Applications/MAMP/htdocs/manga/apps/web-store/src/app/api/products/route.ts",nextConfigOutput:"",userland:d}),{workAsyncStorage:z,workUnitAsyncStorage:A,serverHooks:B}=y;function C(){return(0,g.patchFetch)({workAsyncStorage:z,workUnitAsyncStorage:A})}async function D(a,b,c){var d;let e="/api/products/route";"/index"===e&&(e="/");let g=await y.prepare(a,b,{srcPage:e,multiZoneDraftMode:!1});if(!g)return b.statusCode=400,b.end("Bad Request"),null==c.waitUntil||c.waitUntil.call(c,Promise.resolve()),null;let{buildId:v,params:w,nextConfig:x,isDraftMode:z,prerenderManifest:A,routerServerContext:B,isOnDemandRevalidate:C,revalidateOnlyGenerated:D,resolvedPathname:E}=g,F=(0,j.normalizeAppPath)(e),G=!!A.routes[E]&&(y.isDev||(0,t.isRouteCacheOwner)(E,y.cacheOwner,A.routes[E])),H=!!(A.dynamicRoutes[F]||G);if(H&&!z){let a=A.dynamicRoutes[F];if(a&&!1===a.fallback&&!G)throw new s.NoFallbackError}let I=null;!H||y.isDev||z||(I="/index"===(I=E)?"/":I);let J=!0===y.isDev||!H,K=H&&!J,L=a.method||"GET",M=(0,i.getTracer)(),N=M.getActiveScopeSpan(),O={params:w,prerenderManifest:A,renderOpts:{experimental:{cacheComponents:!!x.experimental.cacheComponents,authInterrupts:!!x.experimental.authInterrupts},supportsDynamicResponse:J,incrementalCache:(0,h.getRequestMeta)(a,"incrementalCache"),cacheLifeProfiles:null==(d=x.experimental)?void 0:d.cacheLife,isRevalidate:K,waitUntil:c.waitUntil,onClose:a=>{b.on("close",a)},onAfterTaskError:void 0,onInstrumentationRequestError:(b,c,d)=>y.onRequestError(a,b,d,B)},sharedContext:{buildId:v}},P=new k.NodeNextRequest(a),Q=new k.NodeNextResponse(b),R=l.NextRequestAdapter.fromNodeNextRequest(P,(0,l.signalFromNodeResponse)(b));try{let d=async c=>y.handle(R,O).finally(()=>{if(!c)return;c.setAttributes({"http.status_code":b.statusCode,"next.rsc":!1});let d=M.getRootSpanAttributes();if(!d)return;if(d.get("next.span_type")!==m.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${d.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let e=d.get("next.route");if(e){let a=`${L} ${e}`;c.setAttributes({"next.route":e,"http.route":e,"next.span_name":a}),c.updateName(a)}else c.updateName(`${L} ${a.url}`)}),g=async g=>{var i,j;let k=async({previousCacheEntry:f})=>{try{if(!(0,h.getRequestMeta)(a,"minimalMode")&&C&&D&&!f)return b.statusCode=404,b.setHeader("x-nextjs-cache","REVALIDATED"),b.end("This page could not be found"),null;let e=await d(g);a.fetchMetrics=O.renderOpts.fetchMetrics;let i=O.renderOpts.pendingWaitUntil;i&&c.waitUntil&&(c.waitUntil(i),i=void 0);let j=O.renderOpts.collectedTags;if(!H)return await (0,o.I)(P,Q,e,O.renderOpts.pendingWaitUntil),null;{let a=await e.blob(),b=(0,p.toNodeOutgoingHttpHeaders)(e.headers);j&&(b[r.NEXT_CACHE_TAGS_HEADER]=j),!b["content-type"]&&a.type&&(b["content-type"]=a.type);let c=void 0!==O.renderOpts.collectedRevalidate&&!(O.renderOpts.collectedRevalidate>=r.INFINITE_CACHE)&&O.renderOpts.collectedRevalidate,d=void 0===O.renderOpts.collectedExpire||O.renderOpts.collectedExpire>=r.INFINITE_CACHE?void 0:O.renderOpts.collectedExpire;return{value:{kind:u.CachedRouteKind.APP_ROUTE,status:e.status,body:Buffer.from(await a.arrayBuffer()),headers:b},cacheControl:{revalidate:c,expire:d}}}}catch(b){throw(null==f?void 0:f.isStale)&&await y.onRequestError(a,b,{routerKind:"App Router",routePath:e,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:K,isOnDemandRevalidate:C})},B),b}},l=await y.handleResponse({req:a,nextConfig:x,cacheKey:I,routeKind:f.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:A,isRoutePPREnabled:!1,isOnDemandRevalidate:C,revalidateOnlyGenerated:D,responseGenerator:k,waitUntil:c.waitUntil});if(!H)return null;if((null==l||null==(i=l.value)?void 0:i.kind)!==u.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(j=l.value)?void 0:j.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});(0,h.getRequestMeta)(a,"minimalMode")||b.setHeader("x-nextjs-cache",C?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),z&&b.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let m=(0,p.fromNodeOutgoingHttpHeaders)(l.value.headers);return(0,h.getRequestMeta)(a,"minimalMode")&&H||m.delete(r.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||b.getHeader("Cache-Control")||m.get("Cache-Control")||m.set("Cache-Control",(0,q.getCacheControlHeader)(l.cacheControl)),await (0,o.I)(P,Q,new Response(l.value.body,{headers:m,status:l.value.status||200})),null};N?await g(N):await M.withPropagatedContext(a.headers,()=>M.trace(m.BaseServerSpan.handleRequest,{spanName:`${L} ${a.url}`,kind:i.SpanKind.SERVER,attributes:{"http.method":L,"http.target":a.url}},g))}catch(b){if(b instanceof s.NoFallbackError||await y.onRequestError(a,b,{routerKind:"App Router",routePath:F,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:K,isOnDemandRevalidate:C})}),H)throw b;return await (0,o.I)(P,Q,new Response(null,{status:500})),null}}},63033:a=>{a.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},71592:(a,b,c)=>{c.d(b,{Re:()=>i,hE:()=>g,qC:()=>h});var d=c(84326),e=c(1927);function f(a){let b=a.price_minor?Math.round(Number(a.price_minor)/100):5e4,c=a.compare_at_minor?Math.round(Number(a.compare_at_minor)/100):Math.round(1.25*b),d=Math.round(b/1400),e=Math.round(c/1400),f="digital"===a.category_slug;return{id:a.id,title:a.title,brand:a.brand_name||"Generic",category:a.category_slug||"computing",categoryName:a.category_name||"General Products",priceNgn:b,oldPriceNgn:c,priceUsd:d,oldPriceUsd:e,image:a.image_url||"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85",rating:parseFloat(a.rating)||4.9,reviewsCount:parseInt(a.reviews_count,10)||120,storeName:a.vendor_name||"Official Store",type:f?"digital":"physical",deliveryEstimate:f?"Instant Digital Download / License Key":"Manga Express • Tomorrow (Kaduna/Lagos)",offerId:a.offer_id,stockLeft:parseInt(a.stock_left,10)||25}}async function g(a={}){try{await (0,e.ly)();let b=["mp.status = 'published'"],c=[],g=1;a.category&&"all"!==a.category&&"flash"!==a.category&&(b.push(`c.slug = $${g}`),c.push(a.category),g++),a.q&&a.q.trim()&&(b.push(`(
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
    `,b=await (0,d.P)(a);if(b.rows&&b.rows.length>0)return b.rows.map(a=>({id:a.id,slug:a.slug,name:a.name,icon:a.icon_url||"fa-tag",count:parseInt(a.product_count,10)||0}))}catch(a){console.warn("[DB Catalog] getDbCategories note:",a.message)}return[{id:"1",slug:"computing",name:"Phones & Computing",icon:"fa-laptop",count:8},{id:"2",slug:"electronics",name:"Electronics & Audio",icon:"fa-headphones",count:6},{id:"3",slug:"fashion",name:"Fashion & Streetwear",icon:"fa-shirt",count:5},{id:"4",slug:"home",name:"Home & Appliances",icon:"fa-couch",count:4},{id:"5",slug:"digital",name:"Software & Digital Assets",icon:"fa-code",count:3}]}},86439:a=>{a.exports=require("next/dist/shared/lib/no-fallback-error.external")}};var b=require("../../../webpack-runtime.js");b.C(a);var c=b.X(0,[839,415,605],()=>b(b.s=61339));module.exports=c})();