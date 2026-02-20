/* LuminaRetouch v6 for Higgsfield */
(function(){
'use strict';

var ALL_RATIOS=["Auto","1:1","3:4","4:3","2:3","3:2","9:16","16:9","5:4","4:5","21:9"];

var FACE_LOCK="Strict facial geometry preservation: maintain exact bone structure, eye shape, pupil distance, nasal bridge contour. Zero artistic interpretation of identity: 1:1 anatomical replica of reference. Skin texture must show realistic pores and micro-imperfections. The person's identity is fixed and immutable. No hands or objects obscuring face.";

var REAL_SKIN="Skin rendered with uncompromising realism: visible pores, uneven texture, fine lines around eyes, subtle under-eye darkness, faint freckles, micro-redness, slight blotchiness, vellus hairs, authentic imperfections. Accurate matte/oily zone separation, soft specular highlights, realistic micro-shadows in pores and folds. Eyes with detailed iris fibers, subtle chromatic variation, natural pupil depth, slightly moist tear lines, realistic sclera texture, individual irregular eyelashes. Soft neutral natural lighting like overcast daylight. Neutral realistic color grading, true skin tones, no stylization. Like an unretouched high-res DSLR photo, brutally realistic, imperfect, human.";

var NEG_PROMPT="CGI, render, 3D, illustration, airbrushed skin, plastic texture, cartoon, anime, over-saturated, fake lighting, cinematic smooth, watermarked, blurry hands, deformed features, AI art style, digital painting, smooth skin filter, perfect symmetry, glowing eyes, neon highlights, unreal engine, polished.";

var MODES=[
  {id:"retouch",n:"Retouch",d:"Professional retouching",ic:"R",cl:"#F472B6",tasks:[
    {id:"smooth",n:"Skin Smoothing",d:"Smooth skin preserving details",steps:[
      {id:"img",t:"file",l:"Image",rq:1},{id:"int",t:"slider",l:"Intensity",mn:0,mx:100,df:50,u:"%"},
      {id:"area",t:"select",l:"Apply to",opts:["Full Image","Face Only","Custom"],df:"Face Only"},
      {id:"blend",t:"select",l:"Blend",opts:["Normal","Soft Light","Overlay"],df:"Soft Light"},
      {id:"facelock",t:"toggle",l:"Face Lock",df:true},
      {id:"pr",t:"prompt",l:"Additional instructions"},{id:"hdr",t:"toggle",l:"HDR Effect",df:false},
      {id:"ratio",t:"select",l:"Output Ratio",opts:ALL_RATIOS,df:"Auto"}]},
    {id:"spot",n:"Spot / Blemish Removal",d:"Describe what to remove",steps:[
      {id:"img",t:"file",l:"Image",rq:1},
      {id:"pr",t:"prompt",l:"Describe what to remove (use left/right/top/bottom for position)",ph:"Remove the dark spot on the LEFT cheek and scar near RIGHT eyebrow"},
      {id:"facelock",t:"toggle",l:"Face Lock",df:true},{id:"hdr",t:"toggle",l:"HDR Effect",df:false},
      {id:"ratio",t:"select",l:"Output Ratio",opts:ALL_RATIOS,df:"Auto"}]},
    {id:"wrinkle",n:"Wrinkle Reduction",d:"Soften wrinkles",steps:[
      {id:"img",t:"file",l:"Image",rq:1},{id:"int",t:"slider",l:"Intensity",mn:0,mx:100,df:60,u:"%"},
      {id:"facelock",t:"toggle",l:"Face Lock",df:true},
      {id:"pr",t:"prompt",l:"Additional instructions"},{id:"hdr",t:"toggle",l:"HDR Effect",df:false},
      {id:"ratio",t:"select",l:"Output Ratio",opts:ALL_RATIOS,df:"Auto"}]},
    {id:"ultra",n:"Ultra Realistic",d:"Real skin: pores, hair, no AI plastic",steps:[
      {id:"img",t:"file",l:"Image",rq:1},{id:"int",t:"slider",l:"Realism",mn:0,mx:100,df:75,u:"%"},
      {id:"facelock",t:"toggle",l:"Face Lock",df:true},
      {id:"pos",t:"prompt",l:"Positive prompt",ph:"hyper-realistic skin texture, visible pores, natural imperfections"},
      {id:"neg",t:"prompt",l:"Negative prompt",ph:NEG_PROMPT},
      {id:"hdr",t:"toggle",l:"HDR Effect",df:false},
      {id:"ratio",t:"select",l:"Output Ratio",opts:ALL_RATIOS,df:"Auto"}]}
  ]},
  {id:"face_swap",n:"Face Swap",d:"Surgical precision face replacement",ic:"F",cl:"#EC4899",tasks:[
    {id:"fswap",n:"Face Swap",d:"Replace face with surgical precision, preserving all details",steps:[
      {id:"img",t:"file",l:"Source Face (face to use)",rq:1},
      {id:"img2",t:"file2",l:"Target Image (body to put face on)",rq:1},
      {id:"detail",t:"select",l:"Detail Level",opts:["Standard","High","Ultra Surgical"],df:"Ultra Surgical"},
      {id:"match",t:"select",l:"Skin Tone Match",opts:["Auto","Warm Shift","Cool Shift","Exact Copy"],df:"Auto"},
      {id:"blend2",t:"slider",l:"Edge Blending",mn:0,mx:100,df:85,u:"%"},
      {id:"facelock",t:"toggle",l:"Face Lock",df:true},
      {id:"pr",t:"prompt",l:"Additional instructions",ph:"Match lighting direction from LEFT, preserve skin texture"},
      {id:"hdr",t:"toggle",l:"HDR Effect",df:false},
      {id:"ratio",t:"select",l:"Output Ratio",opts:ALL_RATIOS,df:"Auto"}]}
  ]},
  {id:"composition",n:"Composition",d:"Compositing & manipulation",ic:"C",cl:"#60A5FA",tasks:[
    {id:"bgr",n:"Background Replace",d:"Place elements into new background",steps:[
      {id:"img",t:"file",l:"Background / Destination",rq:1},{id:"img2",t:"file2",l:"Elements to place",rq:1},
      {id:"facelock",t:"toggle",l:"Face Lock",df:true},
      {id:"pr",t:"prompt",l:"Placement (use LEFT/RIGHT/CENTER for position)",ph:"Place person on the RIGHT side, match lighting from LEFT"},
      {id:"hdr",t:"toggle",l:"HDR Effect",df:false},
      {id:"ratio",t:"select",l:"Output Ratio",opts:ALL_RATIOS,df:"Auto"}]},
    {id:"objrem",n:"Object Removal",d:"Remove unwanted objects",steps:[
      {id:"img",t:"file",l:"Image",rq:1},
      {id:"facelock",t:"toggle",l:"Face Lock",df:true},
      {id:"pr",t:"prompt",l:"What to remove (use spatial directions)",ph:"Remove person on the LEFT and trash bin on BOTTOM-RIGHT"},
      {id:"hdr",t:"toggle",l:"HDR Effect",df:false},
      {id:"ratio",t:"select",l:"Output Ratio",opts:ALL_RATIOS,df:"Auto"}]}
  ]},
  {id:"pose_swap",n:"Pose Swap",d:"Apply pose from one image to another",ic:"P",cl:"#A78BFA",tasks:[
    {id:"pose",n:"Apply Pose",d:"Transfer pose. Upload multiple references for better accuracy",steps:[
      {id:"imgs",t:"multifile",l:"Pose References (up to 10)",mx:10,rq:1},
      {id:"img2",t:"file2",l:"Target (apply pose to)",rq:1},
      {id:"facelock",t:"toggle",l:"Face Lock",df:true},
      {id:"pr",t:"prompt",l:"Instructions (use LEFT/RIGHT for facing direction)",ph:"Subject faces RIGHT, keep original clothing"},
      {id:"hdr",t:"toggle",l:"HDR Effect",df:false},
      {id:"ratio",t:"select",l:"Output Ratio",opts:ALL_RATIOS,df:"Auto"}]}
  ]},
  {id:"move_space",n:"Move in Space",d:"Extend & reposition in 3D",ic:"M",cl:"#14B8A6",tasks:[
    {id:"extend",n:"Extend Image",d:"Expand with AI content",steps:[
      {id:"img",t:"file",l:"Original",rq:1},
      {id:"from",t:"select",l:"Current Ratio",opts:ALL_RATIOS,df:"4:3"},
      {id:"to",t:"select",l:"Target Ratio",opts:ALL_RATIOS,df:"16:9"},
      {id:"dir",t:"direction",l:"Extend Direction"},
      {id:"facelock",t:"toggle",l:"Face Lock",df:true},
      {id:"pr",t:"prompt",l:"Describe extended area",ph:"Continue landscape LEFT with trees matching scene"},
      {id:"hdr",t:"toggle",l:"HDR Effect",df:false}]},
    {id:"moveobj",n:"Move Object / Person",d:"Reposition in 3D space",steps:[
      {id:"img",t:"file",l:"Scene Image",rq:1},
      {id:"isomethod",t:"select",l:"Isolate Object",opts:["Upload Cutout","Describe Object"],df:"Describe Object"},
      {id:"img2",t:"file2",l:"Object Cutout (if Upload)"},
      {id:"objdesc",t:"prompt",l:"Object Description",ph:"The plant wall on the LEFT side of the room"},
      {id:"grid",t:"grid3d",l:"Click/drag target position"},
      {id:"depth",t:"slider",l:"Depth (Near-Far)",mn:-100,mx:100,df:0,u:""},
      {id:"scale",t:"slider",l:"Scale",mn:50,mx:200,df:100,u:"%"},
      {id:"light",t:"select",l:"Lighting",opts:["Auto Match","Brighter","Darker","Same"],df:"Auto Match"},
      {id:"focus",t:"select",l:"Focus",opts:["In Focus","Slight Blur","BG Blur","Match"],df:"Match"},
      {id:"shadow",t:"select",l:"Shadow",opts:["Auto","Soft","Hard","None"],df:"Auto"},
      {id:"facelock",t:"toggle",l:"Face Lock",df:true},
      {id:"pr",t:"prompt",l:"Additional instructions"},
      {id:"hdr",t:"toggle",l:"HDR Effect",df:false},
      {id:"ratio",t:"select",l:"Output Ratio",opts:ALL_RATIOS,df:"Auto"}]}
  ]},
  {id:"color_grading",n:"Color Grading",d:"Color correction",ic:"G",cl:"#FB923C",tasks:[
    {id:"bc",n:"Brightness / Contrast",steps:[{id:"img",t:"file",l:"Image",rq:1},{id:"br",t:"slider",l:"Brightness",mn:-100,mx:100,df:0,u:""},{id:"cn",t:"slider",l:"Contrast",mn:-100,mx:100,df:0,u:""},{id:"facelock",t:"toggle",l:"Face Lock",df:true},{id:"pr",t:"prompt",l:"Instructions"},{id:"hdr",t:"toggle",l:"HDR Effect",df:false},{id:"ratio",t:"select",l:"Output Ratio",opts:ALL_RATIOS,df:"Auto"}]},
    {id:"ex",n:"Exposure",steps:[{id:"img",t:"file",l:"Image",rq:1},{id:"ev",t:"slider",l:"Exposure",mn:-3,mx:3,df:0,u:" stops",st:0.1},{id:"facelock",t:"toggle",l:"Face Lock",df:true},{id:"pr",t:"prompt",l:"Instructions"},{id:"hdr",t:"toggle",l:"HDR Effect",df:false},{id:"ratio",t:"select",l:"Output Ratio",opts:ALL_RATIOS,df:"Auto"}]},
    {id:"hs",n:"Hue / Saturation",steps:[{id:"img",t:"file",l:"Image",rq:1},{id:"rg",t:"select",l:"Range",opts:["Master","Reds","Yellows","Greens","Blues"],df:"Master"},{id:"hu",t:"slider",l:"Hue",mn:-180,mx:180,df:0,u:"\u00B0"},{id:"sa",t:"slider",l:"Saturation",mn:-100,mx:100,df:0,u:""},{id:"facelock",t:"toggle",l:"Face Lock",df:true},{id:"pr",t:"prompt",l:"Instructions"},{id:"hdr",t:"toggle",l:"HDR Effect",df:false},{id:"ratio",t:"select",l:"Output Ratio",opts:ALL_RATIOS,df:"Auto"}]},
    {id:"cb",n:"Color Balance",steps:[{id:"img",t:"file",l:"Image",rq:1},{id:"tn",t:"select",l:"Range",opts:["Shadows","Midtones","Highlights"],df:"Midtones"},{id:"cr",t:"slider",l:"Cyan-Red",mn:-100,mx:100,df:0,u:""},{id:"mg",t:"slider",l:"Mag-Green",mn:-100,mx:100,df:0,u:""},{id:"yb",t:"slider",l:"Yel-Blue",mn:-100,mx:100,df:0,u:""},{id:"facelock",t:"toggle",l:"Face Lock",df:true},{id:"pr",t:"prompt",l:"Instructions"},{id:"hdr",t:"toggle",l:"HDR Effect",df:false},{id:"ratio",t:"select",l:"Output Ratio",opts:ALL_RATIOS,df:"Auto"}]},
    {id:"rc",n:"Replace Color",steps:[{id:"img",t:"file",l:"Image",rq:1},{id:"fc",t:"color",l:"From",df:"#FF0000"},{id:"tc",t:"color",l:"To",df:"#00FF00"},{id:"fz",t:"slider",l:"Tolerance",mn:0,mx:100,df:50,u:"%"},{id:"facelock",t:"toggle",l:"Face Lock",df:true},{id:"pr",t:"prompt",l:"Instructions"},{id:"hdr",t:"toggle",l:"HDR Effect",df:false},{id:"ratio",t:"select",l:"Output Ratio",opts:ALL_RATIOS,df:"Auto"}]},
    {id:"bw",n:"Black & White",steps:[{id:"img",t:"file",l:"Image",rq:1},{id:"pre",t:"select",l:"Preset",opts:["Default","High Contrast","Infrared","Film Noir"],df:"Default"},{id:"facelock",t:"toggle",l:"Face Lock",df:true},{id:"pr",t:"prompt",l:"Instructions"},{id:"hdr",t:"toggle",l:"HDR Effect",df:false},{id:"ratio",t:"select",l:"Output Ratio",opts:ALL_RATIOS,df:"Auto"}]},
    {id:"pf",n:"Photo Filter",steps:[{id:"img",t:"file",l:"Image",rq:1},{id:"fl",t:"select",l:"Filter",opts:["Warming","Cooling","Sepia","Vintage","Cinematic"],df:"Warming"},{id:"dn",t:"slider",l:"Intensity",mn:0,mx:100,df:50,u:"%"},{id:"facelock",t:"toggle",l:"Face Lock",df:true},{id:"pr",t:"prompt",l:"Instructions"},{id:"hdr",t:"toggle",l:"HDR Effect",df:false},{id:"ratio",t:"select",l:"Output Ratio",opts:ALL_RATIOS,df:"Auto"}]}
  ]},
  {id:"create_image",n:"Create Image",d:"Generate with AI",ic:"I",cl:"#34D399",tasks:[
    {id:"t2i",n:"Text to Image",d:"Generate from text. Add reference images for style",steps:[
      {id:"pr",t:"prompt",l:"Describe your image",ph:"A professional portrait..."},
      {id:"imgs",t:"multifile",l:"Reference Images (up to 10, optional)",mx:10},
      {id:"st",t:"select",l:"Style",opts:["Photorealistic","Artistic","Cinematic","Fashion","Studio","Still Life","Dynamic"],df:"Photorealistic"},
      {id:"facelock",t:"toggle",l:"Face Lock",df:true},{id:"hdr",t:"toggle",l:"HDR Effect",df:false},
      {id:"ratio",t:"select",l:"Output Ratio",opts:ALL_RATIOS,df:"1:1"}]}
  ]},
  {id:"clone_style",n:"Clone Style",d:"Transfer specific settings",ic:"S",cl:"#FBBF24",tasks:[
    {id:"clone",n:"Clone Adjustments",d:"Multi-ref for better accuracy",steps:[
      {id:"imgs",t:"multifile",l:"Source References (up to 10)",mx:10,rq:1},
      {id:"img2",t:"file2",l:"Target",rq:1},
      {id:"tags",t:"tags",l:"Settings to transfer",opts:["Camera Settings","Lights","Image Treatment","Image Quality","Match Colors"]},
      {id:"facelock",t:"toggle",l:"Face Lock",df:true},
      {id:"pr",t:"prompt",l:"Instructions"},{id:"hdr",t:"toggle",l:"HDR Effect",df:false},
      {id:"ratio",t:"select",l:"Output Ratio",opts:ALL_RATIOS,df:"Auto"}]}
  ]},
  {id:"upscale",n:"Upscale",d:"AI upscaling",ic:"U",cl:"#818CF8",tasks:[
    {id:"up",n:"AI Upscale",steps:[
      {id:"img",t:"file",l:"Image",rq:1},{id:"fc2",t:"select",l:"Scale",opts:["2x","4x","8x"],df:"2x"},
      {id:"dn2",t:"slider",l:"Denoise",mn:0,mx:100,df:30,u:"%"},
      {id:"facelock",t:"toggle",l:"Face Lock",df:true},
      {id:"pr",t:"prompt",l:"Instructions"},{id:"hdr",t:"toggle",l:"HDR Effect",df:false},
      {id:"ratio",t:"select",l:"Output Ratio",opts:ALL_RATIOS,df:"Auto"}]}
  ]}
];

/* ═══ STATE ═══ */
var state={open:false,showCfg:false,mode:null,task:null,vals:{},
  imgB64:null,imgMime:"image/jpeg",img2B64:null,img2Mime:"image/jpeg",
  multiImgs:[],isGen:false,prev:null,gemTxt:"",err:"",showPrev:false,gemKey:"",
  gridPos:{x:0,y:0,rawX:0.5,rawY:0.7},galleryMode:false,keepImg:false,jsonMode:false,pickTask:false};

/* ═══ HELPERS ═══ */
function $(s,p){return(p||document).querySelector(s)}
function el(tag,a,c){var e=document.createElement(tag);if(a)Object.keys(a).forEach(function(k){if(k==='style'&&typeof a[k]==='object')Object.assign(e.style,a[k]);else if(k.indexOf('on')===0)e.addEventListener(k.slice(2).toLowerCase(),a[k]);else if(k==='className')e.className=a[k];else e.setAttribute(k,a[k])});if(c){if(typeof c==='string')e.textContent=c;else if(Array.isArray(c))c.forEach(function(x){if(x)e.appendChild(x)});else e.appendChild(c)}return e}
function getAm(){return MODES.find(function(m){return m.id===state.mode})}
function getAt(){var am=getAm();return am?am.tasks.find(function(t){return t.id===state.task}):null}

/* ═══ BUILD PROMPT ═══ */
function buildPrompt(){
  var am=getAm(),at=getAt();if(!am||!at)return"";
  var hasFaceLock=state.vals.facelock;
  var isUltra=at.id==='ultra';
  var p="[LuminaRetouch > Nano Banana Pro]\nMode: "+am.n+" > "+at.n+"\n";
  p+="Spatial Reference: Use image coordinates - LEFT/RIGHT of frame, TOP/BOTTOM, NEAR CAMERA/FAR from camera, CENTER.\n";
  at.steps.forEach(function(s){
    if(s.t==="file"||s.t==="file2"||s.t==="multifile")return;
    var v=state.vals[s.id];if(v==null||v==="")return;
    if(s.id==="facelock")return; // handled separately
    if(s.t==="tags"){if(Array.isArray(v)&&v.length>0)p+="Transfer: "+v.join(", ")+"\n"}
    else if(s.t==="prompt"){if(v)p+=s.l+": "+v+"\n"}
    else if(s.t==="toggle"){if(v)p+=s.l+": ON\n"}
    else if(s.t==="direction"){if(v)p+="Extend Direction: "+v+"\n"}
    else if(s.t==="grid3d"){p+="Target Position: X="+state.gridPos.x+" Y="+state.gridPos.y+"\n"}
    else p+=s.l+": "+v+(s.u||"")+"\n";
  });
  if(hasFaceLock)p+="\nFACE LOCK: "+FACE_LOCK+"\n";
  if(isUltra)p+="\nREAL SKIN: "+REAL_SKIN+"\n";
  p+="\nNegative: "+NEG_PROMPT;
  p+="\n\nReference images: "+(state.multiImgs.length||((state.imgB64?1:0)+(state.img2B64?1:0)));
  p+="\nMode: UNLIMITED\nOptimized for Nano Banana Pro on Higgsfield.AI";
  return p;
}
function buildJsonPrompt(){
  var am=getAm(),at=getAt();if(!am||!at)return"";
  var obj={tool:"LuminaRetouch",mode:am.n,task:at.n,settings:{},faceLock:!!state.vals.facelock,hdr:!!state.vals.hdr,negativePrompt:NEG_PROMPT};
  at.steps.forEach(function(s){
    if(s.t==="file"||s.t==="file2"||s.t==="multifile"||s.t==="grid3d")return;
    var v=state.vals[s.id];if(v==null||v==="")return;
    if(s.t==="tags"&&Array.isArray(v))obj.settings[s.l]=v;
    else if(s.t==="toggle")obj.settings[s.l]=!!v;
    else obj.settings[s.l]=v;
  });
  if(state.vals.facelock)obj.faceLockPrompt=FACE_LOCK;
  if(at.id==='ultra')obj.realSkin=REAL_SKIN;
  obj.gridPosition=state.task==='moveobj'?{x:state.gridPos.x,y:state.gridPos.y}:undefined;
  obj.referenceImages=(state.multiImgs.length||((state.imgB64?1:0)+(state.img2B64?1:0)));
  obj.mode="UNLIMITED";
  return JSON.stringify(obj,null,2);
}

/* ═══ GEMINI ═══ */
function callGemini(cb){
  var prompt=buildPrompt();var parts=[];
  if(state.imgB64)parts.push({inline_data:{mime_type:state.imgMime,data:state.imgB64}});
  if(state.img2B64)parts.push({inline_data:{mime_type:state.img2Mime,data:state.img2B64}});
  state.multiImgs.forEach(function(m){parts.push({inline_data:{mime_type:m.mime,data:m.b64}})});
  parts.push({text:prompt});
  fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key="+state.gemKey,{
    method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({contents:[{parts:parts}],generationConfig:{responseModalities:["TEXT","IMAGE"]}})
  }).then(function(r){if(!r.ok)throw new Error("API "+r.status);return r.json()})
  .then(function(d){var img=null,txt="";var cp=d.candidates&&d.candidates[0]&&d.candidates[0].content&&d.candidates[0].content.parts;if(cp)cp.forEach(function(p){if(p.inline_data)img="data:"+p.inline_data.mime_type+";base64,"+p.inline_data.data;if(p.text)txt+=p.text});cb(null,{image:img,text:txt})}).catch(function(e){cb(e)});
}

