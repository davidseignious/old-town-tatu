/*
  VERAMOR beta browser config. The Supabase publishable key is intended for client-side use;
  database security is enforced with Row Level Security.
*/
const CONFIG={
  supabaseUrl:'https://rfcoworvfqcqallgpozn.supabase.co',
  supabaseAnonKey:'sb_publishable_Sa1IwBa9gr7NylS_EMjpnA_5j1HT5LF'
};
const backendReady=!CONFIG.supabaseUrl.startsWith('__')&&!CONFIG.supabaseAnonKey.startsWith('__');
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const state={session:null,user:null,profile:null,profiles:[],matches:[],currentProfile:null,currentMatch:null,cameraStream:null,presenceStream:null,photoBlob:null,presenceBlob:null,authMode:'signup',poll:null};
const prompts=['What made you smile this week?','What is one thing you are genuinely excited about right now?','What is a small kindness you noticed recently?','What is your ideal low-key first date?','Tell us one thing your friends tease you about.'];
$('#presencePrompt').textContent=prompts[Math.floor(Math.random()*prompts.length)];

function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2600)}
function show(id){$$('.screen').forEach(x=>x.classList.remove('active'));$('#'+id).classList.add('active');const logged=['discover','matches','profile'].includes(id);$('#nav').classList.toggle('show',logged);$$('#nav button[data-go]').forEach(b=>b.classList.toggle('active',b.dataset.go===id));window.scrollTo({top:0,behavior:'smooth'});if(id==='discover')loadDiscover();if(id==='matches')loadMatches();if(id==='profile')renderMyProfile()}
function openModal(id){$('#'+id).classList.add('show')} function closeModal(id){$('#'+id).classList.remove('show')}
$$('[data-close]').forEach(b=>b.onclick=()=>closeModal(b.dataset.close));$('#safetyBtn').onclick=$('#navSafety').onclick=()=>openModal('safetyModal');
$$('#nav button[data-go]').forEach(b=>b.onclick=()=>show(b.dataset.go));
function age(d){const b=new Date(d),n=new Date();let a=n.getFullYear()-b.getFullYear();const m=n.getMonth()-b.getMonth();if(m<0||(m===0&&n.getDate()<b.getDate()))a--;return a}
function esc(s=''){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function initials(n='V'){return n.split(/\s+/).map(x=>x[0]).join('').slice(0,2).toUpperCase()}
function bannedText(t=''){return /(onlyfans|fansly|escort|cash\s?app|venmo me|telegram|whatsapp me|premium snap|snap premium|buy content|subscribe to my|link in bio|https?:\/\/|www\.)/i.test(t)}
function likesKey(){return 'veramor_likes_'+new Date().toISOString().slice(0,10)}
function localLikes(){return JSON.parse(localStorage.getItem(likesKey())||'[]')}
function setModeBanner(){const b=$('#modeBanner');if(!backendReady){b.className='banner show';b.innerHTML='<b>Preview mode:</b> this deployment is not yet bound to Supabase. Actions persist only on this device and demo profiles are clearly labeled.'}else{b.className='banner';b.textContent=''}} setModeBanner();

async function sb(path,{method='GET',body,headers={},auth=true,raw=false}={}){
  const h={'apikey':CONFIG.supabaseAnonKey,...headers};
  if(!raw)h['Content-Type']='application/json';
  if(auth&&state.session?.access_token)h['Authorization']='Bearer '+state.session.access_token;
  const r=await fetch(CONFIG.supabaseUrl+path,{method,headers:h,body:body?(raw?body:JSON.stringify(body)):undefined});
  const text=await r.text();let data=null;try{data=text?JSON.parse(text):null}catch{data=text}
  if(!r.ok)throw new Error(data?.message||data?.error_description||data?.hint||data?.details||data||('Request failed '+r.status));return data;
}
function saveSession(){if(state.session)localStorage.setItem('veramor_session',JSON.stringify(state.session));else localStorage.removeItem('veramor_session')}
async function refreshSession(){if(!backendReady)return;const saved=JSON.parse(localStorage.getItem('veramor_session')||'null');if(!saved)return;state.session=saved;try{const u=await sb('/auth/v1/user');state.user=u;await loadOwnProfile();}catch(e){state.session=null;saveSession()}}
async function authSignup(email,password,birthdate){
  if(age(birthdate)<18)throw new Error('VERAMOR is 18+ only.');
  if(!backendReady){state.user={id:'local-'+Date.now(),email};state.session={access_token:'preview'};localStorage.setItem('veramor_preview_user',JSON.stringify({id:state.user.id,email,birthdate}));return}
  const d=await sb('/auth/v1/signup',{method:'POST',auth:false,body:{email,password,data:{birthdate}}});
  if(!d.session){throw new Error('Account created. Check your email to confirm it, then sign in.')}state.session=d.session;state.user=d.user;saveSession();
}
async function authLogin(email,password){
  if(!backendReady){const u=JSON.parse(localStorage.getItem('veramor_preview_user')||'null');if(!u||u.email!==email)throw new Error('No preview account found on this device.');state.user=u;state.session={access_token:'preview'};return}
  const d=await sb('/auth/v1/token?grant_type=password',{method:'POST',auth:false,body:{email,password}});state.session=d;state.user=d.user;saveSession();
}
async function loadOwnProfile(){
  if(!state.user)return null;
  if(!backendReady){state.profile=JSON.parse(localStorage.getItem('veramor_profile')||'null');return state.profile}
  const rows=await sb('/rest/v1/profiles?id=eq.'+encodeURIComponent(state.user.id)+'&select=*');state.profile=rows?.[0]||null;return state.profile;
}
async function uploadMedia(blob,kind){
  if(!backendReady){return await new Promise((res,rej)=>{const fr=new FileReader();fr.onload=()=>res(fr.result);fr.onerror=rej;fr.readAsDataURL(blob)})}
  const ext=kind==='avatar'?'jpg':'webm', path=`${state.user.id}/${kind}-${Date.now()}.${ext}`;
  const bucket=kind==='avatar'?'profile-media':'verification-media';await sb('/storage/v1/object/'+bucket+'/'+path,{method:'POST',body:blob,raw:true,headers:{'Content-Type':blob.type,'x-upsert':'true'}});return path;
}
async function mediaUrl(path){
  if(!path)return null;if(!backendReady||path.startsWith('data:'))return path;
  try{const r=await fetch(CONFIG.supabaseUrl+'/storage/v1/object/authenticated/profile-media/'+path,{headers:{apikey:CONFIG.supabaseAnonKey,Authorization:'Bearer '+state.session.access_token}});if(!r.ok)return null;return URL.createObjectURL(await r.blob())}catch{return null}
}
async function saveProfile(p){
  if(!backendReady){localStorage.setItem('veramor_profile',JSON.stringify(p));state.profile=p;return}
  const rows=await sb('/rest/v1/profiles?on_conflict=id',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=representation'},body:p});state.profile=rows?.[0]||p;
  await sb('/rest/v1/user_settings?on_conflict=user_id',{method:'POST',headers:{Prefer:'resolution=merge-duplicates'},body:{user_id:state.user.id}}).catch(()=>{});
}

$('#startSignup').onclick=()=>{state.authMode='signup';$('#authTitle').textContent='Create your account';$('#dobLabel').style.display='grid';$('#authNote').textContent='You must be at least 18. Your birthdate is used to enforce age eligibility.';show('auth')};
$('#startLogin').onclick=()=>{state.authMode='login';$('#authTitle').textContent='Welcome back';$('#dobLabel').style.display='none';$('#authNote').textContent='Sign in with the email and password you used for VERAMOR.';show('auth')};
$('#authBack').onclick=()=>show('welcome');
$('#authSubmit').onclick=async()=>{const email=$('#email').value.trim(),password=$('#password').value,birth=$('#birthdate').value;if(!email||password.length<8)return toast('Enter a valid email and an 8+ character password.');try{if(state.authMode==='signup'){if(!birth)return toast('Enter your date of birth.');await authSignup(email,password,birth)}else await authLogin(email,password);await loadOwnProfile();if(state.profile?.profile_status==='active')show('discover');else show('onboarding')}catch(e){toast(e.message)}};
