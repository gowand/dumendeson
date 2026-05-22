const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const { v4: uuid } = require('uuid');

const app = express();
process.on('unhandledRejection', err => console.error('UNHANDLED_REJECTION', err));
process.on('uncaughtException', err => console.error('UNCAUGHT_EXCEPTION', err));
const PORT = process.env.PORT || 3000;
const DATA = path.join(__dirname, 'data');
if (!fs.existsSync(DATA)) fs.mkdirSync(DATA);
const file = n => path.join(DATA, n + '.json');
const read = n => fs.existsSync(file(n)) ? JSON.parse(fs.readFileSync(file(n),'utf8')) : [];
const write = (n,d) => fs.writeFileSync(file(n), JSON.stringify(d,null,2));
const hash = p => bcrypt.hashSync(p, 10);

function seed(){
  if (fs.existsSync(file('seeded'))) return;
  const users = [
    {id:'u1', name:'Süper Admin', email:'admin@ktb.gov.tr', password:hash('123456'), role:'SUPER_ADMIN', tc:'00000000000', points:0, level:1, avatar:'🛡️'},
    {id:'u2', name:'Adıyaman İl Admin', email:'iladmin@ktb.gov.tr', password:hash('123456'), role:'IL_ADMIN', city:'Adıyaman', tc:'11111111111', points:0, level:1, avatar:'🏛️'},
    {id:'u3', name:'Gerger Kütüphane Admini', email:'gerger@ktb.gov.tr', password:hash('123456'), role:'LIBRARY_ADMIN', libraryId:'lib-gerger', tc:'22222222222', points:0, level:1, avatar:'📚'},
    {id:'u4', name:'Kahta Kütüphane Admini', email:'kahta@ktb.gov.tr', password:hash('123456'), role:'LIBRARY_ADMIN', libraryId:'lib-kahta', tc:'33333333333', points:0, level:1, avatar:'📚'},
    {id:'u5', name:'Sincik Kütüphane Admini', email:'sincik@ktb.gov.tr', password:hash('123456'), role:'LIBRARY_ADMIN', libraryId:'lib-sincik', tc:'44444444444', points:0, level:1, avatar:'📚'},
    {id:'u6', name:'Zeynep Kaya', email:'zeynep@example.com', password:hash('123456'), role:'USER', tc:'12345678901', points:1650, level:8, avatar:'🦉', bio:'Adıyaman kültür kartlarını toplamayı seviyorum.'},
    {id:'u7', name:'Ali Demir', email:'ali@example.com', password:hash('123456'), role:'USER', tc:'12345678902', points:120, level:2, avatar:'📖', bio:'Yeni başladım.'},
    {id:'u8', name:'Mehmet Yıldız', email:'mehmet@example.com', password:hash('123456'), role:'USER', tc:'12345678903', points:620, level:5, avatar:'🔥', bio:'Etkinlik kartları peşindeyim.'}
  ];
  const libraries = [
    {id:'lib-gerger', slug:'gerger', name:'Adıyaman Gerger İlçe Halk Kütüphanesi', city:'Adıyaman', district:'Gerger', logo:'🏔️', banner:'Kral Samos ve Kımıl Dağı koleksiyonu'},
    {id:'lib-kahta', slug:'kahta', name:'Adıyaman Kahta İlçe Halk Kütüphanesi', city:'Adıyaman', district:'Kahta', logo:'☀️', banner:'Nemrut, Arsemia ve Kahta Kalesi kartları'},
    {id:'lib-sincik', slug:'sincik', name:'Adıyaman Sincik İlçe Halk Kütüphanesi', city:'Adıyaman', district:'Sincik', logo:'🦅', banner:'Karakuş Tümülüsü ve Cendere Köprüsü'},
    {id:'lib-samsat', slug:'samsat', name:'Adıyaman Samsat İlçe Halk Kütüphanesi', city:'Adıyaman', district:'Samsat', logo:'🏰', banner:'Eski Samsat Kalesi'},
    {id:'lib-celikhan', slug:'celikhan', name:'Adıyaman Çelikhan İlçe Halk Kütüphanesi', city:'Adıyaman', district:'Çelikhan', logo:'🏝️', banner:'Yüzen Adalar kartları'}
  ];
  const books = [
    {id:'b1', libraryId:'lib-kahta', title:'Nemrut ve Kommagene Tarihi', author:'Yerel Araştırma', category:'Tarih', points:80, isSpecial:true},
    {id:'b2', libraryId:'lib-gerger', title:'Kral Samos ve Fırat Havzası', author:'Yerel Tarih', category:'Tarih', points:75, isSpecial:true},
    {id:'b3', libraryId:'lib-sincik', title:'Cendere Köprüsü ve Roma Yolları', author:'Kültür Atlası', category:'Arkeoloji', points:65, isSpecial:true},
    {id:'b4', libraryId:'lib-kahta', title:'Arsemia’dan Kahta Kalesi’ne', author:'Adıyaman İncelemeleri', category:'Kültür', points:60, isSpecial:true},
    {id:'b5', libraryId:'lib-gerger', title:'Anadolu Masalları', author:'Anonim', category:'Edebiyat', points:15, isSpecial:false},
    {id:'b6', libraryId:'lib-sincik', title:'Gençler İçin Bilim', author:'Bilim Dizisi', category:'Bilim', points:20, isSpecial:false}
  ];
  const cards = [
    {id:'c1', title:'Kral Samos Kartı', libraryId:'lib-gerger', rarity:'Legendary', element:'Krallık', icon:'👑', requiredBooks:200, requiredPoints:1000, requiredLevel:8, requiredSpecialBookIds:['b2'], power:95, attack:88, defense:91, color:'gold', type:'book', status:'approved', lore:'Fırat kıyılarında unutulmuş krallık bilgisini taşıyan efsanevi mühür.'},
    {id:'c2', title:'Kımıl Dağı Kartı', libraryId:'lib-gerger', rarity:'Epic', element:'Dağ', icon:'⛰️', requiredBooks:100, requiredPoints:500, requiredLevel:5, requiredSpecialBookIds:[], power:72, attack:61, defense:84, color:'green', type:'book', status:'approved', lore:'Dağın sessizliğinden güç alan dayanıklı bir koruyucu kart.'},
    {id:'c3', title:'Nemrut Dağı Kartı', libraryId:'lib-kahta', rarity:'Mythic', element:'Bilgelik', icon:'☀️', requiredBooks:300, requiredPoints:1500, requiredLevel:10, requiredSpecialBookIds:['b1'], power:100, attack:96, defense:98, color:'orange', type:'book', status:'approved', lore:'Güneşin doğuşuyla uyanan taş muhafızların bilgeliğini taşır.'},
    {id:'c4', title:'Arsemia Kartı', libraryId:'lib-kahta', rarity:'Legendary', element:'Tarih', icon:'🏺', requiredBooks:200, requiredPoints:900, requiredLevel:8, requiredSpecialBookIds:['b4'], power:90, attack:78, defense:92, color:'purple', type:'book', status:'approved', lore:'Kommagene’nin gizli yazıtlarından gelen kadim hafıza.'},
    {id:'c5', title:'Karakuş Tümülüsü Kartı', libraryId:'lib-sincik', rarity:'Epic', element:'Gölge', icon:'🦅', requiredBooks:100, requiredPoints:450, requiredLevel:5, requiredSpecialBookIds:[], power:76, attack:82, defense:70, color:'slate', type:'book', status:'approved', lore:'Kartal gölgesinin taşıdığı mezar anıtı sırrı.'},
    {id:'c6', title:'Cendere Köprüsü Kartı', libraryId:'lib-sincik', rarity:'Rare', element:'Koruma', icon:'🌉', requiredBooks:50, requiredPoints:250, requiredLevel:3, requiredSpecialBookIds:['b3'], power:60, attack:44, defense:85, color:'blue', type:'book', status:'approved', lore:'Yüzyıllara meydan okuyan taşların savunma gücü.'},
    {id:'c7', title:'65. Kütüphane Haftası Kartı', libraryId:'lib-kahta', rarity:'Legendary', element:'Bilgelik', icon:'📚', requiredBooks:0, requiredPoints:0, requiredLevel:1, requiredSpecialBookIds:[], power:88, attack:70, defense:88, color:'teal', type:'event', eventRequirement:'65. Kütüphane Haftası etkinliklerinin tamamına katıl', status:'approved', lore:'Kütüphane Haftası boyunca tüm etkinlikleri tamamlayanlara verilen özel hatıra kartı.'}
  ];
  const loans = [];
  // Create sample loans for progress
  for(let i=0;i<120;i++) loans.push({id:uuid(), userId:'u6', libraryId:i%2?'lib-kahta':'lib-gerger', bookId:i%2?'b1':'b2', points:i%2?80:75, createdAt:new Date().toISOString()});
  for(let i=0;i<8;i++) loans.push({id:uuid(), userId:'u7', libraryId:'lib-sincik', bookId:'b6', points:20, createdAt:new Date().toISOString()});
  for(let i=0;i<55;i++) loans.push({id:uuid(), userId:'u8', libraryId:'lib-sincik', bookId:i===0?'b3':'b6', points:i===0?65:20, createdAt:new Date().toISOString()});
  const collections = [{userId:'u6', cardId:'c6', at:new Date().toISOString()},{userId:'u8', cardId:'c6', at:new Date().toISOString()}];
  const events = [
    {id:'e1', libraryId:'lib-kahta', title:'65. Kütüphane Haftası - Nemrut Okuma Atölyesi', date:'2026-03-30', time:'15:00', quota:30, age:'10+', points:120, cardId:'c7', status:'active', description:'Kütüphane Haftası özel okuma ve kültürel miras etkinliği.'},
    {id:'e2', libraryId:'lib-gerger', title:'Kral Samos Hikâye Saati', date:'2026-04-02', time:'14:00', quota:25, age:'8+', points:90, cardId:null, status:'active', description:'Gerger kültür mirası üzerine hikâye ve okuma etkinliği.'}
  ];
  write('users', users); write('libraries', libraries); write('books', books); write('cards', cards); write('loans', loans); write('collections', collections); write('events', events); write('applications', []); write('cardSuggestions', []); write('libraryApplications', []); write('notifications', []); write('badges', []); write('seeded', [{ok:true}]);
}
seed();

