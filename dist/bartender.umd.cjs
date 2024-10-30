(function(a,s){typeof exports=="object"&&typeof module<"u"?s(exports):typeof define=="function"&&define.amd?define(["exports"],s):(a=typeof globalThis<"u"?globalThis:a||self,s(a.Bartender={}))})(this,function(a){"use strict";class s extends Error{constructor(e){super(e),this.name="Bartender error"}}const h=i=>Object.entries(i).reduce((e,[r,t])=>(typeof t>"u"||(e[r]=t),e),{}),u=(i,e=document)=>i instanceof Element?i:typeof i=="string"?e.querySelector(i):null,l=(i=100)=>new Promise(e=>i?setTimeout(e,i):e());class o{debug=!1;initialized=!1;_name="";el;_position="left";_modal=!0;_overlay=!0;_permanent=!1;_scrollTop=!0;isOpened=!1;onCloseHandler;onClickHandler;constructor(e,r={}){if(!e)throw new s("Bar name is required");this.name=e;const t=u(r.el||null);if(!t)throw new s(`Element for bar '${this.name}' is required`);if(t.tagName!=="DIALOG")throw new s(`Bar element for '${this.name}' must be a <dialog> element`);this.el=t,this.el.classList.add("bartender-bar","bartender-bar--closed"),this.position=r.position??this._position,this.modal=r.modal??this._modal,this.overlay=r.overlay??this._overlay,this.permanent=r.permanent??this._permanent,this.scrollTop=r.scrollTop??this._scrollTop,this.onCloseHandler=async n=>{this.debug&&console.debug("Closing bar",this),this.el.dispatchEvent(new CustomEvent("bartender-bar-before-close",{bubbles:!0,detail:{bar:this}})),this.el.classList.remove("bartender-bar--open"),this.isOpened=!1,await l(this.getTransitionDuration()),this.el.classList.add("bartender-bar--closed"),this.el.dispatchEvent(new CustomEvent("bartender-bar-after-close",{bubbles:!0,detail:{bar:this}})),this.debug&&console.debug("Finished closing bar",this)},this.onClickHandler=n=>{const d=this.el.getBoundingClientRect();this.permanent===!1&&(d.left>n.clientX||d.right<n.clientX||d.top>n.clientY||d.bottom<n.clientY)&&(n.stopPropagation(),this.el.dispatchEvent(new CustomEvent("bartender-bar-backdrop-click",{bubbles:!0,detail:{bar:this}})))},this.el.addEventListener("close",this.onCloseHandler),this.el.addEventListener("click",this.onClickHandler),this.initialized=!0}destroy(){return this.el.classList.remove("bartender-bar",`bartender-bar--position-${this.position}`),this.el.removeEventListener("close",this.onCloseHandler),this.el.removeEventListener("click",this.onClickHandler),this}get name(){return this._name}set name(e){this._name=e,this.initialized!==!1&&(this.el.dispatchEvent(new CustomEvent("bartender-bar-updated",{bubbles:!0,detail:{bar:this,property:"name",value:e}})),this.debug&&console.debug("Updated bar name",this))}get position(){return this._position}set position(e){if(!e)throw new s(`Position is required for bar '${this.name}'`);const r=["left","right","top","bottom"];if(!r.includes(e))throw new s(`Invalid position '${e}' for bar '${this.name}'. Use one of the following: ${r.join(", ")}.`);this.el.classList.remove(`bartender-bar--position-${this._position}`),this.el.classList.add(`bartender-bar--position-${e}`),this._position=e,this.initialized!==!1&&(this.el.dispatchEvent(new CustomEvent("bartender-bar-updated",{bubbles:!0,detail:{bar:this,property:"position",value:e}})),this.debug&&console.debug("Updated bar position",this))}get modal(){return this._modal}set modal(e){this._modal=e,this.initialized!==!1&&(this.el.dispatchEvent(new CustomEvent("bartender-bar-updated",{bubbles:!0,detail:{bar:this,property:"modal",value:e}})),this.debug&&console.debug("Updated bar modal setting",this))}get overlay(){return this._overlay}set overlay(e){this._overlay=e,e===!0?this.el.classList.add("bartender-bar--has-overlay"):this.el.classList.remove("bartender-bar--has-overlay"),this.initialized!==!1&&(this.el.dispatchEvent(new CustomEvent("bartender-bar-updated",{bubbles:!0,detail:{bar:this,property:"overlay",value:e}})),this.debug&&console.debug("Updated bar overlay",this))}get permanent(){return this._permanent}set permanent(e){this._permanent=e,this.initialized!==!1&&(this.el.dispatchEvent(new CustomEvent("bartender-bar-updated",{bubbles:!0,detail:{bar:this,property:"permanent",value:e}})),this.debug&&console.debug("Updated bar permanence",this))}get scrollTop(){return this._scrollTop}set scrollTop(e){this._scrollTop=e,this.initialized!==!1&&(this.el.dispatchEvent(new CustomEvent("bartender-bar-updated",{bubbles:!0,detail:{bar:this,property:"scrollTop",value:e}})),this.debug&&console.debug("Updated bar scrollTop",this))}isOpen(){return this.isOpened}async open(){return this.el.dispatchEvent(new CustomEvent("bartender-bar-before-open",{bubbles:!0,detail:{bar:this}})),this.debug&&console.debug("Opening bar",this),this.modal===!0?this.el.showModal():this.el.show(),this.scrollTop===!0&&this.scrollToTop(),this.el.classList.remove("bartender-bar--closed"),this.el.classList.add("bartender-bar--open"),this.isOpened=!0,await l(this.getTransitionDuration()),this.debug&&console.debug("Finished opening bar",this),this.el.dispatchEvent(new CustomEvent("bartender-bar-after-open",{bubbles:!0,detail:{bar:this}})),this}async close(){return this.el.close(),await l(this.getTransitionDuration()),this}scrollToTop(){return this.el.scrollTo(0,0),this}getTransitionDuration(){return parseFloat(window.getComputedStyle(this.el).transitionDuration||"0")*1e3}}class b{_debug=!1;bars=[];openBars=[];barDefaultOptions={el:null,position:"left",overlay:!0,permanent:!1,scrollTop:!0};onKeydownHandler;onBarBeforeOpenHandler;onBarBeforeCloseHandler;onBarBackdropClickHandler;constructor(e={},r={}){this.debug=e.debug??this._debug,this.barDefaultOptions={...this.barDefaultOptions,...r},this.onKeydownHandler=(t=>{if(t.key==="Escape"&&this.getOpenBar(!0)?.permanent===!0){t.preventDefault();return}}).bind(this),this.onBarBeforeOpenHandler=t=>{this.openBars.push(t.detail.bar),this.openBars.some(n=>n.modal===!0)&&document.body.classList.add("bartender-disable-scroll"),document.body.classList.add("bartender-open")},this.onBarBeforeCloseHandler=t=>{this.openBars.splice(this.openBars.indexOf(t.detail.bar),1),this.openBars.length||document.body.classList.remove("bartender-open"),this.openBars.some(n=>n.modal===!0)||document.body.classList.remove("bartender-disable-scroll")},this.onBarBackdropClickHandler=t=>{this.getOpenBar(!0)?.name===t.detail.bar.name&&this.close(t.detail.bar.name)},document.addEventListener("keydown",this.onKeydownHandler),document.addEventListener("bartender-bar-before-open",this.onBarBeforeOpenHandler),document.addEventListener("bartender-bar-before-close",this.onBarBeforeCloseHandler),document.addEventListener("bartender-bar-backdrop-click",this.onBarBackdropClickHandler),document.body.classList.add("bartender-ready"),window.dispatchEvent(new CustomEvent("bartender-init",{detail:{bartender:this}})),this.debug&&console.debug("Bartender initialized",this)}get debug(){return this._debug}set debug(e){this._debug=e;for(const r of this.bars)r.debug=e}getBar(e){return this.bars.find(r=>r.name===e)||null}getOpenBar(e=void 0){const r=typeof e=="boolean"?this.openBars.filter(t=>t.modal===e):this.openBars;return r.length?r[r.length-1]:null}addBar(e,r={}){if(!e)throw new s("Bar name is required");if(this.getBar(e))throw new s(`Bar with name '${e}' is already defined`);const t=new o(e,{...this.barDefaultOptions,...h(r)});if(t.debug=this.debug,this.bars.some(n=>n.el===t.el))throw new s(`Element of bar '${t.name}' is already being used for another bar`);return this.bars.push(t),window.dispatchEvent(new CustomEvent("bartender-bar-added",{detail:{bar:t}})),this.debug&&console.debug("Added a new bar",t),t}removeBar(e){if(!e)throw new s("Bar name is required");const r=this.getBar(e);if(!r)throw new s(`Bar with name '${e}' was not found`);return r.isOpen()===!0&&this.close(e),r.destroy(),this.bars.splice(this.bars.findIndex(t=>t.name===e),1),window.dispatchEvent(new CustomEvent("bartender-bar-removed",{detail:{name:e}})),this.debug&&console.debug(`Removed bar '${e}'`),this}async open(e,r=!1){const t=e instanceof o?e:typeof e=="string"?this.getBar(e):null;if(!t)throw new s(`Unknown bar '${e}'`);return t.isOpen()===!0||(r===!1&&this.closeAll(),await t.open()),t}async close(e){const r=e?e instanceof o?e:typeof e=="string"?this.getBar(e):null:this.getOpenBar();return!r||!r.isOpen()?null:(await r.close(),r)}async closeAll(e=!1){const r=this.openBars.reduce((t,n)=>(e===!1&&n.modal===!1||t.push(n.name),t),[]);return await Promise.all(r.map(t=>this.close(t))),this}async toggle(e,r=!1){const t=e instanceof o?e:typeof e=="string"?this.getBar(e):null;if(!t)throw new s(`Unknown bar '${e}'`);return t.isOpen()===!0?await this.close(t):await this.open(t,r)}destroy(){this.closeAll();const e=this.bars.flatMap(r=>r.name);for(const r of e)this.getBar(r)&&this.removeBar(r);return document.body.classList.remove("bartender","bartender-ready"),document.removeEventListener("keydown",this.onKeydownHandler),document.removeEventListener("bartender-bar-before-open",this.onBarBeforeOpenHandler),document.removeEventListener("bartender-bar-before-close",this.onBarBeforeCloseHandler),document.removeEventListener("bartender-bar-backdrop-click",this.onBarBackdropClickHandler),window.dispatchEvent(new CustomEvent("bartender-destroyed",{detail:{bartender:this}})),this.debug&&console.debug("Bartender destroyed",this),this}}a.Bartender=b,a.BartenderBar=o,Object.defineProperty(a,Symbol.toStringTag,{value:"Module"})});
//# sourceMappingURL=bartender.umd.cjs.map
