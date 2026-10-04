const V="heures-v5";
const PRE=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png","./icon-maskable-512.png"];
const PDFLIB="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
self.addEventListener("install",e=>{
  e.waitUntil(caches.open(V).then(async c=>{
    await c.addAll(PRE);
    try{await c.add(new Request(PDFLIB,{mode:"no-cors"}))}catch(x){}
  }));
  self.skipWaiting();
});
self.addEventListener("activate",e=>{
  e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));
});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request).then(res=>{
    if(res&&(res.ok||res.type==="opaque")){const cp=res.clone();caches.open(V).then(c=>c.put(e.request,cp))}
    return res;
  }).catch(()=>caches.match("./index.html"))));
});
