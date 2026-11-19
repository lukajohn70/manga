"use strict";(()=>{var a={};a.id=146,a.ids=[146],a.modules={261:a=>{a.exports=require("next/dist/shared/lib/router/utils/app-paths")},3295:a=>{a.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:a=>{a.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},19121:a=>{a.exports=require("next/dist/server/app-render/action-async-storage.external.js")},29021:a=>{a.exports=require("fs")},29294:a=>{a.exports=require("next/dist/server/app-render/work-async-storage.external.js")},31421:a=>{a.exports=require("node:child_process")},33873:a=>{a.exports=require("path")},37067:a=>{a.exports=require("node:http")},38522:a=>{a.exports=require("node:zlib")},40610:a=>{a.exports=require("node:dns")},41692:a=>{a.exports=require("node:tls")},42449:a=>{a.exports=require("pg")},44708:a=>{a.exports=require("node:https")},44870:a=>{a.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},45756:(a,b,c)=>{c.r(b),c.d(b,{handler:()=>H,patchFetch:()=>G,routeModule:()=>C,serverHooks:()=>F,workAsyncStorage:()=>D,workUnitAsyncStorage:()=>E});var d={};c.r(d),c.d(d,{POST:()=>B});var e=c(90199),f=c(51152),g=c(88143),h=c(76215),i=c(10161),j=c(261),k=c(61907),l=c(46877),m=c(1391),n=c(86508),o=c(21338),p=c(62896),q=c(71858),r=c(96375),s=c(86439),t=c(12672),u=c(61965),v=c(77446),w=c(82518),x=c(71592);let y={};var z=c(90940),A=c(89886);async function B(a){try{if(!(0,A.kY)(a))return v.NextResponse.json({success:!1,message:"Invalid or missing CSRF token / cross-origin request rejected."},{status:403});let b=(0,A.K5)(a),c=await a.json().catch(()=>({})),d=c.customer;if(!d||"object"!=typeof d)return v.NextResponse.json({success:!1,message:"Customer delivery information is required."},{status:400});let e=(d.email||b?.email||"").toLowerCase().trim();if(!(0,A.DT)(e))return v.NextResponse.json({success:!1,message:"Please provide a valid delivery contact email address."},{status:400});let f=(0,A.xV)(d.name);if(!f||f.length<2||f.length>100)return v.NextResponse.json({success:!1,message:"Recipient name must be between 2 and 100 characters."},{status:400});let g=(0,A.xV)(d.phone);if(!(0,A.FY)(g))return v.NextResponse.json({success:!1,message:"Please provide a valid recipient phone number."},{status:400});let h=(0,A.xV)(d.state);if(!h||h.length<2||h.length>50)return v.NextResponse.json({success:!1,message:"Valid delivery state is required."},{status:400});let i=(0,A.xV)(d.address);if(!i||i.length<5||i.length>255)return v.NextResponse.json({success:!1,message:"Please provide a complete delivery street address (minimum 5 characters)."},{status:400});let j=(0,A.xV)(d.lga||""),k=c.items;if(!Array.isArray(k)||0===k.length)return v.NextResponse.json({success:!1,message:"Your shopping cart is empty."},{status:400});if(k.length>50)return v.NextResponse.json({success:!1,message:"Maximum 50 items allowed per order."},{status:400});let l=[],m=0;for(let a of k){if(!a.id||"string"!=typeof a.id)return v.NextResponse.json({success:!1,message:"Cart contains an item with missing product ID."},{status:400});let b=Math.floor(Number(a.quantity));if(!Number.isFinite(b)||b<1||b>100)return v.NextResponse.json({success:!1,message:`Invalid quantity for item ${a.name||a.id}. Quantity must be between 1 and 100.`},{status:400});let c=null,d=(0,A.xV)(a.name||"Verified Product"),e=(0,A.xV)(a.seller||"Manga Verified Partner"),f=a.image;try{let b=await (0,x.qC)(a.id);b.product&&b.product.priceNgn>0&&(c=b.product.priceNgn,d=b.product.title,e=b.product.storeName,f=b.product.image)}catch(b){console.warn(`[Checkout] DB price lookup error for ${a.id}:`,b.message)}if(null===c){let b=y[a.id]||null;b&&b.priceNgn>0&&(c=b.priceNgn,d=b.title,e=b.storeName,f=b.image)}if(null===c||c<=0)if("number"!=typeof a.priceNgn||!(a.priceNgn>=100))return v.NextResponse.json({success:!1,message:`Product "${a.name||a.id}" is no longer available or invalid price.`},{status:400});else c=Math.round(a.priceNgn);let g=c*b;m+=g,l.push({id:a.id,name:d,seller:e,priceNgn:c,priceUsd:Math.round(c/1400),quantity:b,image:f})}let n=2500*("doorstep"===c.deliveryType),o=m+n,p=Math.round(o/1400),q=(0,A.xV)(c.paymentMethod||"Paystack Escrow Card"),r=(0,A.xV)(c.paymentRef||`PSK-${Date.now().toString(36).toUpperCase()}`),s=await (0,w.bX)({buyerId:b?.userId||c.buyerId,buyerEmail:e,items:l,customer:{name:f,phone:g,address:`${i}, ${j}`.trim(),city:j||"Kaduna",state:h},deliveryType:c.deliveryType||"doorstep",paymentMethod:q,paymentRef:r,totals:{subtotalNgn:m,deliveryFeeNgn:n,discountNgn:0,totalNgn:o,totalUsd:p}});return(0,z.m_)({orderNumber:s.orderNumber,customerName:f,customerEmail:e,items:l.map(a=>({title:a.name,quantity:a.quantity,price:a.priceNgn})),totalAmount:o,deliveryAddress:`${i}, ${j}, ${h}`,isKadunaSameDay:h.toLowerCase().includes("kaduna")}).catch(a=>{console.warn("[Checkout] Order confirmation email dispatch notice:",a.message)}),v.NextResponse.json({success:!0,orderNumber:s.orderNumber,orderId:s.orderId,status:s.status,currency:s.currency,paymentRef:s.paymentRef,placedAt:s.placedAt,message:"Order verified and securely registered.",totals:{subtotalNgn:m,deliveryFeeNgn:n,totalNgn:o,totalUsd:p},source:s.source})}catch(a){return console.error("[API Checkout Error]",a.message),v.NextResponse.json({success:!1,message:"Unable to process checkout. Please verify order details and try again."},{status:500})}}let C=new e.AppRouteRouteModule({definition:{kind:f.RouteKind.APP_ROUTE,page:"/api/checkout/route",pathname:"/api/checkout",filename:"route",bundlePath:"app/api/checkout/route"},distDir:".next",relativeProjectDir:"",resolvedPagePath:"/Applications/MAMP/htdocs/manga/apps/web-store/src/app/api/checkout/route.ts",nextConfigOutput:"",userland:d}),{workAsyncStorage:D,workUnitAsyncStorage:E,serverHooks:F}=C;function G(){return(0,g.patchFetch)({workAsyncStorage:D,workUnitAsyncStorage:E})}async function H(a,b,c){var d;let e="/api/checkout/route";"/index"===e&&(e="/");let g=await C.prepare(a,b,{srcPage:e,multiZoneDraftMode:!1});if(!g)return b.statusCode=400,b.end("Bad Request"),null==c.waitUntil||c.waitUntil.call(c,Promise.resolve()),null;let{buildId:v,params:w,nextConfig:x,isDraftMode:y,prerenderManifest:z,routerServerContext:A,isOnDemandRevalidate:B,revalidateOnlyGenerated:D,resolvedPathname:E}=g,F=(0,j.normalizeAppPath)(e),G=!!z.routes[E]&&(C.isDev||(0,t.isRouteCacheOwner)(E,C.cacheOwner,z.routes[E])),H=!!(z.dynamicRoutes[F]||G);if(H&&!y){let a=z.dynamicRoutes[F];if(a&&!1===a.fallback&&!G)throw new s.NoFallbackError}let I=null;!H||C.isDev||y||(I="/index"===(I=E)?"/":I);let J=!0===C.isDev||!H,K=H&&!J,L=a.method||"GET",M=(0,i.getTracer)(),N=M.getActiveScopeSpan(),O={params:w,prerenderManifest:z,renderOpts:{experimental:{cacheComponents:!!x.experimental.cacheComponents,authInterrupts:!!x.experimental.authInterrupts},supportsDynamicResponse:J,incrementalCache:(0,h.getRequestMeta)(a,"incrementalCache"),cacheLifeProfiles:null==(d=x.experimental)?void 0:d.cacheLife,isRevalidate:K,waitUntil:c.waitUntil,onClose:a=>{b.on("close",a)},onAfterTaskError:void 0,onInstrumentationRequestError:(b,c,d)=>C.onRequestError(a,b,d,A)},sharedContext:{buildId:v}},P=new k.NodeNextRequest(a),Q=new k.NodeNextResponse(b),R=l.NextRequestAdapter.fromNodeNextRequest(P,(0,l.signalFromNodeResponse)(b));try{let d=async c=>C.handle(R,O).finally(()=>{if(!c)return;c.setAttributes({"http.status_code":b.statusCode,"next.rsc":!1});let d=M.getRootSpanAttributes();if(!d)return;if(d.get("next.span_type")!==m.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${d.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let e=d.get("next.route");if(e){let a=`${L} ${e}`;c.setAttributes({"next.route":e,"http.route":e,"next.span_name":a}),c.updateName(a)}else c.updateName(`${L} ${a.url}`)}),g=async g=>{var i,j;let k=async({previousCacheEntry:f})=>{try{if(!(0,h.getRequestMeta)(a,"minimalMode")&&B&&D&&!f)return b.statusCode=404,b.setHeader("x-nextjs-cache","REVALIDATED"),b.end("This page could not be found"),null;let e=await d(g);a.fetchMetrics=O.renderOpts.fetchMetrics;let i=O.renderOpts.pendingWaitUntil;i&&c.waitUntil&&(c.waitUntil(i),i=void 0);let j=O.renderOpts.collectedTags;if(!H)return await (0,o.I)(P,Q,e,O.renderOpts.pendingWaitUntil),null;{let a=await e.blob(),b=(0,p.toNodeOutgoingHttpHeaders)(e.headers);j&&(b[r.NEXT_CACHE_TAGS_HEADER]=j),!b["content-type"]&&a.type&&(b["content-type"]=a.type);let c=void 0!==O.renderOpts.collectedRevalidate&&!(O.renderOpts.collectedRevalidate>=r.INFINITE_CACHE)&&O.renderOpts.collectedRevalidate,d=void 0===O.renderOpts.collectedExpire||O.renderOpts.collectedExpire>=r.INFINITE_CACHE?void 0:O.renderOpts.collectedExpire;return{value:{kind:u.CachedRouteKind.APP_ROUTE,status:e.status,body:Buffer.from(await a.arrayBuffer()),headers:b},cacheControl:{revalidate:c,expire:d}}}}catch(b){throw(null==f?void 0:f.isStale)&&await C.onRequestError(a,b,{routerKind:"App Router",routePath:e,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:K,isOnDemandRevalidate:B})},A),b}},l=await C.handleResponse({req:a,nextConfig:x,cacheKey:I,routeKind:f.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:z,isRoutePPREnabled:!1,isOnDemandRevalidate:B,revalidateOnlyGenerated:D,responseGenerator:k,waitUntil:c.waitUntil});if(!H)return null;if((null==l||null==(i=l.value)?void 0:i.kind)!==u.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(j=l.value)?void 0:j.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});(0,h.getRequestMeta)(a,"minimalMode")||b.setHeader("x-nextjs-cache",B?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),y&&b.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let m=(0,p.fromNodeOutgoingHttpHeaders)(l.value.headers);return(0,h.getRequestMeta)(a,"minimalMode")&&H||m.delete(r.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||b.getHeader("Cache-Control")||m.get("Cache-Control")||m.set("Cache-Control",(0,q.getCacheControlHeader)(l.cacheControl)),await (0,o.I)(P,Q,new Response(l.value.body,{headers:m,status:l.value.status||200})),null};N?await g(N):await M.withPropagatedContext(a.headers,()=>M.trace(m.BaseServerSpan.handleRequest,{spanName:`${L} ${a.url}`,kind:i.SpanKind.SERVER,attributes:{"http.method":L,"http.target":a.url}},g))}catch(b){if(b instanceof s.NoFallbackError||await C.onRequestError(a,b,{routerKind:"App Router",routePath:F,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:K,isOnDemandRevalidate:B})}),H)throw b;return await (0,o.I)(P,Q,new Response(null,{status:500})),null}}},48161:a=>{a.exports=require("node:os")},55511:a=>{a.exports=require("crypto")},57075:a=>{a.exports=require("node:stream")},57975:a=>{a.exports=require("node:util")},63033:a=>{a.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},71592:(a,b,c)=>{c.d(b,{Re:()=>i,hE:()=>g,qC:()=>h});var d=c(84326),e=c(1927);function f(a){let b=a.price_minor?Math.round(Number(a.price_minor)/100):5e4,c=a.compare_at_minor?Math.round(Number(a.compare_at_minor)/100):Math.round(1.25*b),d=Math.round(b/1400),e=Math.round(c/1400),f="digital"===a.category_slug;return{id:a.id,title:a.title,brand:a.brand_name||"Generic",category:a.category_slug||"computing",categoryName:a.category_name||"General Products",priceNgn:b,oldPriceNgn:c,priceUsd:d,oldPriceUsd:e,image:a.image_url||"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85",rating:parseFloat(a.rating)||4.9,reviewsCount:parseInt(a.reviews_count,10)||120,storeName:a.vendor_name||"Official Store",type:f?"digital":"physical",deliveryEstimate:f?"Instant Digital Download / License Key":"Manga Express • Tomorrow (Kaduna/Lagos)",offerId:a.offer_id,stockLeft:parseInt(a.stock_left,10)||25}}async function g(a={}){try{await (0,e.ly)();let b=["mp.status = 'published'"],c=[],g=1;a.category&&"all"!==a.category&&"flash"!==a.category&&(b.push(`c.slug = $${g}`),c.push(a.category),g++),a.q&&a.q.trim()&&(b.push(`(
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
    `,b=await (0,d.P)(a);if(b.rows&&b.rows.length>0)return b.rows.map(a=>({id:a.id,slug:a.slug,name:a.name,icon:a.icon_url||"fa-tag",count:parseInt(a.product_count,10)||0}))}catch(a){console.warn("[DB Catalog] getDbCategories note:",a.message)}return[{id:"1",slug:"computing",name:"Phones & Computing",icon:"fa-laptop",count:8},{id:"2",slug:"electronics",name:"Electronics & Audio",icon:"fa-headphones",count:6},{id:"3",slug:"fashion",name:"Fashion & Streetwear",icon:"fa-shirt",count:5},{id:"4",slug:"home",name:"Home & Appliances",icon:"fa-couch",count:4},{id:"5",slug:"digital",name:"Software & Digital Assets",icon:"fa-code",count:3}]}},73024:a=>{a.exports=require("node:fs")},73136:a=>{a.exports=require("node:url")},76760:a=>{a.exports=require("node:path")},77030:a=>{a.exports=require("node:net")},77598:a=>{a.exports=require("node:crypto")},78474:a=>{a.exports=require("node:events")},82518:(a,b,c)=>{c.d(b,{BR:()=>i,bX:()=>h,ni:()=>j});var d=c(84326),e=c(1927),f=c(55511),g=c.n(f);async function h(a){let b=`MNG-${new Date().getFullYear()}-${Math.floor(1e5+9e5*Math.random())}`,c=a.paymentRef||`PSK-${Date.now().toString(36).toUpperCase()}`,f=new Date().toISOString();try{await (0,e.ly)();let g=`
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
    `,c=await (0,d.P)(b,[a.toLowerCase().trim()]);if(c.rows&&c.rows.length>0)return c.rows.map(a=>({orderRef:a.order_number,createdAt:a.placed_at,totalNgn:a.totals?.totalNgn||a.totals?.grandTotal||0,totalUsd:a.totals?.totalUsd||Math.round((a.totals?.totalNgn||0)/1400),paymentMethod:a.payment_method,status:a.status,items:a.items||[],shippingAddress:a.address_snapshot}))}catch(a){console.warn("[DB Orders] getDbOrdersByEmail error:",a.message)}return[]}},86439:a=>{a.exports=require("next/dist/shared/lib/no-fallback-error.external")}};var b=require("../../../webpack-runtime.js");b.C(a);var c=b.X(0,[839,415,386,605,940],()=>b(b.s=45756));module.exports=c})();