app.set('view engine','ejs'); app.set('views', path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true})); app.use(express.json()); app.use(express.static(path.join(__dirname,'public')));
app.use(session({secret:process.env.SESSION_SECRET||'library-legends-secret', resave:false, saveUninitialized:false}));

function db(){ const users=read('users'), libraries=read('libraries'), books=read('books'), cards=read('cards'), loans=read('loans'), collections=read('collections'), events=read('events'), applications=read('applications'), cardSuggestions=read('cardSuggestions'), libraryApplications=read('libraryApplications'), notifications=read('notifications'); return {users,libraries,books,cards,loans,collections,events,applications,cardSuggestions,libraryApplications,notifications};}
function saveAll(d){ for(const k of ['users','libraries','books','cards','loans','collections','events','applications','cardSuggestions','libraryApplications','notifications']) if(d[k]) write(k,d[k]); }
function current(req){ return req.session.user; }
function requireLogin(req,res,next){ if(!current(req)) return res.redirect('/login'); next(); }
function role(...roles){ return (req,res,next)=>{ if(!current(req) || !roles.includes(current(req).role)) return res.status(403).send('Yetkisiz erişim'); next(); };}
function level(points){ if(points>=2000) return 12; if(points>=1000) return 8; if(points>=500) return 5; if(points>=250) return 3; if(points>=100) return 2; return 1; }
function maskTc(tc){ return tc ? tc.slice(0,3)+'*****'+tc.slice(-3) : ''; }
function userLoans(d,userId){ return d.loans.filter(l=>l.userId===userId); }
function unlocked(d,userId,card){ const loans=userLoans(d,userId), u=d.users.find(x=>x.id===userId); const bookCount=loans.length, pts=loans.reduce((a,l)=>a+(l.points||0),0); const specialOk=(card.requiredSpecialBookIds||[]).every(bid=>loans.some(l=>l.bookId===bid)); const eventOk=card.type!=='event' || d.applications.some(a=>a.userId===userId && a.status==='attended' && d.events.find(e=>e.id===a.eventId && e.cardId===card.id)); return bookCount>=card.requiredBooks && pts>=card.requiredPoints && level(pts)>=card.requiredLevel && specialOk && eventOk; }
function progress(d,userId,card){ const loans=userLoans(d,userId), pts=loans.reduce((a,l)=>a+(l.points||0),0), bookCount=loans.length, lvl=level(pts); const missingBooks=(card.requiredSpecialBookIds||[]).filter(bid=>!loans.some(l=>l.bookId===bid)).map(bid=>d.books.find(b=>b.id===bid)?.title||bid); return {bookCount,pts,lvl, remainingBooks:Math.max(0,card.requiredBooks-bookCount), remainingPoints:Math.max(0,card.requiredPoints-pts), requiredLevel:card.requiredLevel, missingBooks, unlocked:unlocked(d,userId,card)}; }
function checkAwards(d,userId){ const existing = new Set(d.collections.filter(c=>c.userId===userId).map(c=>c.cardId)); d.cards.filter(c=>c.status==='approved').forEach(card=>{ if(!existing.has(card.id) && unlocked(d,userId,card)){ d.collections.push({userId, cardId:card.id, at:new Date().toISOString()}); d.notifications.push({id:uuid(), userId, text:`Yeni kart açıldı: ${card.title}`, at:new Date().toISOString(), read:false}); }}); }
app.use((req,res,next)=>{ res.locals.user=current(req); res.locals.maskTc=maskTc; next(); });

