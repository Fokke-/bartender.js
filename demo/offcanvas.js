"use strict";function _extends(){return(_extends=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(t[i]=n[i])}return t}).apply(this,arguments)}function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _defineProperties(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}function _createClass(t,e,n){return e&&_defineProperties(t.prototype,e),n&&_defineProperties(t,n),t}var OffCanvas=function(){function t(e){_classCallCheck(this,t),this.options=_extends({debug:!1,overlay:!0,closeOnEsc:!0,mainWrapSelector:".offcanvas-main",contentWrapSelector:".offcanvas-content"},e),this.overlay=null,this.currentOpenBar=null,this.previousOpenButton=null,this.resizeTimeout=null,this.bars={left:null,right:null,top:null,bottom:null},this.init()}return _createClass(t,[{key:"log",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";console.log("Off-canvas: "+t)}},{key:"logError",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";console.error("Off-canvas: "+t)}},{key:"debug",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";this.options.debug&&console.log("Off-canvas debug: "+t)}},{key:"init",value:function(){var t,e=this;try{if(this.mainWrap=document.querySelector(this.options.mainWrapSelector),!this.mainWrap)throw"Main wrap element was not found with selector: "+this.options.mainWrapSelector;if(this.contentWrap=this.mainWrap.querySelector(this.options.contentWrapSelector),!this.contentWrap)throw"Content wrap element was not found with selector: "+this.options.contentWrapSelector;this.openButtons=this.mainWrap.querySelectorAll("[data-offcanvas-open]"),this.closeButtons=this.mainWrap.querySelectorAll("[data-offcanvas-close]"),this.toggleButtons=this.mainWrap.querySelectorAll("[data-offcanvas-toggle]"),this.mainWrap.classList.add("offcanvas-main"),this.contentWrap.classList.add("offcanvas-content");for(var n=this.openButtons,i=function(t){var n=t.getAttribute("data-offcanvas-open");e.isValidPosition(n)?(t.addEventListener("click",(function(){return e.open(n,t)})),t.addEventListener("keydown",(function(i){[13,32].indexOf(i.keyCode)>=0&&(i.preventDefault(),e.open(n,t))}))):e.logError("Open button has invalid bar position '"+n+"' defined. Use one of the following values: left, right, top, bottom")},o=0;o<n.length;o++)i(n[o]);for(var s=this.toggleButtons,r=function(t){var n=t.getAttribute("data-offcanvas-toggle");e.isValidPosition(n)?(t.addEventListener("click",(function(){return e.toggle(n,t)})),t.addEventListener("keydown",(function(i){[13,32].indexOf(i.keyCode)>=0&&(i.preventDefault(),e.toggle(n,t))}))):e.logError("Toggle button has invalid bar position '"+n+"' defined. Use one of the following values: left, right, top, bottom")},a=0;a<s.length;a++)r(s[a]);for(var l=this.closeButtons,h=0;h<l.length;h++)(t=l[h]).addEventListener("click",(function(){return e.close()})),t.addEventListener("keydown",(function(t){[13,32].indexOf(t.keyCode)>=0&&(t.preventDefault(),e.close())}));this.options.overlay&&!this.overlay&&(this.overlay=document.createElement("div"),this.overlay.classList.add("offcanvas-overlay"),this.overlay.addEventListener("click",(function(){return e.close()})),this.overlay.addEventListener("keydown",(function(t){[13,32].indexOf(t.keyCode)>=0&&(t.preventDefault(),e.close())})),this.contentWrap.appendChild(this.overlay)),this.options.closeOnEsc&&window.addEventListener("keydown",(function(t){27===t.keyCode&&(t.preventDefault(),e.close())})),window.addEventListener("resize",(function(){clearTimeout(e.resizeTimeout),e.resizeTimeout=setTimeout((function(){e.setContentWrapPush()}),200)}))}catch(t){this.logError(t)}return this}},{key:"isValidPosition",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;return["left","right","top","bottom"].indexOf(t)>=0}},{key:"addBar",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"left",e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};try{if(!this.mainWrap||!this.contentWrap)return this;if(!this.isValidPosition(t))throw"Invalid bar position '"+t+"'. Use one of the following values: left, right, top, bottom";if(this.bars[t])throw"Bar with position '"+t+"' is already defined";var n=new OffCanvasBar(e);n.parentElement=this.mainWrap,n.position=t,n.init(),this.bars[t]=n,this.debug("Added bar with position '"+t+"'")}catch(t){this.logError(t)}return this}},{key:"open",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;try{if(!this.isValidPosition(t))throw"Invalid bar position '"+t+"'. Use one of the following values: left, right, top, bottom";var n=this.bars[t];if(!n)throw"Bar with position '"+t+"' is not defined";if(n.element.classList.contains("offcanvas-bar--open"))return;this.close(),this.debug("Opening bar '"+t+"'"),n.open(),this.currentOpenBar=n,this.setContentWrapPush(),this.previousOpenButton=e,this.showOverlay()}catch(t){this.logError(t)}return this}},{key:"toggle",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;try{if(!this.isValidPosition(t))throw"Invalid bar position '"+t+"'. Use one of the following values: left, right, top, bottom";this.currentOpenBar&&this.currentOpenBar.position==t?this.close():(this.close(),this.open(t,e))}catch(t){this.logError(t)}return this}},{key:"close",value:function(){try{if(!this.currentOpenBar)return;this.debug("Closing bar '"+this.currentOpenBar.position+"'"),this.currentOpenBar.close(),this.previousOpenButton&&(this.previousOpenButton.focus(),this.previousOpenButton=null),this.currentOpenBar=null,this.contentWrap.style.removeProperty("transform"),this.mainWrap.style.removeProperty("overflow"),this.hideOverlay()}catch(t){this.logError(t)}return this}},{key:"setContentWrapPush",value:function(){if(this.currentOpenBar&&this.currentOpenBar.options.mode&&(this.mainWrap.style.overflow="hidden",["push","slide"].indexOf(this.currentOpenBar.options.mode)>=0))switch(this.currentOpenBar.position){case"left":this.contentWrap.style.transform="translateX("+this.currentOpenBar.element.offsetWidth+"px)";break;case"right":this.contentWrap.style.transform="translateX(-"+this.currentOpenBar.element.offsetWidth+"px)";break;case"top":this.contentWrap.style.transform="translateY("+this.currentOpenBar.element.offsetHeight+"px)";break;case"bottom":this.contentWrap.style.transform="translateY(-"+this.currentOpenBar.element.offsetHeight+"px)"}}},{key:"showOverlay",value:function(){this.overlay&&(this.overlay.classList.contains("offcanvas-overlay--visible")||(this.debug("Showing overlay"),this.overlay.classList.add("offcanvas-overlay--visible")))}},{key:"hideOverlay",value:function(){this.overlay&&this.overlay.classList.contains("offcanvas-overlay--visible")&&(this.debug("Hiding overlay"),this.overlay.classList.remove("offcanvas-overlay--visible"))}}]),t}(),OffCanvasBar=function(){function t(e){_classCallCheck(this,t),this.options=_extends({selector:"",focusableElementSelector:'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',mode:"float"},e),this.parentElement=null,this.element=null,this.position=null}return _createClass(t,[{key:"isValidMode",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";return["float","push","slide"].indexOf(t)>=0}},{key:"init",value:function(){if(!this.position)throw"Missing position for bar";if(!this.parentElement)throw"Missing parent element for bar '"+this.position+"'";if(this.options.selector||(this.options.selector=".offcanvas-bar--"+this.position),this.element=this.parentElement.querySelector(this.options.selector),!this.element)throw"Bar element was not found with selector: "+this.options.selector;if(!this.isValidMode(this.options.mode))throw"Invalid mode '"+this.options.mode+"' for bar '"+this.position+"'. Use one of the following values: float, push, slide.";return this.element.classList.add("offcanvas-bar"),this.element.setAttribute("data-offcanvas-bar-position",this.position),this.disableFocus(),this}},{key:"disableFocus",value:function(){for(var t=this.element.querySelectorAll(this.options.focusableElementSelector),e=0;e<t.length;e++)t[e].setAttribute("tabindex","-1");this.element.setAttribute("tabindex","-1"),this.element.setAttribute("aria-hidden","true")}},{key:"enableFocus",value:function(){for(var t=this.element.querySelectorAll(this.options.focusableElementSelector),e=0;e<t.length;e++)t[e].removeAttribute("tabindex");this.element.removeAttribute("aria-hidden"),this.element.setAttribute("tabindex","0"),this.element.focus()}},{key:"open",value:function(){this.enableFocus(),this.element.classList.add("offcanvas-bar--open")}},{key:"close",value:function(){this.disableFocus(),this.element.classList.remove("offcanvas-bar--open")}}]),t}();
//# sourceMappingURL=offcanvas.js.map