/* ═══ HIGGSFIELD ═══ */
function findHFInput(){
  var sels=['textarea[placeholder*="prompt" i]','textarea[placeholder*="describe" i]','textarea[placeholder*="scene" i]','div[contenteditable="true"]','textarea:not(#lr-panel textarea)'];
  for(var i=0;i<sels.length;i++){try{var els=document.querySelectorAll(sels[i]);for(var j=0;j<els.length;j++){if(els[j].offsetParent!==null&&!els[j].closest('#lr-panel'))return els[j]}}catch(ex){}}return null;
}
function findHFGenerateBtn(){
  var btns=document.querySelectorAll('button');
  for(var i=0;i<btns.length;i++){
    if(btns[i].closest('#lr-panel')||btns[i].id==='lr-toolbar-btn')continue;
    var t=(btns[i].textContent||'').toLowerCase().trim();
    if((t.indexOf('generate')!==-1||t.indexOf('recreate')!==-1)&&btns[i].offsetParent!==null)return btns[i];
  }
  // Also check for submit-type buttons or buttons with specific classes
  for(var i=0;i<btns.length;i++){
    if(btns[i].closest('#lr-panel'))continue;
    if((btns[i].type==='submit'||btns[i].className.indexOf('generate')!==-1||btns[i].className.indexOf('submit')!==-1)&&btns[i].offsetParent!==null)return btns[i];
  }
  return null;
}
function clickHFButton(btn){
  if(!btn)return false;
  // Strategy 1: Simulate full mouse event sequence (most reliable for React)
  var rect=btn.getBoundingClientRect();
  var cx=rect.left+rect.width/2,cy=rect.top+rect.height/2;
  var evts=['pointerdown','mousedown','pointerup','mouseup','click'];
  evts.forEach(function(evName){
    btn.dispatchEvent(new PointerEvent(evName,{bubbles:true,cancelable:true,clientX:cx,clientY:cy,pointerId:1,pointerType:'mouse',view:window}));
  });
  // Strategy 2: Also try focus+enter (keyboard submit)
  setTimeout(function(){btn.focus();btn.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',code:'Enter',bubbles:true}));btn.dispatchEvent(new KeyboardEvent('keyup',{key:'Enter',code:'Enter',bubbles:true}))},100);
  // Strategy 3: Direct click as last resort
  setTimeout(function(){btn.click()},200);
  return true;
}
function enableUnlimited(){
  var all=document.querySelectorAll('span,div,label');
  all.forEach(function(lb){if(lb.closest('#lr-panel'))return;if((lb.textContent||'').trim().toLowerCase()==='unlimited'){var p=lb.parentElement;if(!p)return;var tog=p.querySelector('[role="switch"],input[type="checkbox"],button');if(tog){var on=tog.getAttribute('aria-checked')==='true'||tog.classList.contains('active');if(!on)tog.click()}}});
}
function uploadRefToHF(b64,mime){
  // Find "+" or file input for reference images — additive upload
  var plus=document.querySelectorAll('button,div[role="button"]');
  for(var i=0;i<plus.length;i++){
    if(plus[i].closest('#lr-panel'))continue;
    var t=(plus[i].textContent||'').trim();
    if(t==='+'||t==='Add'){plus[i].click();break}
  }
  setTimeout(function(){
    var inputs=document.querySelectorAll('input[type="file"][accept*="image"]');
    for(var i=0;i<inputs.length;i++){
      if(inputs[i].closest('#lr-panel'))continue;
      var byteStr=atob(b64);var ab=new ArrayBuffer(byteStr.length);var ia=new Uint8Array(ab);
      for(var j=0;j<byteStr.length;j++)ia[j]=byteStr.charCodeAt(j);
      var blob=new Blob([ab],{type:mime});var file=new File([blob],"lr-ref-"+Date.now()+".jpg",{type:mime});
      var dt=new DataTransfer();dt.items.add(file);inputs[i].files=dt.files;
      inputs[i].dispatchEvent(new Event('change',{bubbles:true}));
      return;
    }
  },500);
}
function insertPrompt(text){
  var input=findHFInput();
  if(!input){state.err="Prompt field not found.";render();return false}
  if(input.tagName==='TEXTAREA'||input.tagName==='INPUT'){
    var setter=Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype,'value');
    if(!setter)setter=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value');
    if(setter&&setter.set)setter.set.call(input,text);else input.value=text;
    input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));
  }else{input.focus();var s=window.getSelection(),r=document.createRange();r.selectNodeContents(input);s.removeAllRanges();s.addRange(r);document.execCommand('insertText',false,text)}
  input.focus();state.err="";
  input.style.outline='2px solid #CDFF00';input.style.boxShadow='0 0 20px rgba(205,255,0,0.3)';
  setTimeout(function(){input.style.outline='';input.style.boxShadow=''},1500);
  return true;
}
function insertAndGenerate(text){
  enableUnlimited();
  var at=getAt();if(at&&state.vals.ratio&&state.vals.ratio!=='Auto'){
    var btns=document.querySelectorAll('button,div[role="button"]');btns.forEach(function(b){if(!b.closest('#lr-panel')&&(b.textContent||'').trim()===state.vals.ratio)b.click()});
  }
  setTimeout(function(){
    if(!insertPrompt(text))return;
    // Upload ALL images as references — sequential, additive
    var allImgs=[];
    if(state.imgB64)allImgs.push({b64:state.imgB64,mime:state.imgMime});
    if(state.img2B64)allImgs.push({b64:state.img2B64,mime:state.img2Mime});
    state.multiImgs.forEach(function(m){allImgs.push(m)});
    var delay=300;
    allImgs.forEach(function(img,idx){
      setTimeout(function(){uploadRefToHF(img.b64,img.mime)},delay+idx*800);
    });
    // Click Generate after all uploads
    setTimeout(function(){
      var btn=findHFGenerateBtn();
      if(btn){clickHFButton(btn)}
      else{state.err="Prompt inserted! Click Generate manually.";render()}
    },delay+allImgs.length*800+500);
  },400);
}
function copyText(t){navigator.clipboard.writeText(t).catch(function(){var ta=document.createElement('textarea');ta.value=t;ta.style.cssText='position:fixed;left:-9999px';document.body.appendChild(ta);ta.select();document.execCommand('copy');document.body.removeChild(ta)})}