app.get('/', (req,res)=>{ const d=db(); res.render('home',{d}); });

const DEMO_ACCOUNTS = {
  library: [
    {label:'Süper Admin', email:'admin@ktb.gov.tr', pass:'123456'},
    {label:'İl Admin', email:'iladmin@ktb.gov.tr', pass:'123456'},
    {label:'Gerger Kütüphane', email:'gerger@ktb.gov.tr', pass:'123456'},
    {label:'Kahta Kütüphane', email:'kahta@ktb.gov.tr', pass:'123456'},
    {label:'Sincik Kütüphane', email:'sincik@ktb.gov.tr', pass:'123456'}
  ],
  user: [
    {label:'Zeynep Kaya', email:'zeynep@example.com', pass:'123456'},
    {label:'Ali Demir', email:'ali@example.com', pass:'123456'},
    {label:'Mehmet Yıldız', email:'mehmet@example.com', pass:'123456'}
  ]
};
function renderLogin(res, mode='user', error=null){ res.render('login',{error, mode, accounts:DEMO_ACCOUNTS}); }
app.get('/login',(req,res)=>renderLogin(res,'user',null));
app.get('/login/user',(req,res)=>renderLogin(res,'user',null));
app.get('/login/library',(req,res)=>renderLogin(res,'library',null));
app.post('/login/:mode?',(req,res)=>{ const mode=req.params.mode || req.body.mode || 'user'; const d=db(); const u=d.users.find(x=>x.email===req.body.email); if(!u || !bcrypt.compareSync(req.body.password,u.password)) return renderLogin(res, mode, 'Email veya şifre hatalı');
  const isLibraryLogin = ['SUPER_ADMIN','IL_ADMIN','LIBRARY_ADMIN'].includes(u.role);
  if(mode==='user' && u.role!=='USER') return renderLogin(res, mode, 'Bu hesap kullanıcı girişi için uygun değil. Kütüphane/Admin girişini kullan.');
  if(mode==='library' && !isLibraryLogin) return renderLogin(res, mode, 'Bu hesap kütüphane/admin girişi için uygun değil. Kullanıcı girişini kullan.');
  req.session.user={id:u.id,name:u.name,email:u.email,role:u.role,libraryId:u.libraryId,city:u.city,avatar:u.avatar}; res.redirect('/dashboard'); });
