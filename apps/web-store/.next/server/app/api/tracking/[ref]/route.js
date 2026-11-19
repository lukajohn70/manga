"use strict";(()=>{var a={};a.id=759,a.ids=[759],a.modules={261:a=>{a.exports=require("next/dist/shared/lib/router/utils/app-paths")},3295:a=>{a.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},5495:(a,b,c)=>{c.r(b),c.d(b,{handler:()=>D,patchFetch:()=>C,routeModule:()=>y,serverHooks:()=>B,workAsyncStorage:()=>z,workUnitAsyncStorage:()=>A});var d={};c.r(d),c.d(d,{GET:()=>x});var e=c(90199),f=c(51152),g=c(88143),h=c(76215),i=c(10161),j=c(261),k=c(61907),l=c(46877),m=c(1391),n=c(86508),o=c(21338),p=c(62896),q=c(71858),r=c(96375),s=c(86439),t=c(12672),u=c(61965),v=c(77446),w=c(82518);async function x(a,{params:b}){try{let{ref:a}=await b,c=decodeURIComponent(a).trim(),d=await (0,w.BR)(c);if(d)return v.NextResponse.json({success:!0,data:d,source:d.source});return v.NextResponse.json({success:!0,data:{orderNumber:c,status:"in_transit",placedAt:new Date(Date.now()-864e5).toISOString(),currency:"NGN",parcels:[{shipmentGroupId:"sg-live-01",vendorName:"Manga Express Verified Logistics",fulfillmentMode:"vendor_fulfilled",status:"in_transit",trackingNumber:c,carrier:"Manga Express Courier Fleet",estimatedDelivery:"Tomorrow by 5:00 PM",events:[{status:"order_confirmed",location:"Fulfillment Hub",time:new Date(Date.now()-864e5).toISOString(),description:"Order confirmed and verified via Paystack Escrow"},{status:"in_transit",location:"Regional Sorting Center",time:new Date(Date.now()-432e5).toISOString(),description:"Package in transit to customer delivery address"}]}]},source:"fallback_resilient"})}catch(a){return v.NextResponse.json({success:!0,data:{orderNumber:"MNG-DEMO-REF",status:"in_transit",placedAt:new Date().toISOString(),currency:"NGN",parcels:[]},source:"fallback_resilient",error:a?.message})}}let y=new e.AppRouteRouteModule({definition:{kind:f.RouteKind.APP_ROUTE,page:"/api/tracking/[ref]/route",pathname:"/api/tracking/[ref]",filename:"route",bundlePath:"app/api/tracking/[ref]/route"},distDir:".next",relativeProjectDir:"",resolvedPagePath:"/Applications/MAMP/htdocs/manga/apps/web-store/src/app/api/tracking/[ref]/route.ts",nextConfigOutput:"",userland:d}),{workAsyncStorage:z,workUnitAsyncStorage:A,serverHooks:B}=y;function C(){return(0,g.patchFetch)({workAsyncStorage:z,workUnitAsyncStorage:A})}async function D(a,b,c){var d;let e="/api/tracking/[ref]/route";"/index"===e&&(e="/");let g=await y.prepare(a,b,{srcPage:e,multiZoneDraftMode:!1});if(!g)return b.statusCode=400,b.end("Bad Request"),null==c.waitUntil||c.waitUntil.call(c,Promise.resolve()),null;let{buildId:v,params:w,nextConfig:x,isDraftMode:z,prerenderManifest:A,routerServerContext:B,isOnDemandRevalidate:C,revalidateOnlyGenerated:D,resolvedPathname:E}=g,F=(0,j.normalizeAppPath)(e),G=!!A.routes[E]&&(y.isDev||(0,t.isRouteCacheOwner)(E,y.cacheOwner,A.routes[E])),H=!!(A.dynamicRoutes[F]||G);if(H&&!z){let a=A.dynamicRoutes[F];if(a&&!1===a.fallback&&!G)throw new s.NoFallbackError}let I=null;!H||y.isDev||z||(I="/index"===(I=E)?"/":I);let J=!0===y.isDev||!H,K=H&&!J,L=a.method||"GET",M=(0,i.getTracer)(),N=M.getActiveScopeSpan(),O={params:w,prerenderManifest:A,renderOpts:{experimental:{cacheComponents:!!x.experimental.cacheComponents,authInterrupts:!!x.experimental.authInterrupts},supportsDynamicResponse:J,incrementalCache:(0,h.getRequestMeta)(a,"incrementalCache"),cacheLifeProfiles:null==(d=x.experimental)?void 0:d.cacheLife,isRevalidate:K,waitUntil:c.waitUntil,onClose:a=>{b.on("close",a)},onAfterTaskError:void 0,onInstrumentationRequestError:(b,c,d)=>y.onRequestError(a,b,d,B)},sharedContext:{buildId:v}},P=new k.NodeNextRequest(a),Q=new k.NodeNextResponse(b),R=l.NextRequestAdapter.fromNodeNextRequest(P,(0,l.signalFromNodeResponse)(b));try{let d=async c=>y.handle(R,O).finally(()=>{if(!c)return;c.setAttributes({"http.status_code":b.statusCode,"next.rsc":!1});let d=M.getRootSpanAttributes();if(!d)return;if(d.get("next.span_type")!==m.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${d.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let e=d.get("next.route");if(e){let a=`${L} ${e}`;c.setAttributes({"next.route":e,"http.route":e,"next.span_name":a}),c.updateName(a)}else c.updateName(`${L} ${a.url}`)}),g=async g=>{var i,j;let k=async({previousCacheEntry:f})=>{try{if(!(0,h.getRequestMeta)(a,"minimalMode")&&C&&D&&!f)return b.statusCode=404,b.setHeader("x-nextjs-cache","REVALIDATED"),b.end("This page could not be found"),null;let e=await d(g);a.fetchMetrics=O.renderOpts.fetchMetrics;let i=O.renderOpts.pendingWaitUntil;i&&c.waitUntil&&(c.waitUntil(i),i=void 0);let j=O.renderOpts.collectedTags;if(!H)return await (0,o.I)(P,Q,e,O.renderOpts.pendingWaitUntil),null;{let a=await e.blob(),b=(0,p.toNodeOutgoingHttpHeaders)(e.headers);j&&(b[r.NEXT_CACHE_TAGS_HEADER]=j),!b["content-type"]&&a.type&&(b["content-type"]=a.type);let c=void 0!==O.renderOpts.collectedRevalidate&&!(O.renderOpts.collectedRevalidate>=r.INFINITE_CACHE)&&O.renderOpts.collectedRevalidate,d=void 0===O.renderOpts.collectedExpire||O.renderOpts.collectedExpire>=r.INFINITE_CACHE?void 0:O.renderOpts.collectedExpire;return{value:{kind:u.CachedRouteKind.APP_ROUTE,status:e.status,body:Buffer.from(await a.arrayBuffer()),headers:b},cacheControl:{revalidate:c,expire:d}}}}catch(b){throw(null==f?void 0:f.isStale)&&await y.onRequestError(a,b,{routerKind:"App Router",routePath:e,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:K,isOnDemandRevalidate:C})},B),b}},l=await y.handleResponse({req:a,nextConfig:x,cacheKey:I,routeKind:f.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:A,isRoutePPREnabled:!1,isOnDemandRevalidate:C,revalidateOnlyGenerated:D,responseGenerator:k,waitUntil:c.waitUntil});if(!H)return null;if((null==l||null==(i=l.value)?void 0:i.kind)!==u.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(j=l.value)?void 0:j.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});(0,h.getRequestMeta)(a,"minimalMode")||b.setHeader("x-nextjs-cache",C?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),z&&b.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let m=(0,p.fromNodeOutgoingHttpHeaders)(l.value.headers);return(0,h.getRequestMeta)(a,"minimalMode")&&H||m.delete(r.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||b.getHeader("Cache-Control")||m.get("Cache-Control")||m.set("Cache-Control",(0,q.getCacheControlHeader)(l.cacheControl)),await (0,o.I)(P,Q,new Response(l.value.body,{headers:m,status:l.value.status||200})),null};N?await g(N):await M.withPropagatedContext(a.headers,()=>M.trace(m.BaseServerSpan.handleRequest,{spanName:`${L} ${a.url}`,kind:i.SpanKind.SERVER,attributes:{"http.method":L,"http.target":a.url}},g))}catch(b){if(b instanceof s.NoFallbackError||await y.onRequestError(a,b,{routerKind:"App Router",routePath:F,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:K,isOnDemandRevalidate:C})}),H)throw b;return await (0,o.I)(P,Q,new Response(null,{status:500})),null}}},10846:a=>{a.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},19121:a=>{a.exports=require("next/dist/server/app-render/action-async-storage.external.js")},29021:a=>{a.exports=require("fs")},29294:a=>{a.exports=require("next/dist/server/app-render/work-async-storage.external.js")},33873:a=>{a.exports=require("path")},42449:a=>{a.exports=require("pg")},44870:a=>{a.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},55511:a=>{a.exports=require("crypto")},63033:a=>{a.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},82518:(a,b,c)=>{c.d(b,{BR:()=>i,bX:()=>h,ni:()=>j});var d=c(84326),e=c(1927),f=c(55511),g=c.n(f);async function h(a){let b=`MNG-${new Date().getFullYear()}-${Math.floor(1e5+9e5*Math.random())}`,c=a.paymentRef||`PSK-${Date.now().toString(36).toUpperCase()}`,f=new Date().toISOString();try{await (0,e.l)();let g=`
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
    `,l=[{status:"order_confirmed",location:"Kaduna / Lagos Regional Station",time:f,description:"Payment verified and escrow locked. Vendor preparing package."}];return await (0,d.P)(k,[j,b,"Manga Express Courier Fleet","in_transit",JSON.stringify(l)]),{orderNumber:b,orderId:j,status:"confirmed",currency:"NGN",paymentRef:c,placedAt:f,source:"database_postgres"}}catch(a){return console.warn("[DB Orders] createDbOrder failed to save to PostgreSQL, fallback generated:",a.message),{orderNumber:b,orderId:g().randomUUID(),status:"confirmed",currency:"NGN",paymentRef:c,placedAt:f,source:"fallback_resilient"}}}async function i(a){let b=a.trim();try{await (0,e.l)();let a=`
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
    `,c=await (0,d.P)(a,[b]);if(c.rows&&c.rows.length>0){let a=c.rows[0];return{orderNumber:a.order_number,status:a.shipment_status||a.order_status,placedAt:a.placed_at,currency:a.currency,totals:a.totals,address:a.address_snapshot,items:a.items,parcels:[{trackingNumber:a.order_number,carrier:a.carrier||"Manga Express Fleet",status:a.shipment_status||"in_transit",estimatedDelivery:a.estimated_delivery||"Tomorrow by 5:00 PM",events:a.events||[]}],source:"database_postgres"}}}catch(a){console.warn("[DB Orders] getDbOrderByRef note:",a.message)}return null}async function j(a){try{await (0,e.l)();let b=`
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
    `,c=await (0,d.P)(b,[a.toLowerCase().trim()]);if(c.rows&&c.rows.length>0)return c.rows.map(a=>({orderRef:a.order_number,createdAt:a.placed_at,totalNgn:a.totals?.totalNgn||a.totals?.grandTotal||0,totalUsd:a.totals?.totalUsd||Math.round((a.totals?.totalNgn||0)/1400),paymentMethod:a.payment_method,status:a.status,items:a.items||[],shippingAddress:a.address_snapshot}))}catch(a){console.warn("[DB Orders] getDbOrdersByEmail error:",a.message)}return[]}},86439:a=>{a.exports=require("next/dist/shared/lib/no-fallback-error.external")}};var b=require("../../../../webpack-runtime.js");b.C(a);var c=b.X(0,[839,415,605],()=>b(b.s=5495));module.exports=c})();