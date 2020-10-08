(this.webpackJsonpinstapic=this.webpackJsonpinstapic||[]).push([[0],{188:function(e,t,n){e.exports=n(351)},193:function(e,t,n){},194:function(e,t,n){},351:function(e,t,n){"use strict";n.r(t);var a,r=n(0),c=n.n(r),u=n(14),o=n.n(u),i=(n(193),n(19)),s=n.n(i),l=n(41),p=n(53),h=n(44),m=n(15),f=n(89),b=n(80),v=n(361),d=n(358),j=n(356),O=n(359),E=n(357),w=n(56),k=n(57),g=n(58),y=n(49),x=n(101),S=n(81),T=n(185),_=function(){function e(t){Object(y.a)(this,e),this._authToken=void 0,this._authToken=t}return Object(x.a)(e,[{key:"setAuthToken",value:function(e){this._authToken=e}},{key:"doPostFormData",value:function(){var e=Object(l.a)(s.a.mark((function e(t,n){return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",this.doFetch(t,{method:"POST",body:n}));case 1:case"end":return e.stop()}}),e,this)})));return function(t,n){return e.apply(this,arguments)}}()},{key:"doPostJson",value:function(){var e=Object(l.a)(s.a.mark((function e(t,n){return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",this.doFetch(t,{method:"POST",headers:{"Content-Type":"application/json;charset=utf-8"},body:JSON.stringify(n)}));case 1:case"end":return e.stop()}}),e,this)})));return function(t,n){return e.apply(this,arguments)}}()},{key:"doGet",value:function(){var e=Object(l.a)(s.a.mark((function e(t,n){var a;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a=null===n?t:t+"?"+this.encodeQueryParams(n),e.abrupt("return",this.doFetch(a,{headers:{Authorization:this._authToken}}));case 2:case"end":return e.stop()}}),e,this)})));return function(t,n){return e.apply(this,arguments)}}()},{key:"encodeQueryParams",value:function(e){return Object.keys(e).map((function(t){return"".concat(encodeURIComponent(t),"=").concat(encodeURIComponent(e[t]))})).join("&")}},{key:"doFetch",value:function(){var e=Object(l.a)(s.a.mark((function e(t,n){var a,r,c,u;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a=n.headers,r=Object(T.a)(n,["headers"]),c=Object(S.a)({},a),this._authToken&&(c=Object(S.a)(Object(S.a)({},a),{},{Authorization:this._authToken})),e.prev=3,e.next=6,fetch("/api"+t,Object(S.a)(Object(S.a)({},r),{},{headers:c}));case 6:u=e.sent,e.next=12;break;case 9:throw e.prev=9,e.t0=e.catch(3),e.t0;case 12:if(400!==u.status){e.next=16;break}throw new P;case 16:if(401!==u.status){e.next=20;break}throw new C;case 20:if(404!==u.status){e.next=24;break}throw new I;case 24:if(500!==u.status){e.next=26;break}throw new A;case 26:return e.abrupt("return",u);case 27:case"end":return e.stop()}}),e,this,[[3,9]])})));return function(t,n){return e.apply(this,arguments)}}()}]),e}(),P=function(e){Object(w.a)(n,e);var t=Object(k.a)(n);function n(){return Object(y.a)(this,n),t.apply(this,arguments)}return n}(Object(g.a)(Error)),F=function(e){Object(w.a)(n,e);var t=Object(k.a)(n);function n(){return Object(y.a)(this,n),t.apply(this,arguments)}return n}(Object(g.a)(Error)),C=function(e){Object(w.a)(n,e);var t=Object(k.a)(n);function n(){return Object(y.a)(this,n),t.apply(this,arguments)}return n}(Object(g.a)(Error)),I=function(e){Object(w.a)(n,e);var t=Object(k.a)(n);function n(){return Object(y.a)(this,n),t.apply(this,arguments)}return n}(Object(g.a)(Error)),A=function(e){Object(w.a)(n,e);var t=Object(k.a)(n);function n(){return Object(y.a)(this,n),t.apply(this,arguments)}return n}(Object(g.a)(Error)),R=function(){function e(t){Object(y.a)(this,e),this._client=void 0,this._client=t}return Object(x.a)(e,[{key:"setClient",value:function(e){this._client=e}},{key:"newPost",value:function(){var e=Object(l.a)(s.a.mark((function e(t,n){var a,r;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return"/v1/post",(r=new FormData).append("file",t),r.append("text",n),e.prev=4,e.next=7,this._client.doPostFormData("/v1/post",r);case 7:a=e.sent,e.next=13;break;case 10:throw e.prev=10,e.t0=e.catch(4),e.t0;case 13:return e.abrupt("return",a.json());case 14:case"end":return e.stop()}}),e,this,[[4,10]])})));return function(t,n){return e.apply(this,arguments)}}()},{key:"login",value:function(){var e=Object(l.a)(s.a.mark((function e(t,n){var a;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return"/v1/auth/login",e.prev=1,e.next=4,this._client.doPostJson("/v1/auth/login",{email:t,password:n});case 4:return a=e.sent,e.abrupt("return",a.json());case 8:e.prev=8,e.t0=e.catch(1),e.t1=e.t0,e.next=e.t1===e.t0 instanceof C?13:e.t1===e.t0 instanceof A?14:15;break;case 13:throw new N;case 14:throw new J;case 15:throw e.t0;case 16:case"end":return e.stop()}}),e,this,[[1,8]])})));return function(t,n){return e.apply(this,arguments)}}()},{key:"signup",value:function(){var e=Object(l.a)(s.a.mark((function e(t,n,a){var r;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return"/v1/user",e.prev=1,e.next=4,this._client.doPostJson("/v1/user",{email:t,username:n,password:a});case 4:return r=e.sent,e.abrupt("return",r.json());case 8:e.prev=8,e.t0=e.catch(1),e.t1=e.t0,e.next=e.t1===e.t0 instanceof F?13:14;break;case 13:throw new M;case 14:throw e.t0;case 15:case"end":return e.stop()}}),e,this,[[1,8]])})));return function(t,n,a){return e.apply(this,arguments)}}()},{key:"getPosts",value:function(){var e=Object(l.a)(s.a.mark((function e(t){var n,a;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a={sort_by:t},e.prev=1,e.next=4,this._client.doGet("/v1/post",a);case 4:return n=e.sent,e.abrupt("return",n.json());case 8:throw e.prev=8,e.t0=e.catch(1),e.t0;case 11:case"end":return e.stop()}}),e,this,[[1,8]])})));return function(t){return e.apply(this,arguments)}}()}]),e}(),N=function(e){Object(w.a)(n,e);var t=Object(k.a)(n);function n(){return Object(y.a)(this,n),t.apply(this,arguments)}return n}(Object(g.a)(Error)),J=function(e){Object(w.a)(n,e);var t=Object(k.a)(n);function n(){return Object(y.a)(this,n),t.apply(this,arguments)}return n}(Object(g.a)(Error)),M=function(e){Object(w.a)(n,e);var t=Object(k.a)(n);function n(){return Object(y.a)(this,n),t.apply(this,arguments)}return n}(Object(g.a)(Error)),L=n(360),U=(n(194),n(98)),q=n.n(U),z=n(166);function B(){var e=Object(h.a)();return c.a.createElement("div",{className:"App"},c.a.createElement(m.c,{history:e},c.a.createElement(D,null)))}function D(){var e=Object(r.useState)(""),t=Object(p.a)(e,2),n=t[0],a=t[1],u=Object(r.useRef)(new _(n)),o=Object(r.useRef)(new R(u.current)),i=Object(r.useState)(!1),s=Object(p.a)(i,2),l=s[0],h=s[1];return Object(r.useEffect)((function(){u.current.setAuthToken(n),o.current.setClient(u.current)}),[n]),c.a.createElement("div",{className:"App"},c.a.createElement("nav",null,c.a.createElement("ul",null,!n&&c.a.createElement(c.a.Fragment,null,c.a.createElement("li",null,c.a.createElement(f.a,{to:"/login"},"Login")),c.a.createElement("li",null,c.a.createElement(f.a,{to:"/signup"},"Signup"))),n&&c.a.createElement(c.a.Fragment,null,c.a.createElement("li",null,c.a.createElement(f.a,{to:"/explore"},"Explore")),c.a.createElement("li",null,c.a.createElement(f.a,{to:"new_post"},c.a.createElement(b.a,{onClick:function(){h(!0)}},"New Post"),c.a.createElement(G,{hideModal:function(){h(!1)},visible:l,api:o.current})))))),c.a.createElement(m.d,null,c.a.createElement(m.b,{path:"/login"},n?c.a.createElement(m.a,{to:"/"}):c.a.createElement(W,{api:o.current,setAuthToken:a})),c.a.createElement(m.b,{path:"/signup"},n?c.a.createElement(m.a,{to:"/"}):c.a.createElement(Y,{api:o.current,setAuthToken:a})),c.a.createElement(m.b,{path:"/explore"},n?c.a.createElement(Q,{api:o.current}):c.a.createElement(m.a,{to:"login"})),c.a.createElement(m.b,{path:"/"},n?c.a.createElement(Q,{api:o.current}):c.a.createElement(m.a,{to:"login"}))))}function G(e){var t=Object(r.useState)([]),n=Object(p.a)(t,2),a=n[0],u=n[1],o=Object(r.useState)(!1),i=Object(p.a)(o,2),h=i[0],m=i[1],f=Object(z.useForm)(),E=Object(p.a)(f,1)[0];return c.a.createElement(q.a,{title:"New Post",visible:e.visible,onCancel:e.hideModal,okText:"Submit",okButtonProps:{disabled:0===a.length},onOk:function(){E.validateFields().then(function(){var t=Object(l.a)(s.a.mark((function t(n){var a,r;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return a=n.file,r=n.text,console.log(n),m(!0),t.prev=4,t.next=7,e.api.newPost(a.file.originFileObj,r);case 7:t.sent,t.next=12;break;case 10:t.prev=10,t.t0=t.catch(4);case 12:m(!1),e.hideModal();case 14:case"end":return t.stop()}}),t,null,[[4,10]])})));return function(e){return t.apply(this,arguments)}}())},confirmLoading:h},c.a.createElement(d.a,{form:E,preserve:!1,name:"validate_other"},c.a.createElement(d.a.Item,{name:"file",label:"Image",extra:"Please upload a .png, .jpg, .jpeg, or .gif image"},c.a.createElement(j.a,{customRequest:function(e){var t=e.onSuccess;setTimeout((function(){t("ok")}),0)},onChange:function(e){var t=[];switch(e.file.status){case"uploading":case"done":t=[e.file];break;default:t=[]}u(t)},fileList:a,name:"logo",listType:"picture",beforeUpload:function(e){return!!["image/png","image/jpg","image/jpeg","image/gif"].includes(e.type)||(v.b.error("".concat(e.name," is not in a file format that we support")),!1)}},c.a.createElement(b.a,{icon:c.a.createElement(L.a,null)},"Click to upload"))),c.a.createElement(d.a.Item,{name:"text",label:"Subtitle"},c.a.createElement(O.a,{required:!0}))))}function Q(e){var t=Object(r.useState)(!1),n=Object(p.a)(t,2),u=(n[0],n[1],Object(r.useState)(null)),o=Object(p.a)(u,2),i=o[0],h=o[1],m=Object(r.useState)(a.MOST_RECENT),f=Object(p.a)(m,2),b=f[0];f[1];return Object(r.useEffect)((function(){function t(){return(t=Object(l.a)(s.a.mark((function t(){var n;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.api.getPosts(b);case 2:n=t.sent,h(n);case 4:case"end":return t.stop()}}),t)})))).apply(this,arguments)}!function(){t.apply(this,arguments)}()}),[b]),c.a.createElement("div",null,c.a.createElement("h2",null,"Explore"),function(e){if(null!==e)return console.log(e),c.a.createElement(c.a.Fragment,null,e.map((function(e,t){return c.a.createElement(E.a,{key:t,title:e.text},e.created_on)})))}(i))}function W(e){var t=Object(r.useState)(""),n=Object(p.a)(t,2),a=(n[0],n[1]);function u(){return(u=Object(l.a)(s.a.mark((function t(n){var r,c,u;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return r=n.email,c=n.password,t.prev=1,t.next=4,e.api.login(r,c);case 4:u=t.sent,e.setAuthToken(u.authorization),t.next=17;break;case 8:t.prev=8,t.t0=t.catch(1),t.t1=t.t0,t.next=t.t1===t.t0 instanceof N?13:t.t1===t.t0 instanceof J?15:17;break;case 13:return a("Login unsuccessful, check your email and password. Did you mean to sign up?"),t.abrupt("break",17);case 15:return a("Our systems seem to be experiencing issues, please try again later"),t.abrupt("break",17);case 17:case"end":return t.stop()}}),t,null,[[1,8]])})))).apply(this,arguments)}return c.a.createElement("div",null,c.a.createElement("h2",null,"Login"),c.a.createElement(d.a,{onFinish:function(e){return u.apply(this,arguments)}},c.a.createElement(d.a.Item,{label:"Email",name:"email"},c.a.createElement(O.a,{required:!0})),c.a.createElement(d.a.Item,{label:"Password",name:"password"},c.a.createElement(O.a.Password,{required:!0})),c.a.createElement("button",null,"Submit")))}function Y(e){var t=Object(r.useState)(""),n=Object(p.a)(t,2),a=(n[0],n[1]);function u(){return(u=Object(l.a)(s.a.mark((function t(n){var r,c,u,o,i;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return r=n.email,c=n.username,u=n.password,t.prev=1,t.next=4,e.api.signup(r,c,u);case 4:o=t.sent,e.setAuthToken(null===(i=o)||void 0===i?void 0:i.authorization),t.next=16;break;case 8:t.prev=8,t.t0=t.catch(1),t.t1=t.t0,t.next=t.t1===t.t0 instanceof M?13:15;break;case 13:return a("Email is already registered, did you mean to log in?"),t.abrupt("break",16);case 15:throw t.t0;case 16:case"end":return t.stop()}}),t,null,[[1,8]])})))).apply(this,arguments)}return c.a.createElement("div",null,c.a.createElement("h2",null,"Sign up"),c.a.createElement(d.a,{onFinish:function(e){return u.apply(this,arguments)}},c.a.createElement(d.a.Item,{label:"Email",name:"email"},c.a.createElement(O.a,null)),c.a.createElement(d.a.Item,{label:"Username",name:"username"},c.a.createElement(O.a,null)),c.a.createElement(d.a.Item,{label:"Password",name:"password"},c.a.createElement(O.a.Password,null)),c.a.createElement("button",null,"Submit")))}!function(e){e.MOST_RECENT="most_recent",e.BY_USER="by_user"}(a||(a={}));Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(c.a.createElement(c.a.StrictMode,null,c.a.createElement(B,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[188,1,2]]]);
//# sourceMappingURL=main.2dbe5f41.chunk.js.map