app.get('/logout',(req,res)=>req.session.destroy(()=>res.redirect('/')));
app.get('/dashboard', requireLogin, (req,res)=>{ const u=current(req); if(u.role==='SUPER_ADMIN') return res.redirect('/admin'); if(u.role==='LIBRARY_ADMIN') return res.redirect('/library-admin'); if(u.role==='IL_ADMIN') return res.redirect('/il-admin'); res.redirect('/profile'); });
app.get('/libraries',(req,res)=>{ const d=db(); res.render('libraries',{d}); });
app.get('/library/:slug',(req,res)=>{ const d=db(); const lib=d.libraries.find(l=>l.slug===req.params.slug); if(!lib) return res.status(404).send('Kütüphane bulunamadı'); res.render('library',{d,lib}); });
app.post('/library-apply',(req,res)=>{ const d=db(); d.libraryApplications.push({id:uuid(),...req.body,status:'pending',at:new Date().toISOString()}); saveAll(d); res.redirect('/?applied=1'); });
app.get('/cards',(req,res)=>{ const d=db(); res.render('cards',{d,progress}); });
app.get('/events',(req,res)=>{ const d=db(); res.render('events',{d}); });
app.post('/events/:id/apply', requireLogin, role('USER'), (req,res)=>{ const d=db(); const exists=d.applications.some(a=>a.eventId===req.params.id && a.userId===current(req).id); if(!exists) d.applications.push({id:uuid(), eventId:req.params.id, userId:current(req).id, status:'pending', tc:req.body.tc, phone:req.body.phone, age:req.body.age, note:req.body.note, at:new Date().toISOString()}); saveAll(d); res.redirect('/profile'); });
app.get('/profile', requireLogin, role('USER'), (req,res)=>{ const d=db(); checkAwards(d,current(req).id); saveAll(d); const full=d.users.find(u=>u.id===current(req).id); res.render('profile',{d,full,progress}); });
app.get('/leaderboard',(req,res)=>{ const d=db(); const rows=d.users.filter(u=>u.role==='USER').map(u=>({u, loans:userLoans(d,u.id).length, points:userLoans(d,u.id).reduce((a,l)=>a+(l.points||0),0)})).sort((a,b)=>b.points-a.points); res.render('leaderboard',{rows}); });