/* ═══ GALLERY ═══ */
function enableGalleryPicker(){
  document.addEventListener('click',function(e){
    if(!state.galleryMode)return;
    var img=e.target.closest('img');if(!img||img.closest('#lr-panel'))return;
    e.preventDefault();e.stopPropagation();
    fetch(img.src).then(function(r){return r.blob()}).then(function(blob){
      var reader=new FileReader();reader.onload=function(ev){
        state.galleryImg={b64:ev.target.result.split(',')[1],mime:blob.type||'image/jpeg',preview:ev.target.result};
        state.galleryMode=false;document.body.style.cursor='';render()};reader.readAsDataURL(blob);
    }).catch(function(){state.err="Could not load image";state.galleryMode=false;document.body.style.cursor='';render()});
  },true);
}

/* ═══ RENDER ═══ */
function render(){
  var body=$('#lr-body');if(!body)return;body.innerHTML='';
  var am=getAm(),at=getAt(),cl=am?am.cl:"#60A5FA";
  body.style.setProperty('--mc',cl);
  var hdr=$('#lr-header-bc');if(hdr){var bc=[am?am.n:null,at?at.n:null].filter(Boolean);hdr.textContent=bc.length?"/ "+bc.join(" / "):""}
  var bb=$('#lr-back');if(bb)bb.style.display=state.mode?'flex':'none';
  var cb=$('#lr-cfg');if(cb){cb.className='lr-cfg-btn'+(state.gemKey?' connected':'');cb.textContent=state.gemKey?'\u2713':'\u26BF'}
  var cp=$('#lr-config');if(cp)cp.className='lr-config'+(state.showCfg?' open':'');

  // Gallery assign
  if(state.galleryImg){
    body.appendChild(el('div',{style:{padding:'12px',borderRadius:'14px',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',marginBottom:'10px'}},[
      el('div',{style:{fontSize:'13px',fontWeight:'600',color:'#fff',marginBottom:'8px'}},'Add gallery image as:'),
      el('div',{className:'lr-file-preview',style:{marginBottom:'8px'}},[el('img',{src:state.galleryImg.preview,style:{width:'100%',display:'block',borderRadius:'10px'}})]),
      el('button',{className:'lr-select-btn active',style:{width:'100%',marginBottom:'4px',padding:'8px'},onClick:function(){state.imgB64=state.galleryImg.b64;state.imgMime=state.galleryImg.mime;state.galleryImg=null;state.keepImg=true;state.pickTask=true;render()}},'Primary Image'),
      el('button',{className:'lr-select-btn active',style:{width:'100%',marginBottom:'4px',padding:'8px'},onClick:function(){state.img2B64=state.galleryImg.b64;state.img2Mime=state.galleryImg.mime;state.galleryImg=null;state.keepImg=true;state.pickTask=true;render()}},'Secondary Image'),
      el('button',{className:'lr-select-btn active',style:{width:'100%',marginBottom:'4px',padding:'8px'},onClick:function(){state.multiImgs.push({b64:state.galleryImg.b64,mime:state.galleryImg.mime});state.galleryImg=null;state.keepImg=true;state.pickTask=true;render()}},'Add to Multi-Reference'),
      el('button',{className:'lr-copy-btn',style:{width:'100%',padding:'8px'},onClick:function(){state.galleryImg=null;render()}},'Cancel')
    ]));return;
  }

  // After gallery assign: show task picker so image goes directly to chosen task
  if(state.pickTask){
    body.appendChild(el('div',{style:{fontSize:'13px',fontWeight:'600',color:'#fff',marginBottom:'6px',padding:'0 2px'}},'\u2713 Image loaded \u2014 choose task:'));
    // Show thumbnail
    if(state.imgB64){
      body.appendChild(el('div',{style:{width:'60px',height:'60px',borderRadius:'10px',overflow:'hidden',marginBottom:'8px',border:'1px solid rgba(255,255,255,0.1)'}},[
        el('img',{src:'data:'+state.imgMime+';base64,'+state.imgB64,style:{width:'100%',height:'100%',objectFit:'cover'}})]));
    }
    // List ALL tasks from ALL modes
    MODES.forEach(function(m){
      body.appendChild(el('div',{style:{fontSize:'10px',fontWeight:'700',color:m.cl,marginTop:'8px',marginBottom:'4px',padding:'0 2px',letterSpacing:'0.5px'}},m.n.toUpperCase()));
      m.tasks.forEach(function(t){
        body.appendChild(el('button',{className:'lr-list-item',style:{padding:'8px 12px'},onClick:function(){
          state.mode=m.id;state.task=t.id;state.pickTask=false;
          initTask(t);render();
        }},[
          el('div',{style:{fontSize:'12px',fontWeight:'600',color:'#fff'}},t.n),
          el('span',{style:{color:'rgba(255,255,255,0.15)',fontSize:'14px'}},'\u203A')
        ]));
      });
    });
    return;
  }

  if(state.err)body.appendChild(el('div',{className:'lr-error'},[el('span',{},state.err),el('button',{onClick:function(){state.err='';render()}},'x')]));

  // MODES
  if(!state.mode){
    body.appendChild(el('button',{className:'lr-insert-btn',style:{marginBottom:'10px',fontSize:'11px',opacity:state.galleryMode?'1':'0.6'},onClick:function(){state.galleryMode=!state.galleryMode;document.body.style.cursor=state.galleryMode?'crosshair':'';render()}},state.galleryMode?'\u{1F3AF} Click any image..':'\u{1F5BC} Pick from Gallery'));
    var grid=el('div',{className:'lr-modes'});
    MODES.forEach(function(m){grid.appendChild(el('button',{className:'lr-mode-card',onClick:function(){state.mode=m.id;state.task=null;render()}},[el('div',{className:'lr-mode-icon',style:{color:m.cl}},m.ic),el('div',{className:'lr-mode-name'},m.n),el('div',{className:'lr-mode-desc'},m.d),el('div',{className:'lr-mode-count',style:{color:m.cl}},m.tasks.length+(m.tasks.length===1?' task':' tasks'))]))});
    body.appendChild(grid);return;
  }
  // TASKS
  if(state.mode&&!state.task&&am){
    if(am.tasks.length===1){state.task=am.tasks[0].id;initTask(am.tasks[0]);render();return}
    am.tasks.forEach(function(t){body.appendChild(el('button',{className:'lr-list-item',onClick:function(){state.task=t.id;initTask(t);render()}},[el('div',{},[el('div',{className:'lr-list-name'},t.n),el('div',{className:'lr-list-meta'},t.d||'')]),el('span',{style:{color:'rgba(255,255,255,0.2)',fontSize:'16px'}},'\u203A')]))});return;
  }
  // EDITOR
  if(state.task&&at&&!state.showPrev){
    body.appendChild(el('div',{className:'lr-task-header'},[el('div',{className:'lr-task-name',style:{color:cl}},at.n),el('div',{className:'lr-task-desc'},at.d||'')]));
    at.steps.forEach(function(s,i){var step=el('div',{className:'lr-step'});step.appendChild(el('div',{className:'lr-step-num'},'STEP '+(i+1)));step.appendChild(renderStep(s,cl));body.appendChild(step)});
    var prompt=state.jsonMode?buildJsonPrompt():buildPrompt();
    if(prompt){
      // JSON toggle
      body.appendChild(el('div',{style:{display:'flex',alignItems:'center',gap:'8px',margin:'6px 0'}},[
        el('span',{style:{fontSize:'10px',color:'rgba(255,255,255,0.4)'}},'Prompt format:'),
        el('button',{className:'lr-select-btn'+(state.jsonMode?'':' active'),style:{padding:'3px 10px',fontSize:'10px',minWidth:'auto',minHeight:'auto'},onClick:function(){state.jsonMode=false;render()}},'Text'),
        el('button',{className:'lr-select-btn'+(state.jsonMode?' active':''),style:{padding:'3px 10px',fontSize:'10px',minWidth:'auto',minHeight:'auto'},onClick:function(){state.jsonMode=true;render()}},'JSON')
      ]));
      body.appendChild(el('button',{className:'lr-gen-btn',onClick:function(){insertAndGenerate(prompt)}},'\u{1F680} Insert & Generate (Unlimited)'));
      body.appendChild(el('button',{className:'lr-insert-btn',onClick:function(){insertPrompt(prompt)}},'Insert Prompt Only'));
      body.appendChild(el('div',{className:'lr-prompt-box'},[el('div',{className:'lr-prompt-header'},[el('span',{className:'lr-prompt-title'},state.jsonMode?'JSON PROMPT':'NBP PROMPT'),el('button',{className:'lr-copy-btn',onClick:function(){copyText(prompt);this.textContent='Copied!';var s=this;setTimeout(function(){s.textContent='Copy'},2000)}},'Copy')]),el('div',{className:'lr-prompt-pre'},prompt)]));
    }
    body.appendChild(el('button',{className:'lr-insert-btn',disabled:state.isGen?'true':null,style:{opacity:'0.45',fontSize:'11px',marginTop:'4px'},onClick:function(){if(!state.gemKey){state.err="Enter Gemini API key";state.showCfg=true;render();return}if(!state.imgB64&&!state.multiImgs.length){state.err="Upload image first";render();return}state.isGen=true;state.err="";render();callGemini(function(err,res){state.isGen=false;if(err){state.err=err.message;render();return}if(res.image)state.prev=res.image;if(res.text)state.gemTxt=res.text;if(res.image||res.text)state.showPrev=true;else state.err="No result.";render()})}},state.isGen?'Generating...':'Gemini Preview (optional)'));
    return;
  }
  // PREVIEW
  if(state.task&&state.showPrev){
    if(state.prev)body.appendChild(el('div',{className:'lr-preview-img'},[el('img',{src:state.prev,style:{width:'100%',borderRadius:'10px'}})]));
    var prompt=state.jsonMode?buildJsonPrompt():buildPrompt();
    body.appendChild(el('button',{className:'lr-gen-btn',style:{marginTop:'8px'},onClick:function(){insertAndGenerate(prompt)}},'\u{1F680} Insert & Generate'));
    body.appendChild(el('button',{className:'lr-list-item',style:{marginTop:'6px',justifyContent:'center'},onClick:function(){state.showPrev=false;render()}},'Back'));
  }
}

function initTask(t){
  var v={};t.steps.forEach(function(s){
    if(s.t==="slider")v[s.id]=s.df!=null?s.df:(s.mn||0);
    else if(s.t==="select")v[s.id]=s.df||(s.opts?s.opts[0]:"");
    else if(s.t==="toggle")v[s.id]=s.df!=null?s.df:false;
    else if(s.t==="color")v[s.id]=s.df||"#FFFFFF";
    else if(s.t==="prompt")v[s.id]="";else if(s.t==="tags")v[s.id]=[];
    else if(s.t==="direction")v[s.id]="";else if(s.t==="grid3d")v[s.id]="center";
    else v[s.id]=null;
  });state.vals=v;state.prev=null;state.gemTxt="";state.showPrev=false;
  if(!state.keepImg){state.imgB64=null;state.img2B64=null;state.multiImgs=[]}
  state.keepImg=false;state.gridPos={x:0,y:0,rawX:0.5,rawY:0.7};
}

/* ═══ RENDER STEP ═══ */
function renderStep(s,cl){
  var wrap=el('div'),v=state.vals[s.id];
  if(s.t==="file"){
    wrap.appendChild(el('div',{className:'lr-step-label'},s.l+(s.rq?' *':'')));
    var fi=el('input',{type:'file',accept:'image/*',style:{display:'none'}});
    fi.addEventListener('change',function(e){var f=e.target.files&&e.target.files[0];if(!f)return;var r=new FileReader();r.onload=function(ev){state.imgB64=ev.target.result.split(',')[1];state.imgMime=f.type;render()};r.readAsDataURL(f)});wrap.appendChild(fi);
    if(state.imgB64)wrap.appendChild(el('div',{className:'lr-file-preview',style:{border:'1px solid '+cl+'20'}},[el('img',{src:'data:'+state.imgMime+';base64,'+state.imgB64,style:{width:'100%',display:'block'}}),el('button',{className:'lr-file-remove',onClick:function(){state.imgB64=null;render()}},'x')]));
    else wrap.appendChild(el('button',{className:'lr-file-btn',style:{borderColor:cl+'30',color:cl},onClick:function(){fi.click()}},'Upload'));
  }
  else if(s.t==="file2"){
    wrap.appendChild(el('div',{className:'lr-step-label'},s.l+(s.rq?' *':'')));
    var fi2=el('input',{type:'file',accept:'image/*',style:{display:'none'}});
    fi2.addEventListener('change',function(e){var f=e.target.files&&e.target.files[0];if(!f)return;var r=new FileReader();r.onload=function(ev){state.img2B64=ev.target.result.split(',')[1];state.img2Mime=f.type;render()};r.readAsDataURL(f)});wrap.appendChild(fi2);
    if(state.img2B64)wrap.appendChild(el('div',{className:'lr-file-preview',style:{border:'1px solid '+cl+'20'}},[el('img',{src:'data:'+state.img2Mime+';base64,'+state.img2B64,style:{width:'100%',display:'block'}}),el('button',{className:'lr-file-remove',onClick:function(){state.img2B64=null;render()}},'x')]));
    else wrap.appendChild(el('button',{className:'lr-file-btn',style:{borderColor:cl+'30',color:cl},onClick:function(){fi2.click()}},'Upload'));
  }
  else if(s.t==="multifile"){
    wrap.appendChild(el('div',{className:'lr-step-label'},s.l+(s.rq?' *':'')));
    var fi3=el('input',{type:'file',accept:'image/*',multiple:'true',style:{display:'none'}});
    fi3.addEventListener('change',function(e){
      var files=e.target.files;if(!files)return;
      for(var k=0;k<files.length&&state.multiImgs.length<(s.mx||10);k++){
        (function(f){var r=new FileReader();r.onload=function(ev){state.multiImgs.push({b64:ev.target.result.split(',')[1],mime:f.type});render()};r.readAsDataURL(f)})(files[k]);
      }
    });wrap.appendChild(fi3);
    // Show thumbs
    if(state.multiImgs.length>0){
      var thumbRow=el('div',{style:{display:'flex',flexWrap:'wrap',gap:'6px',marginBottom:'6px'}});
      state.multiImgs.forEach(function(m,idx){
        thumbRow.appendChild(el('div',{style:{position:'relative',width:'50px',height:'50px',borderRadius:'8px',overflow:'hidden',border:'1px solid '+cl+'30'}},[
          el('img',{src:'data:'+m.mime+';base64,'+m.b64,style:{width:'100%',height:'100%',objectFit:'cover'}}),
          el('button',{style:{position:'absolute',top:'-2px',right:'-2px',width:'16px',height:'16px',borderRadius:'50%',background:'#FF5F57',border:'none',color:'#fff',fontSize:'9px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',padding:'0',minWidth:'auto',minHeight:'auto'},onClick:function(){state.multiImgs.splice(idx,1);render()}},'x')
        ]));
      });
      wrap.appendChild(thumbRow);
    }
    wrap.appendChild(el('div',{style:{display:'flex',gap:'6px'}},[
      el('button',{className:'lr-file-btn',style:{borderColor:cl+'30',color:cl,flex:'1'},onClick:function(){fi3.click()}},'+ Add ('+(state.multiImgs.length)+'/'+(s.mx||10)+')'),
      state.multiImgs.length>0?el('button',{className:'lr-file-btn',style:{borderColor:'#FF5F5730',color:'#FF5F57',width:'auto',padding:'0 12px'},onClick:function(){state.multiImgs=[];render()}},'Clear'):null
    ]));
  }
  else if(s.t==="slider"){
    var mn=s.mn!=null?s.mn:0,mx=s.mx!=null?s.mx:100,st=s.st||(mx-mn>10?1:0.1),pct=((v-mn)/(mx-mn))*100;
    wrap.appendChild(el('div',{className:'lr-slider-row'},[el('span',{className:'lr-step-label',style:{margin:'0'}},s.l),el('span',{className:'lr-slider-val'},(typeof v==='number'?(Number.isInteger(st)?''+v:v.toFixed(1)):''+v)+(s.u||''))]));
    var track=el('div',{className:'lr-slider-wrap'},[el('div',{className:'lr-slider-track'}),el('div',{className:'lr-slider-fill',style:{width:pct+'%',background:cl}}),el('div',{className:'lr-slider-thumb',style:{left:'calc('+pct+'% - 8px)',background:cl}})]);
    var inp=el('input',{type:'range',min:''+mn,max:''+mx,step:''+st,value:''+v,className:'lr-slider-input'});
    inp.addEventListener('input',function(e){state.vals[s.id]=parseFloat(e.target.value);render()});track.appendChild(inp);wrap.appendChild(track);
  }
  else if(s.t==="select"){
    wrap.appendChild(el('div',{className:'lr-step-label'},s.l));
    var sw=el('div',{className:'lr-select-wrap'});
    (s.opts||[]).forEach(function(o){var b=el('button',{className:'lr-select-btn'+(v===o?' active':''),onClick:function(){state.vals[s.id]=o;render()}},o);b.style.setProperty('--mc',cl);sw.appendChild(b)});wrap.appendChild(sw);
  }
  else if(s.t==="toggle"){
    var row=el('div',{className:'lr-toggle-row'});
    row.appendChild(el('span',{className:'lr-step-label',style:{margin:'0',fontWeight:'600',color:v?cl:'rgba(255,255,255,0.55)'}},s.l));
    row.appendChild(el('button',{className:'lr-toggle-switch',style:{background:v?cl:'rgba(255,255,255,0.12)'},onClick:function(){state.vals[s.id]=!v;render()}},[el('div',{className:'lr-toggle-knob',style:{left:v?'20px':'3px'}})]));wrap.appendChild(row);
  }
  else if(s.t==="color"){
    wrap.appendChild(el('div',{className:'lr-step-label'},s.l));
    var ci=el('input',{type:'color',value:v||'#FFFFFF',className:'lr-color-input'});
    ci.addEventListener('input',function(e){state.vals[s.id]=e.target.value;render()});
    wrap.appendChild(el('div',{className:'lr-color-row'},[ci,el('span',{className:'lr-color-hex'},v)]));
  }
  else if(s.t==="prompt"){
    wrap.appendChild(el('div',{className:'lr-step-label'},s.l));
    var ta=el('textarea',{className:'lr-textarea',placeholder:s.ph||'Enter instructions...'});
    ta.value=v||'';ta.addEventListener('input',function(e){state.vals[s.id]=e.target.value});wrap.appendChild(ta);
  }
  else if(s.t==="tags"){
    var sel=Array.isArray(v)?v:[];
    wrap.appendChild(el('div',{className:'lr-step-label'},s.l));
    var ow=el('div',{className:'lr-select-wrap'});
    (s.opts||[]).forEach(function(o){var isA=sel.indexOf(o)!==-1;ow.appendChild(el('button',{className:'lr-select-btn'+(isA?' active':''),onClick:function(){var arr=(state.vals[s.id]||[]).slice();var idx=arr.indexOf(o);if(idx===-1)arr.push(o);else arr.splice(idx,1);state.vals[s.id]=arr;render()}},(isA?'\u2713 ':'')+o))});wrap.appendChild(ow);
    if(sel.length>0){var tb=el('div',{style:{display:'flex',flexWrap:'wrap',gap:'5px',marginTop:'8px',padding:'8px 10px',borderRadius:'10px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.06)'}});sel.forEach(function(tag){tb.appendChild(el('div',{style:{display:'flex',alignItems:'center',gap:'5px',padding:'4px 8px 4px 10px',borderRadius:'8px',background:cl+'20',color:cl,fontSize:'10px',fontWeight:'600'}},[el('span',{},tag),el('button',{style:{background:'none',border:'none',color:cl,cursor:'pointer',fontSize:'12px',padding:'0',lineHeight:'1',minWidth:'auto',minHeight:'auto'},onClick:function(){var arr=state.vals[s.id].slice();arr.splice(arr.indexOf(tag),1);state.vals[s.id]=arr;render()}},'\u00D7')]))});wrap.appendChild(tb)}
  }
  else if(s.t==="direction"){
    wrap.appendChild(el('div',{className:'lr-step-label'},s.l));
    var dirs=[{id:"left",lb:"\u2190",x:0,y:1},{id:"right",lb:"\u2192",x:2,y:1},{id:"up",lb:"\u2191",x:1,y:0},{id:"down",lb:"\u2193",x:1,y:2},{id:"left-up",lb:"\u2196",x:0,y:0},{id:"right-up",lb:"\u2197",x:2,y:0},{id:"left-down",lb:"\u2199",x:0,y:2},{id:"right-down",lb:"\u2198",x:2,y:2}];
    var dg=el('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'4px',width:'160px',margin:'0 auto'}});
    for(var gi=0;gi<9;gi++){var gx=gi%3,gy=Math.floor(gi/3);if(gx===1&&gy===1)dg.appendChild(el('div',{style:{width:'48px',height:'48px',borderRadius:'8px',background:cl+'20',border:'2px solid '+cl+'40',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'9px',color:cl,fontWeight:'700'}},'IMG'));else{var dir=dirs.find(function(d){return d.x===gx&&d.y===gy});if(dir)(function(d){var isA=v===d.id;dg.appendChild(el('button',{style:{width:'48px',height:'48px',borderRadius:'8px',border:isA?'2px solid '+cl:'1px solid rgba(255,255,255,0.08)',background:isA?cl+'20':'rgba(255,255,255,0.04)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',padding:'0',minWidth:'auto',minHeight:'auto',color:isA?cl:'rgba(255,255,255,0.5)',fontSize:'18px'},onClick:function(){state.vals[s.id]=d.id;render()}},d.lb))})(dir);else dg.appendChild(el('div',{style:{width:'48px',height:'48px'}}))}
    }wrap.appendChild(dg);
    if(v)wrap.appendChild(el('div',{style:{textAlign:'center',marginTop:'6px',fontSize:'10px',color:cl,fontWeight:'600'}},'Extending: '+v.toUpperCase()));
  }
  else if(s.t==="grid3d"){
    wrap.appendChild(el('div',{className:'lr-step-label'},s.l));
    if(!state.imgB64){wrap.appendChild(el('div',{style:{fontSize:'10px',color:'rgba(255,255,255,0.3)',padding:'12px',textAlign:'center'}},'Upload scene image first'));return wrap}
    var gw=el('div',{style:{position:'relative',borderRadius:'12px',overflow:'hidden',border:'1px solid rgba(255,255,255,0.1)',cursor:'crosshair',touchAction:'none'}});
    gw.appendChild(el('img',{src:'data:'+state.imgMime+';base64,'+state.imgB64,style:{width:'100%',display:'block',opacity:'0.65'}}));
    var svgNS="http://www.w3.org/2000/svg",svg=document.createElementNS(svgNS,"svg");
    svg.setAttribute("viewBox","0 0 400 220");svg.style.cssText="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none";
    var W=400,H=220,BI=[140,75],BO=[260,75],BD=[260,145],BC=[140,145];
    function ln(x1,y1,x2,y2,op,sw){var l=document.createElementNS(svgNS,"line");l.setAttribute("x1",""+x1);l.setAttribute("y1",""+y1);l.setAttribute("x2",""+x2);l.setAttribute("y2",""+y2);l.setAttribute("stroke","rgba(255,255,255,"+(op||0.18)+")");l.setAttribute("stroke-width",""+(sw||0.5));svg.appendChild(l)}
    var N=10;
    for(var i=0;i<=N;i++){var t=i/N;
      ln(0+(BC[0]-0)*t,H+(BC[1]-H)*t,W+(BD[0]-W)*t,H+(BD[1]-H)*t,0.18,0.4);
      ln((W*t),H,BC[0]+(BD[0]-BC[0])*t,BC[1],0.12,0.35);
      ln(0+(BI[0]-0)*t,0+(BI[1]-0)*t,W+(BO[0]-W)*t,0+(BO[1]-0)*t,0.12,0.35);
      ln(W*t,0,BI[0]+(BO[0]-BI[0])*t,BI[1],0.08,0.3);
      ln(0+(BI[0]-0)*t,0+(BI[1]-0)*t,0+(BC[0]-0)*t,H+(BC[1]-H)*t,0.12,0.35);
      ln(0,H*t,BI[0],BI[1]+(BC[1]-BI[1])*t,0.08,0.3);
      ln(W+(BO[0]-W)*t,0+(BO[1]-0)*t,W+(BD[0]-W)*t,H+(BD[1]-H)*t,0.12,0.35);
      ln(W,H*t,BO[0],BO[1]+(BD[1]-BO[1])*t,0.08,0.3);
      ln(BI[0],BI[1]+(BC[1]-BI[1])*t,BO[0],BO[1]+(BD[1]-BO[1])*t,0.15,0.35);
      ln(BI[0]+(BO[0]-BI[0])*t,BI[1],BI[0]+(BO[0]-BI[0])*t,BC[1],0.15,0.35);
    }
    ln(0,0,BI[0],BI[1],0.35,0.8);ln(W,0,BO[0],BO[1],0.35,0.8);ln(0,H,BC[0],BC[1],0.35,0.8);ln(W,H,BD[0],BD[1],0.35,0.8);
    var rawX=state.gridPos.rawX!=null?state.gridPos.rawX:0.5,rawY=state.gridPos.rawY!=null?state.gridPos.rawY:0.7;
    var ptX=rawX*W,ptY=rawY*H;
    var c=document.createElementNS(svgNS,"circle");c.setAttribute("cx",""+ptX);c.setAttribute("cy",""+ptY);c.setAttribute("r","6");c.setAttribute("fill",cl);c.setAttribute("stroke","#fff");c.setAttribute("stroke-width","2");c.style.filter="drop-shadow(0 0 8px "+cl+")";svg.appendChild(c);
    ln(ptX-14,ptY,ptX+14,ptY,0.5,0.6);ln(ptX,ptY-14,ptX,ptY+14,0.5,0.6);
    gw.appendChild(svg);
    var ov=el('div',{style:{position:'absolute',top:'0',left:'0',width:'100%',height:'100%',cursor:'crosshair',zIndex:'2',touchAction:'none'}});
    function gp(e){var rect=ov.getBoundingClientRect();var cx=e.clientX||((e.touches&&e.touches[0])?e.touches[0].clientX:0);var cy=e.clientY||((e.touches&&e.touches[0])?e.touches[0].clientY:0);var rx=Math.max(0,Math.min(1,(cx-rect.left)/rect.width));var ry=Math.max(0,Math.min(1,(cy-rect.top)/rect.height));state.gridPos={rawX:rx,rawY:ry,x:Math.round((rx-0.5)*20),y:Math.round((0.5-ry)*16)};render()}
    var dr=false;
    ov.addEventListener('mousedown',function(e){e.preventDefault();dr=true;gp(e)});
    ov.addEventListener('mousemove',function(e){if(dr){e.preventDefault();gp(e)}});
    ov.addEventListener('mouseup',function(){dr=false});ov.addEventListener('mouseleave',function(){dr=false});
    ov.addEventListener('touchstart',function(e){e.preventDefault();e.stopPropagation();dr=true;gp(e)},{passive:false});
    ov.addEventListener('touchmove',function(e){e.preventDefault();e.stopPropagation();if(dr)gp(e)},{passive:false});
    ov.addEventListener('touchend',function(e){e.preventDefault();dr=false},{passive:false});
    gw.appendChild(ov);wrap.appendChild(gw);
    wrap.appendChild(el('div',{style:{display:'flex',justifyContent:'center',gap:'12px',marginTop:'6px'}},[
      el('span',{style:{fontSize:'10px',color:cl,fontWeight:'600',fontFamily:'monospace'}},'X:'+state.gridPos.x),
      el('span',{style:{fontSize:'10px',color:cl,fontWeight:'600',fontFamily:'monospace'}},'Y:'+state.gridPos.y),
      el('button',{style:{fontSize:'9px',color:'rgba(255,255,255,0.4)',background:'rgba(255,255,255,0.06)',border:'none',borderRadius:'4px',padding:'2px 8px',cursor:'pointer',minWidth:'auto',minHeight:'auto'},onClick:function(){state.gridPos={x:0,y:0,rawX:0.5,rawY:0.7};render()}},'Reset')]));
  }
  return wrap;
}

/* ═══ NAV ═══ */
function goBack(){
  if(state.showPrev){state.showPrev=false;render();return}
  if(state.task){state.task=null;state.prev=null;state.showPrev=false;state.imgB64=null;state.img2B64=null;state.multiImgs=[];render();return}
  if(state.mode){state.mode=null;state.task=null;render();return}
}

/* ═══ TOOLBAR ═══ */
function injectToolbarButton(){
  function tryInject(){
    if(document.getElementById('lr-toolbar-btn'))return true;
    var all=document.querySelectorAll('button');
    // Strategy 1: Find Draw button in bottom bar
    var target=null,method='after';
    for(var i=0;i<all.length;i++){
      if(all[i].closest('#lr-panel'))continue;
      var t=(all[i].textContent||'').trim().toLowerCase();
      // Match Draw, Unlimited, Save Prompt, Insert Prompt
      if(!target&&t.indexOf('draw')!==-1&&all[i].offsetParent!==null){target=all[i];method='after';break}
    }
    // Strategy 2: Find Save Prompt / Insert Prompt area
    if(!target){
      for(var i=0;i<all.length;i++){
        if(all[i].closest('#lr-panel'))continue;
        var t2=(all[i].textContent||'').trim().toLowerCase();
        if((t2.indexOf('save prompt')!==-1||t2.indexOf('insert prompt')!==-1)&&all[i].offsetParent!==null){target=all[i];method='before-container';break}
      }
    }
    // Strategy 3: Find the bottom toolbar container by looking for Nano Banana / model selector area
    if(!target){
      var divs=document.querySelectorAll('div');
      for(var i=0;i<divs.length;i++){
        var txt=(divs[i].textContent||'').toLowerCase();
        if(txt.indexOf('nano banana')!==-1&&txt.indexOf('draw')!==-1&&divs[i].offsetParent!==null){
          // Found the toolbar area, look for last button
          var btns=divs[i].querySelectorAll('button');
          if(btns.length>0){target=btns[btns.length-1];method='after';break}
        }
      }
    }
    if(!target)return false;
    var b=document.createElement('button');b.id='lr-toolbar-btn';b.textContent='\u{1F680} LR';
    if(method==='after'){
      var cs=window.getComputedStyle(target);
      b.style.cssText='display:inline-flex !important;align-items:center !important;justify-content:center !important;gap:4px !important;padding:'+cs.paddingTop+' '+cs.paddingRight+' '+cs.paddingBottom+' '+cs.paddingLeft+' !important;background:rgba(120,120,140,0.5) !important;border:1px solid rgba(255,255,255,0.15) !important;border-radius:'+cs.borderRadius+' !important;color:#fff !important;font-size:'+cs.fontSize+' !important;font-weight:600 !important;cursor:pointer !important;height:'+cs.height+' !important;margin-left:8px !important;min-width:auto !important;min-height:auto !important;font-family:system-ui !important;';
      var p=target.parentElement;
      if(p&&!p.querySelector('#lr-toolbar-btn')){
        if(target.nextSibling)p.insertBefore(b,target.nextSibling);else p.appendChild(b);
      }
    }else{
      var container=target.parentElement;
      if(container&&!container.querySelector('#lr-toolbar-btn')){
        b.style.cssText='display:flex !important;align-items:center !important;justify-content:center !important;gap:8px !important;width:100% !important;padding:10px 16px !important;background:rgba(120,120,140,0.4) !important;border:1px solid rgba(255,255,255,0.12) !important;border-radius:12px !important;color:#fff !important;font-size:14px !important;font-weight:700 !important;cursor:pointer !important;min-height:42px !important;margin-bottom:6px !important;box-sizing:border-box !important;font-family:system-ui !important;';
        container.insertBefore(b,container.firstChild);
      }
    }
    b.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();state.open=!state.open;var pnl=document.getElementById('lr-panel');if(pnl)pnl.className=state.open?'open':''});
    return true;
  }
  // Try immediately, then retry every 2s for 2 minutes
  if(!tryInject()){
    var retryCount=0;
    var retryInterval=setInterval(function(){
      retryCount++;
      if(tryInject()||retryCount>60){clearInterval(retryInterval)}
    },2000);
  }
  // Also watch for DOM changes
  var obs=new MutationObserver(function(){tryInject()});
  obs.observe(document.body,{childList:true,subtree:true});
  setTimeout(function(){obs.disconnect()},120000);
}

