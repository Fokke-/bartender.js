(function(n,r){typeof exports=="object"&&typeof module!="undefined"?r(exports,require("async-await-queue"),require("ts-debounce")):typeof define=="function"&&define.amd?define(["exports","async-await-queue","ts-debounce"],r):(n=typeof globalThis!="undefined"?globalThis:n||self,r(n.Bartender={},n.asyncAwaitQueue,n.tsDebounce))})(this,function(n,r,a){"use strict";var L=Object.defineProperty;var B=Object.getOwnPropertySymbols;var P=Object.prototype.hasOwnProperty,T=Object.prototype.propertyIsEnumerable;var y=(n,r,a)=>r in n?L(n,r,{enumerable:!0,configurable:!0,writable:!0,value:a}):n[r]=a,v=(n,r)=>{for(var a in r||(r={}))P.call(r,a)&&y(n,a,r[a]);if(B)for(var a of B(r))T.call(r,a)&&y(n,a,r[a]);return n};var i=(n,r,a)=>(y(n,typeof r!="symbol"?r+"":r,a),a);var d=(n,r,a)=>new Promise((E,c)=>{var m=u=>{try{f(a.next(u))}catch(p){c(p)}},o=u=>{try{f(a.throw(u))}catch(p){c(p)}},f=u=>u.done?E(u.value):Promise.resolve(u.value).then(m,o);f((a=a.apply(n,r)).next())});const E="",c=l=>l?typeof l=="string"?document.querySelector(l):l instanceof Element?l:null:null,m=(l=100)=>new Promise(e=>l?setTimeout(e,l):e());class o extends Error{constructor(e){super(e),this.name="Bartender error"}}class f{constructor(e,t=!0){i(this,"_name","");i(this,"_enabled",!0);i(this,"el");this.el=document.createElement("div"),this.el.classList.add("bartender__overlay"),this.name=e,this.enabled=t}destroy(){return this.el.remove(),this}get name(){return this._name}set name(e){this.el.classList.remove(`bartender__overlay--${this._name}`),this.el.classList.add(`bartender__overlay--${e}`),this._name=e}get enabled(){return this._enabled}set enabled(e){e===!0?this.el.classList.remove("bartender__overlay--transparent"):this.el.classList.add("bartender__overlay--transparent"),this._enabled=e}show(){return this.el.classList.add("bartender__overlay--visible"),this}hide(){return this.el.classList.remove("bartender__overlay--visible"),this}}class u{constructor(e,t={}){i(this,"ready",!1);i(this,"overlayObj");i(this,"_name","");i(this,"el");i(this,"_position","left");i(this,"_mode","float");i(this,"_overlay",!0);i(this,"permanent",!1);i(this,"scrollTop",!0);i(this,"isOpened",!1);var h,b,w,g,_;if(!e)throw"Bar name is required";this.overlayObj=new f(e,this.overlay),this.name=e;const s=c(t.el||null);if(!s)throw new o(`Content element for bar '${this.name}' is required`);this.el=s,this.el.classList.add("bartender__bar"),this.position=(h=t.position)!=null?h:this.position,this.mode=(b=t.mode)!=null?b:this._mode,this.overlay=(w=t.overlay)!=null?w:this._overlay,this.permanent=(g=t.permanent)!=null?g:this.permanent,this.scrollTop=(_=t.scrollTop)!=null?_:this.scrollTop,this.ready=!0}destroy(e=!1){return e===!0&&this.el.remove(),this.overlayObj.destroy(),this}get name(){return this._name}set name(e){this._name=e,this.overlayObj.name=e}get position(){return this._position}set position(e){if(!e)throw`Position is required for bar '${this.name}'`;const t=["left","right","top","bottom"];if(!t.includes(e))throw`Invalid position '${e}' for bar '${this.name}'. Use one of the following: ${t.join(", ")}.`;this.el&&(this.el.style.transition="none"),this.el.classList.remove(`bartender__bar--${this.position}`),this.el.classList.add(`bartender__bar--${e}`),this._position=e,setTimeout(()=>{this.el&&(this.el.style.transition="")}),this.ready===!0&&window.dispatchEvent(new Event("resize"))}get mode(){return this._mode}set mode(e){if(!e)throw`Mode is required for bar '${this.name}'`;const t=["float","push","reveal"];if(!t.includes(e))throw`Invalid mode '${e}' for bar '${this.name}'. Use one of the following: ${t.join(", ")}.`;this.el.classList.remove(`bartender__bar--${this.mode}`),this.el.classList.add(`bartender__bar--${e}`),this._mode=e,this.ready===!0&&window.dispatchEvent(new Event("resize"))}get overlay(){return this._overlay}set overlay(e){this.overlayObj.enabled=e,this._overlay=e}isOpen(){return this.isOpened}getTransitionDuration(){if(!this.el)return 0;const e=window.getComputedStyle(this.el).getPropertyValue("transition-duration")||"0s";return parseFloat(e)*1e3}open(){return d(this,null,function*(){return this.el.dispatchEvent(new CustomEvent("bartender-bar-before-open",{bubbles:!0,detail:{bar:this}})),this.scrollTop===!0&&this.el.scrollTo(0,0),this.el.classList.add("bartender__bar--open"),this.overlayObj.show(),this.isOpened=!0,yield m(this.getTransitionDuration()),this.el.dispatchEvent(new CustomEvent("bartender-bar-after-open",{bubbles:!0,detail:{bar:this}})),Promise.resolve(this)})}close(){return d(this,null,function*(){return this.el.dispatchEvent(new CustomEvent("bartender-bar-before-close",{bubbles:!0,detail:{bar:this}})),this.el.classList.remove("bartender__bar--open"),this.overlayObj.hide(),this.isOpened=!1,yield m(this.getTransitionDuration()),this.el.dispatchEvent(new CustomEvent("bartender-bar-after-close",{bubbles:!0,detail:{bar:this}})),Promise.resolve(this)})}getPushStyles(){return!this.position||!this.el?{transform:"",transitionDuration:"",transitionTimingFunction:""}:{transform:{left:`translateX(${this.el.offsetWidth}px)`,right:`translateX(-${this.el.offsetWidth}px)`,top:`translateY(${this.el.offsetHeight}px)`,bottom:`translateY(-${this.el.offsetHeight}px)`}[this.position]||"",transitionDuration:window.getComputedStyle(this.el).getPropertyValue("transition-duration")||"",transitionTimingFunction:window.getComputedStyle(this.el).getPropertyValue("transition-timing-function")||""}}}class p{constructor(e={}){i(this,"el");i(this,"bars");i(this,"modes");i(this,"isPushed",!1);const t=c(e.el||null);if(!t)throw new o("Element is required for push element");this.el=t,this.bars=e.bars||[],this.modes=e.modes||[]}push(e,t){return this.bars.length&&!this.bars.includes(e)||this.modes.length&&!this.modes.includes(e.mode)?(this.el.style.transform="",this.el.style.transitionTimingFunction="",this.el.style.transitionDuration="",this.isPushed=!1,this):(this.el.style.transform=t.transform,this.el.style.transitionTimingFunction=t.transitionTimingFunction,this.el.style.transitionDuration=t.transitionDuration,this.isPushed=!0,this)}pull(){return this.isPushed===!1?this:(this.el.style.transform="translateX(0) translateY(0)",this)}}class O{constructor(e={},t={}){i(this,"queue");i(this,"resizeDebounce");i(this,"debug",!1);i(this,"el");i(this,"contentEl");i(this,"switchTimeout",150);i(this,"bars",[]);i(this,"pushableElements",[]);i(this,"barDefaultOptions",{el:null,position:"left",mode:"float",overlay:!0,permanent:!1,scrollTop:!0});i(this,"onKeydownHandler");i(this,"onResizeHandler");var b,w;this.debug=(b=e.debug)!=null?b:this.debug,this.switchTimeout=(w=e.switchTimeout)!=null?w:this.switchTimeout,this.barDefaultOptions=Object.assign(this.barDefaultOptions,t);const s=c(e.el||".bartender");if(!s)throw new o("Main element is required");this.el=s,this.el.classList.add("bartender");const h=c(e.contentEl||".bartender__content");if(!h)throw new o("Content element is required");if(h.parentElement!==this.el)throw new o("Content element must be a direct child of the main element");this.contentEl=h,this.contentEl.classList.add("bartender__content"),this.addPushElement({el:this.contentEl,modes:["push","reveal"]}),this.queue=new r.Queue(1),this.resizeDebounce=a.debounce(()=>{this.pushElements(this.getOpenBar())},100),this.onKeydownHandler=this.onKeydown.bind(this),window.addEventListener("keydown",this.onKeydownHandler),this.onResizeHandler=this.onResize.bind(this),window.addEventListener("resize",this.onResizeHandler),this.el.classList.add("bartender--ready"),this.el.dispatchEvent(new CustomEvent("bartender-init",{bubbles:!0,detail:{bartender:this}}))}destroy(e=!1){return d(this,null,function*(){const t=this.bars.reduce((s,h)=>(s.push(h.name),s),[]);for(const s of t)this.getBar(s)&&(yield this.removeBar(s,e));return this.el.classList.remove("bartender","bartender--ready"),this.contentEl.classList.remove("bartender__content"),window.removeEventListener("keydown",this.onKeydownHandler),window.removeEventListener("resize",this.onResizeHandler),this.el.dispatchEvent(new CustomEvent("bartender-destroyed",{bubbles:!0,detail:{bartender:this}})),Promise.resolve(this)})}getBar(e){return this.bars.find(t=>t.name===e)||null}getOpenBar(){return this.bars.find(e=>e.isOpen()===!0)||null}addBar(e,t={}){var h;if(!e||typeof e!="string")throw new o("Bar name is required");if(this.getBar(e))throw new o(`Bar with name '${e}' is already defined`);const s=new u(e,v(v({},this.barDefaultOptions),t));if(s.el.parentElement!==this.el)throw new o(`Element of bar '${s.name}' must be a direct child of the Bartender main element`);return(h=this.contentEl)==null||h.appendChild(s.overlayObj.el),s.overlayObj.el.addEventListener("click",()=>{s.permanent!==!0&&this.close()}),this.bars.push(s),this.el.dispatchEvent(new CustomEvent("bartender-bar-added",{bubbles:!0,detail:{bar:s}})),s}removeBar(e,t=!1){return d(this,null,function*(){if(!e||typeof e!="string")throw new o("Bar name is required");const s=this.getBar(e);if(!s)throw new o(`Bar with name '${e}' was not found`);this.getOpenBar()===s&&(yield this.close()),s.destroy(t);const h=this.bars.findIndex(b=>b.name===e);return this.bars.splice(h,1),this.el.dispatchEvent(new CustomEvent("bartender-bar-removed",{bubbles:!0,detail:{name:e}})),Promise.resolve(this)})}openBar(e){return d(this,null,function*(){const t=this.getBar(e);if(!t)return Promise.reject(new o(`Unknown bar '${e}'`));if(t.isOpen()===!0)return Promise.resolve(t);const s=this.getOpenBar();return s&&(yield this.closeBar(s.name,!1),yield m(this.switchTimeout)),this.el.classList.add("bartender--open"),this.pushElements(t),t.open()})}open(e){return d(this,null,function*(){const t=Symbol();return yield this.queue.wait(t),this.openBar(e).finally(()=>{this.queue.end(t)})})}closeBar(e,t=!0){return d(this,null,function*(){const s=e?this.getBar(e):this.getOpenBar();return!s||!s.isOpen()?Promise.resolve(null):(this.pullElements(),yield s.close(),t===!0&&this.el.classList.remove("bartender--open"),Promise.resolve(s))})}close(e){return d(this,null,function*(){const t=Symbol();return yield this.queue.wait(t),this.closeBar(e).finally(()=>{this.queue.end(t)})})}toggle(e){return d(this,null,function*(){const t=this.getBar(e);return t?t.isOpen()===!0?this.close():this.open(e):Promise.reject(new o(`Unknown bar '${e}'`))})}addPushElement(e={}){const t=new p(e);return this.pushableElements.push(t),t}pushElements(e){if(!e||!this.pushableElements.length)return this.pushableElements;const t=e.getPushStyles();for(const s of this.pushableElements)s.push(e,t);return this.pushableElements}pullElements(){this.pushableElements.length||this.pushableElements;for(const e of this.pushableElements)e.pull();return this.pushableElements}onKeydown(e){if(e.key==="Escape"){const t=this.getOpenBar();if(!t||t.permanent===!0)return;this.close()}}onResize(){this.resizeDebounce()}}n.Bartender=O,Object.defineProperty(n,Symbol.toStringTag,{value:"Module"})});