app.get('/library-admin', requireLogin, role('LIBRARY_ADMIN'), (req,res)=>{ const d=db(); const lib=d.libraries.find(l=>l.id===current(req).libraryId); res.render('library-admin',{d,lib}); });
app.post('/library-admin/books/add', requireLogin, role('LIBRARY_ADMIN'), (req,res)=>{ const d=db(); d.books.push({id:uuid(), libraryId:current(req).libraryId, title:req.body.title, author:req.body.author, category:req.body.category, points:Number(req.body.points||10), isSpecial:req.body.isSpecial==='on'}); saveAll(d); res.redirect('/library-admin'); });
app.post('/library-admin/loan', requireLogin, role('LIBRARY_ADMIN'), (req,res)=>{ const d=db(); const member=d.users.find(u=>u.tc===req.body.tc && u.role==='USER'); const book=d.books.find(b=>b.id===req.body.bookId && b.libraryId===current(req).libraryId); if(member && book){ d.loans.push({id:uuid(), userId:member.id, libraryId:current(req).libraryId, bookId:book.id, points:book.points, createdAt:new Date().toISOString()}); d.notifications.push({id:uuid(),userId:member.id,text:`${book.title} ödünç işlemi işlendi. +${book.points} puan`,at:new Date().toISOString(),read:false}); checkAwards(d,member.id); saveAll(d); } res.redirect('/library-admin'); });
app.post('/library-admin/events/add', requireLogin, role('LIBRARY_ADMIN'), (req,res)=>{ const d=db(); d.events.push({id:uuid(), libraryId:current(req).libraryId, title:req.body.title, date:req.body.date, time:req.body.time, quota:Number(req.body.quota||20), age:req.body.age, points:Number(req.body.points||0), cardId:req.body.cardId||null, status:'active', description:req.body.description}); saveAll(d); res.redirect('/library-admin'); });
app.post('/library-admin/applications/:id/:status', requireLogin, role('LIBRARY_ADMIN'), (req,res)=>{ const d=db(); const appx=d.applications.find(a=>a.id===req.params.id); const ev=appx && d.events.find(e=>e.id===appx.eventId && e.libraryId===current(req).libraryId); if(appx && ev){ appx.status=req.params.status; if(req.params.status==='attended'){ const u=d.users.find(x=>x.id===appx.userId); if(u){ d.notifications.push({id:uuid(),userId:u.id,text:`Etkinlik katılımın onaylandı: ${ev.title}`,at:new Date().toISOString(),read:false}); } checkAwards(d,appx.userId); } saveAll(d); } res.redirect('/library-admin'); });
app.post('/library-admin/card-suggest', requireLogin, role('LIBRARY_ADMIN'), (req,res)=>{ const d=db(); d.cardSuggestions.push({id:uuid(), libraryId:current(req).libraryId, title:req.body.title, rarity:req.body.rarity, element:req.body.element, icon:req.body.icon, requiredBooks:Number(req.body.requiredBooks||50), requiredPoints:Number(req.body.requiredPoints||100), requiredLevel:Number(req.body.requiredLevel||1), lore:req.body.lore, status:'pending', at:new Date().toISOString()}); saveAll(d); res.redirect('/library-admin'); });