/* ═══ INIT ═══ */
function init(){
  if(chrome.storage)chrome.storage.local.get(['lr_gemini_key'],function(r){if(r.lr_gemini_key)state.gemKey=r.lr_gemini_key});
  var panel=el('div',{id:'lr-panel'});
  // macOS dots
  var dots=el('div',{style:{display:'flex',gap:'7px',padding:'10px 14px 2px 14px',alignItems:'center'}});
  function mkDot(color,hoverIcon,title,onClick){
    var d=el('div',{style:{width:'13px',height:'13px',borderRadius:'50%',background:color,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'8px',color:'transparent',fontWeight:'900',transition:'all 0.15s',border:'0.5px solid rgba(0,0,0,0.2)'},onClick:onClick});
    d.title=title;
    d.addEventListener('mouseenter',function(){d.style.color='rgba(0,0,0,0.6)'});
    d.addEventListener('mouseleave',function(){d.style.color='transparent'});
    d.textContent=hoverIcon;return d;
  }
  dots.appendChild(mkDot('#FF5F57','\u2715','Close',function(){state.open=false;panel.className=''}));
  dots.appendChild(mkDot('#FFBD2E','\u2212','Minimize',function(){state.open=false;panel.className=''}));
  dots.appendChild(mkDot('#28C840','\u2795','Enlarge +50%',function(){panel.classList.toggle('lr-large')}));
  panel.appendChild(dots);
  panel.appendChild(el('div',{className:'lr-header'},[
    el('button',{id:'lr-back',className:'lr-back-btn',style:{display:'none'},onClick:goBack},'\u2039'),
    el('div',{style:{flex:'1'}},[el('div',{id:'lr-title',className:'lr-header-title'},'LuminaRetouch'),el('div',{id:'lr-header-bc',className:'lr-header-bc'})]),
    el('button',{id:'lr-cfg',className:'lr-cfg-btn',onClick:function(){state.showCfg=!state.showCfg;render()}},'\u26BF')
  ]));
  var config=el('div',{id:'lr-config',className:'lr-config'});
  config.appendChild(el('label',{},'Gemini API Key'));
  var ki=el('input',{id:'lr-gem-key',type:'password',placeholder:'AIzaSy...'});
  ki.addEventListener('input',function(e){state.gemKey=e.target.value.trim();if(chrome.storage)chrome.storage.local.set({lr_gemini_key:state.gemKey});render()});
  config.appendChild(ki);config.appendChild(el('div',{className:'lr-hint'},'Optional'));
  panel.appendChild(config);panel.appendChild(el('div',{id:'lr-body',className:'lr-body'}));
  document.body.appendChild(panel);render();injectToolbarButton();enableGalleryPicker();
}
if(document.readyState==='complete'||document.readyState==='interactive')setTimeout(init,500);
else document.addEventListener('DOMContentLoaded',function(){setTimeout(init,500)});
})();
