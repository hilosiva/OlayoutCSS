"use strict";const E=require("fs"),d=require("path"),A=require("postcss"),$={prefix:"ol",theme:{screens:{xxs:"375px",xs:"414px",sm:"576px",md:"768px",lg:"1024px",xl:"1280px",xxl:"1480px"},layout:{"sm-offset":"2.5vw","md-offset":"5vw","lg-offset":"10vw","xl-offset":"15vw","sm-content-width":640,"md-content-width":768,"lg-content-width":1024,"xl-content-width":1280,"xxl-content-width":1440,"sm-design-width":375,"md-design-width":768,"lg-design-width":1440,space:8},colors:{"base-color":"#fff","main-color":"#116ec5","accent-color":"#e4d558","light-color":"#efefef","dark-color":"#1c1c1c","border-color-1":"#dedede","border-color-2":"#303030","border-color-3":"#fafafa","text-color-1":"#101010","text-color-2":"#606060","text-color-3":"#f0f0f0"},typos:{"font-set-1":'-apple-system, BlinkMacSystemFont, "Yu Gothic", sans-serif',"font-set-2":'"Helvetica Neue", "Helvetica", "Arial", sans-serif',"font-set-3":'"Times New Roman", "YuMincho", "Yu Mincho", serif',"base-line-height":1.5,"base-feature-settings":'"pkna"',"base-letter-spacing":"0.05em"},effects:{"shadow-1":"0 0 8px rgba(0, 0, 0, 0.16)","shadow-2":"2px 4px 24px -1px rgba(0, 0, 0, 0.1)","shadow-3":"8px 16px 32px -4px rgba(0, 0, 0, 0.05)"},animations:{"scroll-behavior":"smooth",easing:"cubic-bezier(0.16, 1, 0.3, 1)",duration:"0.6s"}}};function F(t){if(t==="/"||t==="\\"||P(d.join(t,"olayout.config.cjs")))return t;const n=d.dirname(t);return F(n)}function P(t){try{return E.accessSync(t),!0}catch{return!1}}function R(t,n){if(typeof t!="object"||typeof n!="object")return n;const f=Object.keys(n);for(const s of f)s in t&&typeof t[s]=="object"&&typeof n[s]=="object"?t[s]=R(t[s],n[s]):t[s]=n[s];return t}const w=t=>`${t/16}rem`,D=(t,n=16)=>`${t/n}em`,S=(t,n,f=$.theme.layout["sm-design-width"],s=$.theme.layout["lg-design-width"])=>{const u=(n-t)/(s-f),x=n-s*u;return`clamp(${w(t)}, ${w(x)} + ${100*u}vw, ${w(n)})`},V=(t={})=>{const n=["layout","colors","typos","effects","animations"];return{postcssPlugin:"olayout",Once(f,{result:s}){const u=d.resolve(__dirname,"assets/css/olayout.css"),x=d.dirname(s.opts.from),I=F(x),N=d.join(I,"olayout.config.cjs"),q=P(N)?require(N):{},l=R($,q),g=new Map;try{const v=E.readFileSync(u,"utf8"),y=A.parse(v,{from:u});try{y.walkAtRules("custom-media",e=>{const r=/--ol-(\w+)/.exec(e.params);if(r){const p=r[1];if(l.theme.screens[p]){const h=`screen and (min-width: ${l.theme.screens[p]})`;e.params=`${r[0]} ${h}`,g.set(r[0],h),e.remove()}}}),y.walkRules(":root",e=>{(e.parent.type!=="atrule"||e.parent.name!=="media")&&e.walkDecls(/^--/,r=>{const p=r.prop.slice(l.prefix.length+3);n.forEach(m=>{l.theme[m][p]&&(r.value=String(l.theme[m][p]))})})})}catch(e){console.error(e.message)}const k=[];f.walkAtRules(e=>{(e.name==="charset"||e.name==="import"&&e.params.includes("//")||e.name==="font-face")&&(k.push(e),e.remove())}),f.prepend(y),k.reverse().forEach(e=>{f.prepend(e)}),f.walkAtRules("media",e=>{const r=e.params.trim().replace(/[()]/g,"");g.has(r)&&(e.params=g.get(r))}),f.walkDecls(e=>{const r=/fluid\(([^)]+)\)/.exec(e.value);if(r){const[c,a,o,i]=r[1].replace(/\s/g,"").split(",").map(b=>{if(b==="")return;const M=parseFloat(b);if(isNaN(M))throw new Error(`Invalid argument '${b}' in fluid() function.`);return M});e.value=S(c,a,o||l.theme.layout["sm-design-width"],i||l.theme.layout["lg-design-width"])}const p=/em\(([^)]+)\)/.exec(e.value);if(p){const[c,a]=p[1].replace(/\s/g,"").split(",").map(o=>{if(o==="")return;const i=parseFloat(o);if(isNaN(i))throw new Error(`Invalid argument '${o}' in em() function.`);return i});e.value=D(c,a||16)}const m=/rem\(([^)]+)\)/.exec(e.value);if(m){const c=parseFloat(m[1]);if(isNaN(c))throw new Error(`Invalid argument '${m[1]}' in rem() function.`);e.value=w(c)}const h=/vw\(([^)]+)\)/.exec(e.value);if(h){const[c,a]=h[1].replace(/\s/g,"").split(",").map(o=>{if(o==="")return;const i=parseFloat(o);if(isNaN(i))throw new Error(`Invalid argument '${o}' in vw() function.`);return i});e.value=`calc(${c} / ${a||`var(--${l.prefix}-view-point)`} * 100vw)`}const j=/vh\(([^)]+)\)/.exec(e.value);if(j){const[c,a]=j[1].replace(/\s/g,"").split(",").map(o=>{if(o==="")return;const i=parseFloat(o);if(isNaN(i))throw new Error(`Invalid argument '${o}' in vh() function.`);return i});e.value=`calc(${c} / ${a||`var(--${l.prefix}-view-point)`} * 100vh)`}})}catch(v){console.error(v.message);return}}}};V.postcss=!0;module.exports=V;