app.get('/admin', requireLogin, role('SUPER_ADMIN'), (req,res)=>{ const d=db(); res.render('admin',{d}); });
app.post('/admin/card-suggestions/:id/approve', requireLogin, role('SUPER_ADMIN'), (req,res)=>{ const d=db(); const s=d.cardSuggestions.find(x=>x.id===req.params.id); if(s){ s.status='approved'; d.cards.push({...s, id:uuid(), type:'book', status:'approved', requiredSpecialBookIds:[], power:70, attack:60, defense:60, color:'teal'}); saveAll(d); } res.redirect('/admin'); });
app.post('/admin/library-applications/:id/approve', requireLogin, role('SUPER_ADMIN'), (req,res)=>{ const d=db(); const a=d.libraryApplications.find(x=>x.id===req.params.id); if(a){ a.status='approved'; d.libraries.push({id:uuid(), slug:(a.district||a.name).toLowerCase().replaceAll(' ','-'), name:a.name, city:a.city, district:a.district, logo:'📚', banner:'Yeni katılan kütüphane'}); saveAll(d); } res.redirect('/admin'); });
app.get('/il-admin', requireLogin, role('IL_ADMIN'), (req,res)=>{ const d=db(); res.render('il-admin',{d}); });
app.get('/privacy',(req,res)=>res.render('privacy'));
app.get('/presentation',(req,res)=>{ const d=db(); res.render('presentation',{d}); });

app.use((req,res)=>res.status(404).render('404'));
app.listen(PORT, '0.0.0.0', ()=>console.log('Library Legends running on '+PORT));
