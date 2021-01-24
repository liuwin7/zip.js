!function(){"use strict";class t{constructor(){this.crc=-1,this.table=(()=>{const t=[];for(let e=0;e<256;e++){let n=e;for(let t=0;t<8;t++)1&n?n=n>>>1^3988292384:n>>>=1;t[e]=n}return t})()}append(t){const e=this.table;let n=0|this.crc;for(let s=0,i=0|t.length;s<i;s++)n=n>>>8^e[255&(n^t[s])];this.crc=n}get(){return~this.crc}}const e="Invalid pasword",n=16,s="raw",i={name:"PBKDF2"},a={name:"HMAC"},r="SHA-1",c={name:"AES-CTR"},h=Object.assign({hash:a},i),o=Object.assign({iterations:1e3,hash:{name:r}},i),p=Object.assign({hash:r},a),u=Object.assign({length:n},c),d=["deriveBits"],l=["sign"],y=10,g=[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],w=crypto.subtle;class f{constructor(t,e){this.password=t,this.signed=e,this.input=e&&new Uint8Array(0),this.pendingInput=new Uint8Array(0)}async append(t){const s=async(e=0)=>{if(e+n<=a.length-y){const t=a.subarray(e,e+n),r=await w.decrypt(Object.assign({counter:this.counter},u),this.keys.key,t);return U(this.counter),i.set(new Uint8Array(r),e),s(e+n)}return this.pendingInput=a.subarray(e),this.signed&&(this.input=m(this.input,t)),i};if(this.password){const n=t.subarray(0,18);await async function(t,n,s){await A(t,s,n.subarray(0,16),["decrypt"]);const i=n.subarray(16),a=t.keys.passwordVerification;if(a[0]!=i[0]||a[1]!=i[1])throw new Error(e)}(this,n,this.password),this.password=null,t=t.subarray(18)}let i=new Uint8Array(t.length-y-(t.length-y)%n),a=t;return this.pendingInput.length&&(a=m(this.pendingInput,t),i=k(i,a.length-y-(a.length-y)%n)),s()}async flush(){const t=this.pendingInput,e=this.keys,n=t.subarray(0,t.length-y),s=t.subarray(t.length-y);let i=new Uint8Array(0);if(n.length){const t=await w.decrypt(Object.assign({counter:this.counter},u),e.key,n);i=new Uint8Array(t)}let r=!0;if(this.signed){const t=await w.sign(a,e.authentication,this.input.subarray(0,this.input.length-y)),n=new Uint8Array(t);this.input=null;for(let t=0;t<y;t++)n[t]!=s[t]&&(r=!1)}return{valid:r,data:i}}}class b{constructor(t){this.password=t,this.output=new Uint8Array(0),this.pendingInput=new Uint8Array(0)}async append(t){const e=async(a=0)=>{if(a+n<=t.length){const r=t.subarray(a,a+n),c=await w.encrypt(Object.assign({counter:this.counter},u),this.keys.key,r);return U(this.counter),i.set(new Uint8Array(c),a+s.length),e(a+n)}return this.pendingInput=t.subarray(a),this.output=m(this.output,i),i};let s=new Uint8Array(0);this.password&&(s=await async function(t,e){const n=crypto.getRandomValues(new Uint8Array(16));return await A(t,e,n,["encrypt"]),m(n,t.keys.passwordVerification)}(this,this.password),this.password=null);let i=new Uint8Array(s.length+t.length-t.length%n);return i.set(s,0),this.pendingInput.length&&(t=m(this.pendingInput,t),i=k(i,t.length-t.length%n)),e()}async flush(){let t=new Uint8Array(0);if(this.pendingInput.length){const e=await w.encrypt(Object.assign({counter:this.counter},u),this.keys.key,this.pendingInput);t=new Uint8Array(e),this.output=m(this.output,t)}const e=await w.sign(a,this.keys.authentication,this.output.subarray(18));this.output=null;const n=new Uint8Array(e).subarray(0,y);return{data:m(t,n),signature:n}}}async function A(t,e,n,i){t.counter=new Uint8Array(g);const a=(new TextEncoder).encode(e),r=await w.importKey(s,a,h,!1,d),u=await w.deriveBits(Object.assign({salt:n},o),r,528),y=new Uint8Array(u);t.keys={key:await w.importKey(s,y.subarray(0,32),c,!0,i),authentication:await w.importKey(s,y.subarray(32,64),p,!1,l),passwordVerification:y.subarray(64)}}function U(t){for(let e=0;e<16;e++){if(255!=t[e]){t[e]++;break}t[e]=0}}function m(t,e){let n=t;return t.length+e.length&&(n=new Uint8Array(t.length+e.length),n.set(t,0),n.set(e,t.length)),n}function k(t,e){if(e&&e>t.length){const n=t;(t=new Uint8Array(e)).set(n,0)}return t}const D="deflate",I="inflate",C="Invalid signature";class v{constructor(e){this.signature=e.inputSignature,this.encrypted=Boolean(e.inputPassword),this.signed=e.inputSigned,this.compressed=e.inputCompressed,this.inflate=this.compressed&&new e.codecConstructor,this.crc32=this.signed&&this.signed&&new t,this.decrypt=this.encrypted&&new f(e.inputPassword)}async append(t){return this.encrypted&&(t=await this.decrypt.append(t)),this.compressed&&t.length&&(t=await this.inflate.append(t)),!this.encrypted&&this.signed&&this.crc32.append(t),t}async flush(){let t,e=new Uint8Array(0);if(this.encrypted){const t=await this.decrypt.flush();if(!t.valid)throw new Error(C);e=t.data}else if(this.signed){const e=new DataView(new Uint8Array(4).buffer);if(t=this.crc32.get(),e.setUint32(0,t),this.signature!=e.getUint32(0,!1))throw new Error(C)}return this.compressed&&(e=await this.inflate.append(e)||new Uint8Array(0),await this.inflate.flush()),{data:e,signature:t}}}class j{constructor(e){this.encrypted=e.outputEncrypted,this.signed=e.outputSigned,this.compressed=e.outputCompressed,this.deflate=this.compressed&&new e.codecConstructor({level:e.level||5}),this.crc32=this.signed&&new t,this.encrypt=this.encrypted&&new b(e.outputPassword)}async append(t){let e=t;return this.compressed&&t.length&&(e=await this.deflate.append(t)),this.encrypted?e=await this.encrypt.append(e):this.signed&&this.crc32.append(t),e}async flush(){let t,e=new Uint8Array(0);if(this.compressed&&(e=await this.deflate.flush()||new Uint8Array(0)),this.encrypted){e=await this.encrypt.append(e);const n=await this.encrypt.flush();t=n.signature;const s=new Uint8Array(e.length+n.data.length);s.set(e,0),s.set(n.data,e.length),e=s}else this.signed&&(t=this.crc32.get());return{data:e,signature:t}}}const O={init(t){t.scripts&&t.scripts.length&&importScripts.apply(void 0,t.scripts);const e=t.options;self.initCodec&&self.initCodec(),e.codecType.startsWith(D)?e.codecConstructor=self.Deflate:e.codecType.startsWith(I)&&(e.codecConstructor=self.Inflate),E=function(t){return t.codecType.startsWith(D)?new j(t):t.codecType.startsWith(I)?new v(t):void 0}(e)},append:async t=>({data:await E.append(t.data)}),flush:()=>E.flush()};let E;addEventListener("message",(async t=>{const e=t.data,n=e.type,s=O[n];if(s)try{const t=await s(e)||{};if(t.type=n,t.data)try{postMessage(t,[t.data.buffer])}catch(e){postMessage(t)}else postMessage(t)}catch(t){postMessage({type:n,error:{message:t.message,stack:t.stack}})}}));const S="function";function T(t,e){return class{constructor(n){const s=t=>{if(this.pendingData){const e=this.pendingData;this.pendingData=new Uint8Array(e.length+t.length),this.pendingData.set(e,0),this.pendingData.set(t,e.length)}else this.pendingData=new Uint8Array(t)};if(this.codec=new t(Object.assign({},e,n)),typeof this.codec.onData==S)this.codec.onData=s;else{if(typeof this.codec.on!=S)throw new Error("Cannot register the callback function");this.codec.on("data",s)}}async append(t){return this.codec.push(t),n(this)}async flush(){return this.codec.push(new Uint8Array(0),!0),n(this)}};function n(t){if(t.pendingData){const e=t.pendingData;return t.pendingData=null,e}return new Uint8Array(0)}}self.initCodec=()=>{const{Deflate:t,Inflate:e}=((t,e={})=>({Deflate:T(t.Deflate,e.deflate),Inflate:T(t.Inflate,e.inflate)}))(pako,{deflate:{raw:!0},inflate:{raw:!0}});self.Deflate=t,self.Inflate=e}}();
