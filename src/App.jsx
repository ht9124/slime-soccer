import React, { useState, useEffect, useRef, useCallback } from 'react';

const GW=800,GH=400,GRND=80,SR=40,BR=10,GW2=80,GH2=120;
const GRAV=0.6,SPD=5,JUMP=-12,DAMP=0.99,BDAMP=0.8,MAXSPD=13;
const GOALS_PER_LEVEL=10,MAX_LVL=15,COOLDOWN_MS=6000;

const LANGS={
  tr:{flag:'🇹🇷',name:'Türkçe',title:'Slime Futbol',subtitle:'15 Seviye · Her 10 golde yeni düşman',single:'🎮 Tek Kişi',multi:'👥 Çift Kişi',leftP:'🟦 SOL OYUNCU',rightP:'🟥 SAĞ OYUNCU',move:'Hareket',jump:'Zıpla',grab:'Tut',levelLabel:'Seviye',sep:'/',goals:'gol',welcome:'dünyasına hoş geldin',levelUp:'SEVİYE',congrats:'Tebrikler!',allDone:'Tüm 15 seviyeyi tamamladın!',playAgain:'🔄 Tekrar Oyna',menu:'Menü',ghost:'Görünmez Top',wall:'Duvar',locked:'🔒 2. golde açılır',pause:'⏸ Duraklat',resume:'▶ Devam',paused:'DURAKLATILDI'},
  en:{flag:'🇬🇧',name:'English',title:'Slime Soccer',subtitle:'15 Levels · New enemy every 10 goals',single:'🎮 Single Player',multi:'👥 2 Players',leftP:'🟦 LEFT PLAYER',rightP:'🟥 RIGHT PLAYER',move:'Move',jump:'Jump',grab:'Grab',levelLabel:'Level',sep:'/',goals:'goals',welcome:'world welcome',levelUp:'LEVEL',congrats:'Congratulations!',allDone:'You beat all 15 levels!',playAgain:'🔄 Play Again',menu:'Menu',ghost:'Ghost Ball',wall:'Wall',locked:'🔒 unlocks at 2nd goal',pause:'⏸ Pause',resume:'▶ Resume',paused:'PAUSED'},
  es:{flag:'🇪🇸',name:'Español',title:'Slime Fútbol',subtitle:'15 Niveles · Nuevo enemigo cada 10 goles',single:'🎮 Un Jugador',multi:'👥 2 Jugadores',leftP:'🟦 JUGADOR IZQ.',rightP:'🟥 JUGADOR DER.',move:'Mover',jump:'Saltar',grab:'Agarrar',levelLabel:'Nivel',sep:'/',goals:'goles',welcome:'bienvenido al mundo',levelUp:'NIVEL',congrats:'¡Felicitaciones!',allDone:'¡Completaste los 15 niveles!',playAgain:'🔄 Jugar de Nuevo',menu:'Menú',ghost:'Bola Fantasma',wall:'Muro',locked:'🔒 desbloquea al 2.º gol',pause:'⏸ Pausar',resume:'▶ Continuar',paused:'EN PAUSA'},
  pt:{flag:'🇧🇷',name:'Português',title:'Slime Futebol',subtitle:'15 Níveis · Novo inimigo a cada 10 gols',single:'🎮 Um Jogador',multi:'👥 2 Jogadores',leftP:'🟦 JOGADOR ESQ.',rightP:'🟥 JOGADOR DIR.',move:'Mover',jump:'Pular',grab:'Segurar',levelLabel:'Nível',sep:'/',goals:'gols',welcome:'bem-vindo ao mundo',levelUp:'NÍVEL',congrats:'Parabéns!',allDone:'Você venceu todos os 15 níveis!',playAgain:'🔄 Jogar Novamente',menu:'Menu',ghost:'Bola Fantasma',wall:'Parede',locked:'🔒 libera no 2.º gol',pause:'⏸ Pausar',resume:'▶ Continuar',paused:'PAUSADO'},
  de:{flag:'🇩🇪',name:'Deutsch',title:'Slime Fußball',subtitle:'15 Level · Neuer Gegner alle 10 Tore',single:'🎮 Einzelspieler',multi:'👥 2 Spieler',leftP:'🟦 LINKER SPIELER',rightP:'🟥 RECHTER SPIELER',move:'Bewegen',jump:'Springen',grab:'Greifen',levelLabel:'Level',sep:'/',goals:'Tore',welcome:'Willkommen in der Welt',levelUp:'LEVEL',congrats:'Glückwunsch!',allDone:'Du hast alle 15 Level geschafft!',playAgain:'🔄 Nochmal spielen',menu:'Menü',ghost:'Geisterball',wall:'Mauer',locked:'🔒 ab dem 2. Tor',pause:'⏸ Pause',resume:'▶ Weiter',paused:'PAUSIERT'},
  zh:{flag:'🇨🇳',name:'中文',title:'史莱姆足球',subtitle:'15关 · 每10球换新敌人',single:'🎮 单人模式',multi:'👥 双人模式',leftP:'🟦 左方玩家',rightP:'🟥 右方玩家',move:'移动',jump:'跳跃',grab:'抓球',levelLabel:'第',sep:'关',goals:'球',welcome:'世界欢迎你',levelUp:'第',congrats:'恭喜！',allDone:'你通关了全部15关！',playAgain:'🔄 再玩一次',menu:'菜单',ghost:'幽灵球',wall:'墙壁',locked:'🔒 第2球后解锁',pause:'⏸ 暂停',resume:'▶ 继续',paused:'已暂停'},
  ja:{flag:'🇯🇵',name:'日本語',title:'スライムサッカー',subtitle:'15レベル · 10点ごとに新敵登場',single:'🎮 一人プレイ',multi:'👥 二人プレイ',leftP:'🟦 左プレイヤー',rightP:'🟥 右プレイヤー',move:'移動',jump:'ジャンプ',grab:'つかむ',levelLabel:'レベル',sep:'/',goals:'ゴール',welcome:'の世界へようこそ',levelUp:'レベル',congrats:'おめでとう！',allDone:'全15レベルをクリアした！',playAgain:'🔄 もう一度',menu:'メニュー',ghost:'ゴーストボール',wall:'ウォール',locked:'🔒 2点目で解放',pause:'⏸ 一時停止',resume:'▶ 再開',paused:'一時停止中'},
  ko:{flag:'🇰🇷',name:'한국어',title:'슬라임 축구',subtitle:'15레벨 · 10골마다 새 적 등장',single:'🎮 1인 플레이',multi:'👥 2인 플레이',leftP:'🟦 왼쪽 플레이어',rightP:'🟥 오른쪽 플레이어',move:'이동',jump:'점프',grab:'잡기',levelLabel:'레벨',sep:'/',goals:'골',welcome:'세계에 오신 걸 환영합니다',levelUp:'레벨',congrats:'축하합니다!',allDone:'15레벨 모두 클리어!',playAgain:'🔄 다시 하기',menu:'메뉴',ghost:'유령 공',wall:'벽',locked:'🔒 2골째에 해제',pause:'⏸ 일시정지',resume:'▶ 계속',paused:'일시정지됨'},
};

const LEVELS=[
  {emoji:'🦀',dark:false,bg:['#87CEEB','#4682B4'],ground:'#C2A35A',ec:'#E05020',ea:'#C03010'},
  {emoji:'🐸',dark:false,bg:['#228B22','#006400'],ground:'#5D4037',ec:'#32CD32',ea:'#228B22'},
  {emoji:'🦂',dark:false,bg:['#EDC96A','#C8860A'],ground:'#D2691E',ec:'#DAA520',ea:'#8B6914'},
  {emoji:'🐧',dark:false,bg:['#E0F4FF','#B0D8F0'],ground:'#DDEEFF',ec:'#555555',ea:'#333333'},
  {emoji:'🐲',dark:true, bg:['#1A0000','#5C0A00'],ground:'#8B0000',ec:'#FF4500',ea:'#CC2200'},
  {emoji:'🦈',dark:true, bg:['#006994','#003366'],ground:'#1A6B8A',ec:'#5F9EA0',ea:'#2E8B57'},
  {emoji:'👾',dark:true, bg:['#000010','#0A0030'],ground:'#1C1C3C',ec:'#39FF14',ea:'#00AA00'},
  {emoji:'🔥',dark:true, bg:['#3D0000','#7A1800'],ground:'#4A0000',ec:'#FF6600',ea:'#FF2200'},
  {emoji:'🐆',dark:false,bg:['#1B4D1B','#0D2B0D'],ground:'#2D5A1B',ec:'#DAA520',ea:'#8B6914'},
  {emoji:'❄️',dark:true, bg:['#003366','#001133'],ground:'#0A2A4A',ec:'#AADDFF',ea:'#6699CC'},
  {emoji:'🤖',dark:true, bg:['#0A0010','#150025'],ground:'#1A0030',ec:'#FF00FF',ea:'#9900CC'},
  {emoji:'👻',dark:true, bg:['#0D0D1A','#1A1A33'],ground:'#1A1A2E',ec:'#DDDDFF',ea:'#8888CC'},
  {emoji:'🦄',dark:false,bg:['#FF0066','#6600FF'],ground:'#AA00AA',ec:'#FF69B4',ea:'#FF1493'},
  {emoji:'⚡',dark:true, bg:['#1A1A2E','#0D0D1A'],ground:'#2E2E4E',ec:'#FFD700',ea:'#FFA500'},
  {emoji:'💀',dark:true, bg:['#000000','#1A0000'],ground:'#0D0000',ec:'#8B0000',ea:'#4B0000'},
];

// Localized level names (15 per language)
const LVL_NAMES={
  tr:['Sahil','Orman','Çöl','Kar','Lav','Okyanus','Uzay','Volkan','Derin Orman','Buz Mağarası','Neon Kent','Lanetli','Gökkuşağı','Fırtına','Son Patron'],
  en:['Beach','Jungle','Desert','Snow','Lava','Ocean','Space','Volcano','Deep Jungle','Ice Cave','Neon City','Cursed','Rainbow','Storm','Final Boss'],
  es:['Playa','Selva','Desierto','Nieve','Lava','Océano','Espacio','Volcán','Selva Profunda','Cueva de Hielo','Ciudad Neón','Maldito','Arcoíris','Tormenta','Jefe Final'],
  pt:['Praia','Selva','Deserto','Neve','Lava','Oceano','Espaço','Vulcão','Selva Profunda','Caverna de Gelo','Cidade Neon','Amaldiçoado','Arco-íris','Tempestade','Chefe Final'],
  de:['Strand','Dschungel','Wüste','Schnee','Lava','Ozean','Weltraum','Vulkan','Tiefer Dschungel','Eishöhle','Neonstadt','Verflucht','Regenbogen','Sturm','Endgegner'],
  zh:['海滩','丛林','沙漠','雪地','熔岩','海洋','太空','火山','深林','冰洞','霓虹城','诅咒','彩虹','风暴','最终Boss'],
  ja:['ビーチ','ジャングル','砂漠','雪原','溶岩','海洋','宇宙','火山','深い森','氷の洞窟','ネオン都市','呪われた','虹','嵐','ラスボス'],
  ko:['해변','정글','사막','눈밭','용암','바다','우주','화산','깊은 정글','얼음 동굴','네온 시티','저주','무지개','폭풍','최종 보스'],
};

// Localized enemy names (15 per language, emoji stored on LEVELS)
const FOES={
  tr:['Yengeç','Kurbağa','Akrep','Penguen','Ejderha','Köpekbalığı','Uzaylı','Anka','Leopar','Yeti','Robot','Hayalet','Unicorn','Şimşek','Karanlık Lord'],
  en:['Crab','Frog','Scorpion','Penguin','Dragon','Shark','Alien','Phoenix','Leopard','Yeti','Robot','Ghost','Unicorn','Thunder','Dark Lord'],
  es:['Cangrejo','Rana','Escorpión','Pingüino','Dragón','Tiburón','Alienígena','Fénix','Leopardo','Yeti','Robot','Fantasma','Unicornio','Rayo','Señor Oscuro'],
  pt:['Caranguejo','Sapo','Escorpião','Pinguim','Dragão','Tubarão','Alienígena','Fênix','Leopardo','Yeti','Robô','Fantasma','Unicórnio','Raio','Senhor das Trevas'],
  de:['Krabbe','Frosch','Skorpion','Pinguin','Drache','Hai','Alien','Phönix','Leopard','Yeti','Roboter','Geist','Einhorn','Blitz','Dunkler Lord'],
  zh:['螃蟹','青蛙','蝎子','企鹅','龙','鲨鱼','外星人','凤凰','豹','雪人','机器人','幽灵','独角兽','闪电','黑暗领主'],
  ja:['カニ','カエル','サソリ','ペンギン','ドラゴン','サメ','エイリアン','フェニックス','ヒョウ','イエティ','ロボット','ゴースト','ユニコーン','サンダー','闇の王'],
  ko:['게','개구리','전갈','펭귄','드래곤','상어','외계인','불사조','표범','예티','로봇','유령','유니콘','번개','어둠의 군주'],
};

export default function SlimeSoccer(){
  const cvs=useRef(null);
  const rafId=useRef(null);
  const keys=useRef({});
  const lastT=useRef(0);
  const partsRef=useRef([]);
  const shakeRef=useRef({x:0,y:0,i:0});
  const trailRef=useRef([]);
  const flashRef=useRef({a:0,c:'#fff'});
  const starsRef=useRef([]);
  const gsRef=useRef(null);
  const lvRef=useRef(0);
  const scRef=useRef({l:0,r:0});
  const psRef=useRef([{offCd:0,defCd:0,wallActive:false,wallTimer:0},{offCd:0,defCd:0,wallActive:false,wallTimer:0}]);
  const transitionRef=useRef(false);
  const pausedRef=useRef(false);

  const [screen, setScreen] = useState('lang');
  const [lang, setLang] = useState('en');
  const [pMode, setPMode] = useState(null);
  const [level, setLevel] = useState(0);
  const [score, setScore] = useState({l:0,r:0});
  const [lvAnim, setLvAnim] = useState(false);
  const [uiTick, setUiTick] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(()=>{
    const check=()=>setIsMobile(window.matchMedia('(pointer:coarse)').matches||window.innerWidth<820);
    check();
    window.addEventListener('resize',check);
    return()=>window.removeEventListener('resize',check);
  },[]);

  const t = useCallback((k) => LANGS[lang]?.[k] || LANGS.en[k] || k, [lang]);
  const lvName = useCallback((i) => (LVL_NAMES[lang] || LVL_NAMES.en)[i], [lang]);
  const foe = useCallback((i) => (FOES[lang] || FOES.en)[i], [lang]);

  const togglePause = useCallback(()=>{
    pausedRef.current=!pausedRef.current;
    setPaused(pausedRef.current);
  },[]);

  useEffect(()=>{
    starsRef.current=Array.from({length:80},()=>({x:Math.random()*GW,y:Math.random()*(GH-GRND),r:Math.random()*1.5+0.3,b:Math.random()}));
  },[]);

  const initBall=()=>({x:GW/2,y:150,vx:0,vy:0,grb:null,ga:0,gav:0,ghost:0});
  const initGS=()=>({
    L:{x:200,y:GH-GRND,vx:0,vy:0,grab:false,hasBall:false,glt:0,tx:200,dc:0,ss:true},
    R:{x:600,y:GH-GRND,vx:0,vy:0,grab:false,hasBall:false,glt:0},
    ball:initBall()
  });

  const pC=(x,y,n,c,sm=1,sz=1)=>{for(let i=0;i<n;i++){const a=(Math.PI*2*i)/n+Math.random()*0.5,sp=(2+Math.random()*4)*sm;partsRef.current.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-2,life:1,dec:0.04+Math.random()*0.03,sz:(3+Math.random()*4)*sz,c,tp:'c'});}};
  const pSt=(x,y,c)=>partsRef.current.push({x,y,vx:0,vy:-1.5,life:1,dec:0.025,sz:18+Math.random()*10,c,tp:'s'});
  const pW=(x,y,c)=>partsRef.current.push({x,y,life:1,dec:0.07,r:5,mr:70,c,tp:'w'});
  const pK=(x,y,ang,n,c)=>{for(let i=0;i<n;i++){const a=ang+(Math.random()-0.5)*0.6,sp=3+Math.random()*6;partsRef.current.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,life:1,dec:0.06+Math.random()*0.04,sz:2+Math.random()*2,c,tp:'k'});}};
  const pLt=(mx,my,is)=>{const n=is>5?5:3;for(let b=0;b<n;b++){const ba=(Math.PI*2*b)/n+Math.random()*0.4,bl=30+Math.random()*40,pts=[{x:mx,y:my}];for(let i=1;i<=5;i++){const tv=i/5;pts.push({x:mx+Math.cos(ba)*bl*tv+(Math.random()-0.5)*18,y:my+Math.sin(ba)*bl*tv+(Math.random()-0.5)*18});}partsRef.current.push({tp:'l',pts,life:1,dec:0.14+Math.random()*0.08,c:is>5?'#FFF':'#AADDFF'});}};
  const goalFX=(x,y,c)=>{pW(x,y,c);pC(x,y,30,c,2,1.5);pC(x,y,15,'#FFD700',2.5,1.2);for(let i=0;i<8;i++)pSt(x+(Math.random()-0.5)*100,y+(Math.random()-0.5)*80,c);shakeRef.current={i:12,x:0,y:0};flashRef.current={a:0.6,c};};

  const resetPos=useCallback(()=>{
    const s=gsRef.current;
    s.L={x:200,y:GH-GRND,vx:0,vy:0,grab:false,hasBall:false,glt:0,tx:200,dc:0,ss:true};
    s.R={x:600,y:GH-GRND,vx:0,vy:0,grab:false,hasBall:false,glt:0};
    s.ball=initBall();trailRef.current=[];
  },[]);

  const useSkill=useCallback((pi,type)=>{
    const myGoals=pi===0?scRef.current.l:scRef.current.r;
    if(myGoals<2)return;
    const p=psRef.current[pi];
    const now=Date.now();
    if(type==='off'){
      if(p.offCd>now)return;
      p.offCd=now+COOLDOWN_MS;
      gsRef.current.ball.ghost=180;
    } else {
      if(p.defCd>now)return;
      p.defCd=now+COOLDOWN_MS;
      p.wallActive=true;p.wallTimer=180;
    }
    setUiTick(v=>v+1);
  },[]);

  const handleGoal=useCallback((team)=>{
    if(transitionRef.current)return;
    const gx=team==='L'?GW-30:30;
    const c=team==='L'?'#00CED1':LEVELS[lvRef.current].ec;
    goalFX(gx,GH-GRND-40,c);
    const ns={...scRef.current};
    if(team==='L')ns.l++;else ns.r++;
    scRef.current=ns;setScore({l:ns.l,r:ns.r});
    const total=ns.l+ns.r;
    if(total>=GOALS_PER_LEVEL){
      const next=lvRef.current+1;
      if(next>=MAX_LVL){transitionRef.current=true;setTimeout(()=>setScreen('gameover'),500);return;}
      transitionRef.current=true;
      setLvAnim(true);
      setTimeout(()=>{lvRef.current=next;setLevel(next);scRef.current={l:0,r:0};setScore({l:0,r:0});partsRef.current=[];trailRef.current=[];psRef.current=[{offCd:0,defCd:0,wallActive:false,wallTimer:0},{offCd:0,defCd:0,wallActive:false,wallTimer:0}];resetPos();setLvAnim(false);transitionRef.current=false;},2500);
    } else resetPos();
  },[resetPos]);

  const updateAI=useCallback(()=>{
    if(pMode!=='single')return;
    const s=gsRef.current;const ai=s.L;const ball=s.ball;
    const lv=lvRef.current;const aiSpd=SPD*(1+lv*0.04);
    if(ai.dc>0){ai.dc--;const d=ai.tx-ai.x;ai.vx=Math.abs(d)>10?Math.sign(d)*aiSpd*Math.min(Math.abs(d)/50,1):0;return;}
    const bdo=Math.abs(ball.x-(GW-GW2/2)),bda=Math.abs(ball.x-GW2/2),adt=Math.abs(ai.x-ball.x),bma=ball.vx<-1,bh=GH-GRND-ball.y;
    let ntx=ai.tx,sj=false;const agg=0.5+lv*0.04;
    if(bdo<bda*(1+agg)||(ball.x>GW*0.3&&!bma)){ntx=bh>60&&adt<150?ball.x-45:ball.x-30;if(adt<100&&bh>20&&bh<110&&ai.y>=GH-GRND-1)sj=true;}
    else if(ball.x<GW*0.65||bma){ntx=ball.x<GW2*2.5&&bma?Math.max(ball.x-10,SR):ball.x;if(adt<120&&bh<100&&ball.x<GW2*2.5)sj=true;}
    else ntx=GW*0.4;
    if(Math.abs(ntx-ai.tx)>15){ai.tx=ntx;ai.dc=Math.max(3,10-lv);}
    const d=ai.tx-ai.x;ai.vx=Math.abs(d)>10?Math.sign(d)*aiSpd*Math.min(Math.abs(d)/50,1):0;
    if(sj&&ai.vy===0&&!ai.grab)ai.vy=JUMP;
    if(scRef.current.l>=2){
      const ballNearMyGoal=ball.x<GW*0.4&&ball.vx<0;
      const ballNearEnemyGoal=ball.x>GW*0.55&&ai.x>GW*0.4;
      if(ballNearMyGoal)useSkill(0,'def');
      else if(ballNearEnemyGoal&&adt<120)useSkill(0,'off');
    }
  },[pMode,useSkill]);

  const updatePhysics=useCallback(()=>{
    if(!gsRef.current)return;
    if(transitionRef.current)return;
    if(pausedRef.current)return;
    const s=gsRef.current;const k=keys.current;const ball=s.ball;
    const [pL,pR]=psRef.current;
    if(pMode==='multi'){
      if(k['a'])s.L.vx=-SPD;else if(k['d'])s.L.vx=SPD;else s.L.vx=0;
      if(k['w']&&s.L.y>=GH-GRND-1&&!s.L.grab)s.L.vy=JUMP;
      s.L.grab=!!k['s'];
      if(k['q']&&!k['_q']){k['_q']=true;useSkill(0,'off');}if(!k['q'])k['_q']=false;
      if(k['z']&&!k['_z']){k['_z']=true;useSkill(0,'def');}if(!k['z'])k['_z']=false;
    } else updateAI();
    if(k['arrowleft'])s.R.vx=-SPD;else if(k['arrowright'])s.R.vx=SPD;else s.R.vx=0;
    if(k['arrowup']&&s.R.y>=GH-GRND-1&&!s.R.grab)s.R.vy=JUMP;
    s.R.grab=!!k['arrowdown'];
    if(k['u']&&!k['_u']){k['_u']=true;useSkill(1,'off');}if(!k['u'])k['_u']=false;
    if(k['j']&&!k['_j']){k['_j']=true;useSkill(1,'def');}if(!k['j'])k['_j']=false;

    if(ball.ghost>0)ball.ghost--;
    if(pL.wallTimer>0){pL.wallTimer--;if(pL.wallTimer===0)pL.wallActive=false;}
    if(pR.wallTimer>0){pR.wallTimer--;if(pR.wallTimer===0)pR.wallActive=false;}

    {const dx=s.R.x-s.L.x,dy=s.R.y-s.L.y,dist=Math.sqrt(dx*dx+dy*dy);
    if(dist<SR*2){
      const is=Math.sqrt((s.R.vx-s.L.vx)**2+(s.R.vy-s.L.vy)**2);
      if(is>1.5){const mx=(s.L.x+s.R.x)/2,my=(s.L.y+s.R.y)/2;shakeRef.current={i:Math.min(is*1.2,9),x:0,y:0};pLt(mx,my,is);pC(mx,my,Math.round(8+is*1.5),'#FFE566',1.4,0.9);pK(mx,my,Math.atan2(dy,dx),Math.round(6+is),'#FFF');if(is>4){pW(mx,my,'#AADDFF');flashRef.current={a:0.18,c:'#88CCFF'};}}
      if(dist>0){const nx=dx/dist,ny=dy/dist,ov=SR*2-dist;s.L.x-=nx*ov*0.5;s.R.x+=nx*ov*0.5;const dot=(s.L.vx-s.R.vx)*nx+(s.L.vy-s.R.vy)*ny;if(dot>0){s.L.vx-=dot*nx*0.5;s.L.vy-=dot*ny*0.5;s.R.vx+=dot*nx*0.5;s.R.vy+=dot*ny*0.5;}}}}

    [s.L,s.R].forEach((sl)=>{
      sl.vy+=GRAV;sl.x+=sl.vx;sl.y+=sl.vy;
      if(sl.x<SR)sl.x=SR;if(sl.x>GW-SR)sl.x=GW-SR;
      if(sl.y>GH-GRND){sl.y=GH-GRND;sl.vy=0;}
    });

    if(ball.ghost===0){
      if(pL.wallActive){const wx=GW2+10;if(ball.x<wx+BR&&ball.x>wx-10&&ball.y>GH-GRND-GH2){ball.x=wx+BR;ball.vx=Math.abs(ball.vx)*1.2;pC(ball.x,ball.y,6,'#CD853F',1,1);}}
      if(pR.wallActive){const wx=GW-GW2-10;if(ball.x>wx-BR&&ball.x<wx+10&&ball.y>GH-GRND-GH2){ball.x=wx-BR;ball.vx=-Math.abs(ball.vx)*1.2;pC(ball.x,ball.y,6,'#CD853F',1,1);}}
    }

    if(ball.grb){
      const gr=ball.grb==='L'?s.L:s.R;const sd=ball.grb==='L'?1:-1;
      ball.gav+=-gr.vx*0.008*sd;ball.gav*=0.85;ball.ga+=ball.gav;
      if(ball.grb==='L'){if(ball.ga<-Math.PI/2){ball.ga=-Math.PI/2;ball.gav=0;}else if(ball.ga>Math.PI/2){ball.ga=Math.PI/2;ball.gav=0;}}
      else{while(ball.ga<0)ball.ga+=Math.PI*2;while(ball.ga>Math.PI*2)ball.ga-=Math.PI*2;if(ball.ga<Math.PI/2){ball.ga=Math.PI/2;ball.gav=0;}else if(ball.ga>3*Math.PI/2){ball.ga=3*Math.PI/2;ball.gav=0;}}
      const hd=SR+BR-5;ball.x=gr.x+Math.cos(ball.ga)*hd;ball.y=gr.y+Math.sin(ball.ga)*hd;ball.vx=gr.vx;ball.vy=gr.vy;
      if(!gr.grab){const rs2=Math.abs(ball.gav)*20;ball.vx=gr.vx*1.5+Math.cos(ball.ga)*(3+rs2);ball.vy=gr.vy-2+Math.sin(ball.ga)*rs2*0.3;ball.grb=null;ball.ga=0;ball.gav=0;gr.hasBall=false;}
    } else {ball.vy+=GRAV;ball.vx*=DAMP;ball.x+=ball.vx;ball.y+=ball.vy;}

    if(ball.x<BR){ball.x=BR;ball.vx=-ball.vx*BDAMP;}if(ball.x>GW-BR){ball.x=GW-BR;ball.vx=-ball.vx*BDAMP;}
    if(ball.y>GH-GRND-BR){ball.y=GH-GRND-BR;ball.vy=-ball.vy*BDAMP;}if(ball.y<BR){ball.y=BR;ball.vy=-ball.vy*BDAMP;}
    if(ball.x<=BR&&ball.y>GH-GRND-GH2){handleGoal('R');return;}
    if(ball.x>=GW-BR&&ball.y>GH-GRND-GH2){handleGoal('L');return;}

    [s.L,s.R].forEach((sl,idx)=>{
      if(ball.ghost>0)return;
      const sn=idx===0?'L':'R';const os=idx===0?s.R:s.L;
      const dx=ball.x-sl.x,dy=ball.y-sl.y,dist=Math.sqrt(dx*dx+dy*dy);
      if(dist<SR+BR){
        if(ball.grb&&ball.grb!==sn){const ang=Math.atan2(dy,dx);if(Math.sqrt(sl.vx**2+sl.vy**2)>2||Math.abs(sl.vy)>5){ball.grb=null;ball.ga=0;ball.gav=0;os.hasBall=false;ball.vx=Math.cos(ang)*8+sl.vx;ball.vy=Math.sin(ang)*8+sl.vy;}}
        else if(sl.grab&&!ball.grb){ball.grb=sn;ball.ga=Math.atan2(dy,dx);ball.gav=0;sl.hasBall=true;}
        else if(!ball.grb){
          const ang=Math.atan2(dy,dx);
          if(ball.y<sl.y||Math.abs(ang)<Math.PI*0.5){
            ball.x=sl.x+Math.cos(ang)*(SR+BR);ball.y=sl.y+Math.sin(ang)*(SR+BR);
            const sp=Math.sqrt(ball.vx**2+ball.vy**2);
            ball.vx=Math.cos(ang)*sp*1.5+sl.vx*0.5;ball.vy=Math.sin(ang)*sp*1.5+sl.vy*0.5;
            const ns2=Math.sqrt(ball.vx**2+ball.vy**2);if(ns2>MAXSPD){ball.vx*=MAXSPD/ns2;ball.vy*=MAXSPD/ns2;}
            const hs=Math.sqrt(ball.vx**2+ball.vy**2);const sc=sn==='L'?'#00CED1':LEVELS[lvRef.current].ec;
            if(hs>9){pW(ball.x,ball.y,sc);pC(ball.x,ball.y,20,sc,1.8,1.2);pC(ball.x,ball.y,10,'#FFD700',2.2,0.8);pK(ball.x,ball.y,ang,14,'#FFD700');pSt(ball.x,ball.y,sc);shakeRef.current={i:6,x:0,y:0};flashRef.current={a:0.3,c:sc};}
            else if(hs>6){pW(ball.x,ball.y,sc);pC(ball.x,ball.y,12,sc,1.3,1);pK(ball.x,ball.y,ang,8,sc);shakeRef.current={i:3,x:0,y:0};}
            else if(hs>3){pC(ball.x,ball.y,6,sc,0.9,0.8);pK(ball.x,ball.y,ang,4,sc);}
          }
        }
      }
    });

    trailRef.current.push({x:ball.x,y:ball.y,life:1});
    if(trailRef.current.length>18)trailRef.current.shift();
    trailRef.current.forEach(tr=>tr.life-=0.07);
    trailRef.current=trailRef.current.filter(tr=>tr.life>0);
    partsRef.current.forEach(p=>{p.life-=p.dec;if(p.tp!=='w'){p.x+=p.vx;p.y+=p.vy;if(p.tp!=='s')p.vy+=0.15;}else p.r+=(p.mr-p.r)*0.18;});
    partsRef.current=partsRef.current.filter(p=>p.life>0);
    const sh=shakeRef.current;if(sh.i>0){sh.x=(Math.random()-0.5)*sh.i;sh.y=(Math.random()-0.5)*sh.i;sh.i*=0.82;if(sh.i<0.1)sh.i=0;}
    if(flashRef.current.a>0)flashRef.current.a-=0.04;
  },[pMode,updateAI,handleGoal,useSkill]);

  const drawStar5=(ctx,cx,cy,r,c,a)=>{ctx.save();ctx.globalAlpha=a;ctx.fillStyle=c;ctx.beginPath();for(let i=0;i<10;i++){const ang=(i*Math.PI)/5-Math.PI/2,rd=i%2===0?r:r*0.45;ctx.lineTo(cx+Math.cos(ang)*rd,cy+Math.sin(ang)*rd);}ctx.closePath();ctx.fill();ctx.restore();};

  const draw=useCallback(()=>{
    const canvas=cvs.current;if(!canvas)return;
    const ctx=canvas.getContext('2d');const s=gsRef.current;if(!s)return;
    const sh=shakeRef.current;const lv=LEVELS[lvRef.current];const ball=s.ball;
    const [pL,pR]=psRef.current;
    ctx.save();ctx.translate(sh.x,sh.y);
    const g=ctx.createLinearGradient(0,0,0,GH-GRND);g.addColorStop(0,lv.bg[0]);g.addColorStop(1,lv.bg[1]);
    ctx.fillStyle=g;ctx.fillRect(-10,-10,GW+20,GH+20);
    const dark=lv.dark;
    if(dark)starsRef.current.forEach(st=>{const tw=0.4+0.6*Math.abs(Math.sin(Date.now()*0.001+st.b*10));ctx.save();ctx.globalAlpha=tw*0.9;ctx.fillStyle='#FFF';ctx.beginPath();ctx.arc(st.x,st.y,st.r,0,Math.PI*2);ctx.fill();ctx.restore();});
    ctx.fillStyle=lv.ground;ctx.fillRect(0,GH-GRND,GW,GRND);
    ctx.strokeStyle='rgba(255,255,255,0.3)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,GH-GRND);ctx.lineTo(GW,GH-GRND);ctx.stroke();
    const drawNet=(side)=>{const x0=side==='L'?0:GW-GW2/2,x1=side==='L'?GW2/2:GW,mx2=side==='L'?GW2/2:GW-GW2/2;ctx.strokeStyle='#FFF';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(side==='L'?0:GW-GW2,GH-GRND);ctx.lineTo(side==='L'?GW2:GW,GH-GRND);ctx.moveTo(mx2,GH-GRND);ctx.lineTo(mx2,GH-GRND-GH2);ctx.stroke();ctx.lineWidth=1.5;ctx.strokeStyle='rgba(255,255,255,0.7)';for(let xi=x0;xi<=x1;xi+=10){ctx.beginPath();ctx.moveTo(xi,GH-GRND-GH2);ctx.lineTo(xi,GH-GRND);ctx.stroke();}for(let yi=GH-GRND-GH2;yi<=GH-GRND;yi+=10){ctx.beginPath();ctx.moveTo(x0,yi);ctx.lineTo(x1,yi);ctx.stroke();}};
    drawNet('L');drawNet('R');
    if(pL.wallActive&&pL.wallTimer>0){const wx=GW2+10,al=pL.wallTimer/180;ctx.save();ctx.globalAlpha=al*0.8;ctx.strokeStyle='#CD853F';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(wx,GH-GRND);ctx.lineTo(wx,GH-GRND-GH2);ctx.stroke();ctx.globalAlpha=al*0.2;ctx.fillStyle='#CD853F';ctx.fillRect(wx-3,GH-GRND-GH2,6,GH2);ctx.restore();}
    if(pR.wallActive&&pR.wallTimer>0){const wx=GW-GW2-10,al=pR.wallTimer/180;ctx.save();ctx.globalAlpha=al*0.8;ctx.strokeStyle='#CD853F';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(wx,GH-GRND);ctx.lineTo(wx,GH-GRND-GH2);ctx.stroke();ctx.globalAlpha=al*0.2;ctx.fillStyle='#CD853F';ctx.fillRect(wx-3,GH-GRND-GH2,6,GH2);ctx.restore();}
    const bs=Math.sqrt(ball.vx**2+ball.vy**2);
    if(bs>4&&trailRef.current.length>1){trailRef.current.forEach((tr,i)=>{ctx.save();ctx.globalAlpha=tr.life*(i/trailRef.current.length)*0.5;ctx.fillStyle=bs>9?'#FF6600':bs>6?'#FFD700':'#fff';ctx.beginPath();ctx.arc(tr.x,tr.y,BR*(i/trailRef.current.length)*0.9,0,Math.PI*2);ctx.fill();ctx.restore();});}
    partsRef.current.forEach(p=>{ctx.save();ctx.globalAlpha=Math.max(0,p.life);if(p.tp==='w'){ctx.strokeStyle=p.c;ctx.lineWidth=3*p.life;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.stroke();}else if(p.tp==='l'){ctx.strokeStyle=p.c;ctx.lineWidth=1.5+p.life*2;ctx.shadowColor=p.c;ctx.shadowBlur=10*p.life;ctx.beginPath();ctx.moveTo(p.pts[0].x,p.pts[0].y);for(let i=1;i<p.pts.length;i++)ctx.lineTo(p.pts[i].x,p.pts[i].y);ctx.stroke();ctx.strokeStyle='#FFF';ctx.lineWidth=0.8;ctx.globalAlpha=p.life*0.8;ctx.beginPath();ctx.moveTo(p.pts[0].x,p.pts[0].y);for(let i=1;i<p.pts.length;i++)ctx.lineTo(p.pts[i].x,p.pts[i].y);ctx.stroke();}else if(p.tp==='s'){drawStar5(ctx,p.x,p.y,p.sz,p.c,p.life);}else if(p.tp==='k'){ctx.strokeStyle=p.c;ctx.lineWidth=p.sz;ctx.beginPath();ctx.moveTo(p.x-p.vx*2,p.y-p.vy*2);ctx.lineTo(p.x,p.y);ctx.stroke();}else{ctx.fillStyle=p.c;ctx.beginPath();ctx.arc(p.x,p.y,p.sz*p.life,0,Math.PI*2);ctx.fill();}ctx.restore();});
    if(bs>6){ctx.save();ctx.globalAlpha=Math.min((bs-6)/8,0.6);const gg=ctx.createRadialGradient(ball.x,ball.y,BR,ball.x,ball.y,BR*3);gg.addColorStop(0,bs>9?'#FF4400':'#FFD700');gg.addColorStop(1,'transparent');ctx.fillStyle=gg;ctx.beginPath();ctx.arc(ball.x,ball.y,BR*3,0,Math.PI*2);ctx.fill();ctx.restore();}
    if(ball.ghost>0){const ga=0.25+0.15*Math.sin(Date.now()*0.02);ctx.save();ctx.globalAlpha=ga;ctx.fillStyle='#AADDFF';ctx.beginPath();ctx.arc(ball.x,ball.y,BR*2.2,0,Math.PI*2);ctx.fill();ctx.restore();}
    ctx.globalAlpha=ball.ghost>0?0.35:1;
    ctx.fillStyle='#FFD700';ctx.beginPath();ctx.arc(ball.x,ball.y,BR,0,Math.PI*2);ctx.fill();
    ctx.globalAlpha=1;
    const drawSl=(sl,isR,col,acc,isEnemy)=>{
      ctx.save();if(isEnemy&&lvRef.current>=14){ctx.shadowColor=col;ctx.shadowBlur=20;}
      ctx.fillStyle=col;ctx.beginPath();ctx.arc(sl.x,sl.y,SR,Math.PI,0);ctx.closePath();ctx.fill();
      ctx.fillStyle=acc;ctx.beginPath();ctx.arc(sl.x,sl.y,SR-5,Math.PI+0.3,Math.PI+0.7);ctx.arc(sl.x,sl.y,SR-15,Math.PI+0.7,Math.PI+0.3,true);ctx.closePath();ctx.fill();
      if(isEnemy&&lvRef.current>=6){ctx.strokeStyle=col;ctx.lineWidth=2;ctx.globalAlpha=0.5+0.3*Math.sin(Date.now()*0.005);ctx.beginPath();ctx.arc(sl.x,sl.y-SR*0.5,SR*0.6,-Math.PI*0.9,-Math.PI*0.1);ctx.stroke();}
      if(isEnemy&&lvRef.current>=10){ctx.strokeStyle=col;ctx.lineWidth=3;ctx.globalAlpha=0.7;ctx.shadowColor=col;ctx.shadowBlur=15;ctx.beginPath();ctx.arc(sl.x,sl.y,SR+3,Math.PI,0);ctx.closePath();ctx.stroke();}
      ctx.restore();
      ctx.fillStyle='#FFF';ctx.beginPath();ctx.arc(sl.x+(isR?-SR*0.3:SR*0.3),sl.y-SR*0.3,5,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#000';ctx.beginPath();ctx.arc(sl.x+(isR?-SR*0.35:SR*0.35),sl.y-SR*0.3,2,0,Math.PI*2);ctx.fill();
      if(isEnemy&&lvRef.current>=8){ctx.strokeStyle=LEVELS[lvRef.current].ec;ctx.lineWidth=2;const ex2=sl.x+(isR?-SR*0.3:SR*0.3);ctx.beginPath();ctx.moveTo(ex2-7,sl.y-SR*0.5);ctx.lineTo(ex2+7,sl.y-SR*0.38);ctx.stroke();}
    };
    drawSl(s.L,false,'#00CED1','#008B8B',pMode==='single');
    drawSl(s.R,true,lv.ec,lv.ea,false);
    ctx.restore();
    if(flashRef.current.a>0){ctx.save();ctx.globalAlpha=flashRef.current.a;ctx.fillStyle=flashRef.current.c;ctx.fillRect(0,0,GW,GH);ctx.restore();}
  },[pMode]);

  const loop=useCallback((ts)=>{
    if(ts-lastT.current>=1000/60){updatePhysics();draw();lastT.current=ts;}
    rafId.current=requestAnimationFrame(loop);
  },[updatePhysics,draw]);

  useEffect(()=>{
    if(screen==='game'){rafId.current=requestAnimationFrame(loop);}
    return()=>{if(rafId.current)cancelAnimationFrame(rafId.current);};
  },[screen,loop]);

  // Keep cooldown timers ticking visually
  useEffect(()=>{
    if(screen!=='game')return;
    const id=setInterval(()=>setUiTick(v=>v+1),200);
    return()=>clearInterval(id);
  },[screen]);

  useEffect(()=>{
    const dn=(e)=>{if(e.target.tagName==='INPUT')return;e.preventDefault();const kk=e.key.toLowerCase();if((kk==='p'||kk==='escape')&&!keys.current['_pause']){keys.current['_pause']=true;togglePause();}keys.current[kk]=true;};
    const up=(e)=>{if(e.target.tagName==='INPUT')return;e.preventDefault();const kk=e.key.toLowerCase();if(kk==='p'||kk==='escape')keys.current['_pause']=false;keys.current[kk]=false;};
    window.addEventListener('keydown',dn);window.addEventListener('keyup',up);
    return()=>{window.removeEventListener('keydown',dn);window.removeEventListener('keyup',up);};
  },[togglePause]);

  const startGame=(mode)=>{
    gsRef.current=initGS();lvRef.current=0;scRef.current={l:0,r:0};
    transitionRef.current=false;pausedRef.current=false;setPaused(false);
    setLevel(0);setScore({l:0,r:0});partsRef.current=[];trailRef.current=[];
    psRef.current=[{offCd:0,defCd:0,wallActive:false,wallTimer:0},{offCd:0,defCd:0,wallActive:false,wallTimer:0}];
    setPMode(mode);setScreen('game');
  };

  const lv=LEVELS[level];
  const total=score.l+score.r;
  const prog=(total/GOALS_PER_LEVEL)*100;
  const now=Date.now();

  const SkillBar=({pi,color,label})=>{
    const myGoals=pi===0?score.l:score.r;
    const unlocked=myGoals>=2;
    const p=psRef.current[pi];
    const offLeft=Math.max(0,Math.ceil((p.offCd-now)/1000));
    const defLeft=Math.max(0,Math.ceil((p.defCd-now)/1000));
    const offK=pi===0?'Q':'U';const defK=pi===0?'Z':'J';
    const btn=(cd)=>({display:'flex',alignItems:'center',gap:5,padding:'4px 9px',background:cd>0?'rgba(255,255,255,0.02)':'rgba(255,255,255,0.08)',border:`1px solid ${cd>0?'rgba(255,255,255,0.1)':'rgba(255,255,255,0.3)'}`,borderRadius:7,cursor:cd>0?'not-allowed':'pointer',color:cd>0?'#555':'#fff',fontSize:11,whiteSpace:'nowrap',position:'relative',overflow:'hidden'});
    return(
      <div style={{display:'flex',alignItems:'center',gap:6,flex:1}}>
        <span style={{fontSize:11,color,fontWeight:700}}>{label}</span>
        {!unlocked?<span style={{fontSize:10,color:'#555'}}>{t('locked')}</span>:<>
          <button onClick={()=>useSkill(pi,'off')} style={btn(offLeft)}>
            {offLeft>0&&<div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:'#aaa'}}>{offLeft}s</div>}
            <span style={{fontSize:14}}>👻</span><span style={{fontWeight:600}}>{t('ghost')}</span>
            <span style={{background:'rgba(0,0,0,0.4)',padding:'1px 4px',borderRadius:3,fontSize:10,color:'#888'}}>{offK}</span>
          </button>
          <button onClick={()=>useSkill(pi,'def')} style={btn(defLeft)}>
            {defLeft>0&&<div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:'#aaa'}}>{defLeft}s</div>}
            <span style={{fontSize:14}}>🧱</span><span style={{fontWeight:600}}>{t('wall')}</span>
            <span style={{background:'rgba(0,0,0,0.4)',padding:'1px 4px',borderRadius:3,fontSize:10,color:'#888'}}>{defK}</span>
          </button>
        </>}
      </div>
    );
  };

  // Touch control: hold sets key true, release sets false
  const holdKey=(key)=>({
    onPointerDown:(e)=>{e.preventDefault();keys.current[key]=true;},
    onPointerUp:(e)=>{e.preventDefault();keys.current[key]=false;},
    onPointerLeave:()=>{keys.current[key]=false;},
    onPointerCancel:()=>{keys.current[key]=false;},
  });
  const tapSkill=(pi,type)=>({onPointerDown:(e)=>{e.preventDefault();useSkill(pi,type);}});

  const TouchPad=({side})=>{
    // side 'L' uses keys a/d/w/s + q/z ; side 'R' uses arrows + u/j
    const isL=side==='L';
    const kLeft=isL?'a':'arrowleft',kRight=isL?'d':'arrowright',kJump=isL?'w':'arrowup',kGrab=isL?'s':'arrowdown';
    const pi=isL?0:1;
    const myGoals=isL?score.l:score.r;
    const unlocked=myGoals>=2;
    const col=isL?'#00CED1':'#FF6666';
    const dpad={width:56,height:56,borderRadius:12,background:'rgba(255,255,255,0.1)',border:`1px solid ${col}55`,color:'#fff',fontSize:22,display:'flex',alignItems:'center',justifyContent:'center',touchAction:'none',userSelect:'none'};
    const actBtn={width:56,height:56,borderRadius:'50%',background:'rgba(255,255,255,0.1)',border:`1px solid ${col}55`,color:'#fff',fontSize:20,display:'flex',alignItems:'center',justifyContent:'center',touchAction:'none',userSelect:'none'};
    return(
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',gap:10,flex:1}}>
        {/* movement */}
        <div style={{display:'flex',gap:8}}>
          <div {...holdKey(kLeft)} style={dpad}>◀</div>
          <div {...holdKey(kRight)} style={dpad}>▶</div>
        </div>
        {/* actions */}
        <div style={{display:'flex',gap:8,alignItems:'flex-end'}}>
          {unlocked&&<div {...tapSkill(pi,'off')} style={{...actBtn,fontSize:22}}>👻</div>}
          {unlocked&&<div {...tapSkill(pi,'def')} style={{...actBtn,fontSize:22}}>🧱</div>}
          <div {...holdKey(kGrab)} style={actBtn}>✊</div>
          <div {...holdKey(kJump)} style={{...actBtn,background:`${col}33`,fontSize:24}}>⤴</div>
        </div>
      </div>
    );
  };

  return(
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:'#111',color:'#fff',fontFamily:'sans-serif',userSelect:'none'}}>

      {screen==='lang'&&(
        <div style={{textAlign:'center',maxWidth:500,padding:24}}>
          <div style={{fontSize:40,marginBottom:8}}>⚽</div>
          <div style={{fontSize:28,fontWeight:900,marginBottom:4,background:'linear-gradient(90deg,#00CED1,#FFD700)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Slime Soccer</div>
          <div style={{color:'#666',marginBottom:24,fontSize:13}}>Select your language / Dil seçin</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10}}>
            {Object.keys(LANGS).map(k=>(
              <button key={k} onClick={()=>{setLang(k);setScreen('menu');}}
                style={{padding:'12px 8px',background:lang===k?'rgba(0,206,209,0.2)':'rgba(255,255,255,0.05)',border:`1px solid ${lang===k?'#00CED1':'rgba(255,255,255,0.15)'}`,borderRadius:10,cursor:'pointer',color:'#fff',fontSize:13,display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
                <span style={{fontSize:22}}>{LANGS[k].flag}</span>
                <span style={{fontWeight:600}}>{LANGS[k].name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {screen==='menu'&&(
        <div style={{textAlign:'center',maxWidth:680,padding:24}}>
          <div style={{fontSize:46,fontWeight:900,marginBottom:6,background:'linear-gradient(90deg,#00CED1,#FFD700,#FF4500)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>{t('title')}</div>
          <div style={{color:'#888',marginBottom:28,fontSize:13}}>{t('subtitle')}</div>
          <div style={{display:'flex',gap:16,justifyContent:'center',marginBottom:24}}>
            <button onClick={()=>startGame('single')} style={{padding:'13px 30px',background:'#00CED1',border:'none',borderRadius:10,fontSize:17,fontWeight:700,cursor:'pointer',color:'#000'}}>{t('single')}</button>
            <button onClick={()=>startGame('multi')} style={{padding:'13px 30px',background:'#DC143C',border:'none',borderRadius:10,fontSize:17,fontWeight:700,cursor:'pointer',color:'#fff'}}>{t('multi')}</button>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:20,textAlign:'left'}}>
            <div style={{background:'rgba(0,206,209,0.1)',border:'1px solid rgba(0,206,209,0.3)',borderRadius:10,padding:12}}>
              <div style={{color:'#00CED1',fontWeight:700,marginBottom:6,fontSize:12}}>{t('leftP')}</div>
              <div style={{fontSize:12,color:'#aaa'}}>{t('move')}: A / D</div>
              <div style={{fontSize:12,color:'#aaa'}}>{t('jump')}: W &nbsp; {t('grab')}: S</div>
              <div style={{fontSize:12,color:'#aaa',marginTop:4,borderTop:'1px solid rgba(255,255,255,0.1)',paddingTop:4}}>👻 {t('ghost')}: <b>Q</b></div>
              <div style={{fontSize:12,color:'#aaa'}}>🧱 {t('wall')}: <b>Z</b></div>
            </div>
            <div style={{background:'rgba(220,20,60,0.1)',border:'1px solid rgba(220,20,60,0.3)',borderRadius:10,padding:12}}>
              <div style={{color:'#FF6666',fontWeight:700,marginBottom:6,fontSize:12}}>{t('rightP')}</div>
              <div style={{fontSize:12,color:'#aaa'}}>{t('move')}: ← / →</div>
              <div style={{fontSize:12,color:'#aaa'}}>{t('jump')}: ↑ &nbsp; {t('grab')}: ↓</div>
              <div style={{fontSize:12,color:'#aaa',marginTop:4,borderTop:'1px solid rgba(255,255,255,0.1)',paddingTop:4}}>👻 {t('ghost')}: <b>U</b></div>
              <div style={{fontSize:12,color:'#aaa'}}>🧱 {t('wall')}: <b>J</b></div>
            </div>
          </div>
          <div style={{display:'flex',flexWrap:'wrap',gap:5,justifyContent:'center',marginBottom:16}}>
            {LEVELS.map((l,i)=><span key={i} style={{padding:'3px 9px',borderRadius:20,background:l.bg[0],fontSize:11,border:'1px solid rgba(255,255,255,0.2)',color:'#fff',textShadow:'0 0 4px #000'}}>{i+1}. {l.emoji} {lvName(i)}</span>)}
          </div>
          <button onClick={()=>setScreen('lang')} style={{padding:'6px 16px',background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.2)',borderRadius:8,color:'#aaa',cursor:'pointer',fontSize:12}}>
            {LANGS[lang].flag} {LANGS[lang].name} ▾
          </button>
        </div>
      )}

      {screen==='game'&&(
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',width:'100%',maxWidth:GW,padding:isMobile?'4px':0,boxSizing:'border-box'}}>
          <div style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'space-between',background:'rgba(0,0,0,0.8)',padding:'6px 14px',borderRadius:'10px 10px 0 0',boxSizing:'border-box'}}>
            <div style={{color:'#00CED1',fontWeight:700,fontSize:20}}>🟦 {score.l}</div>
            <div style={{textAlign:'center'}}>
              <div style={{fontSize:12,color:'#aaa'}}>{t('levelLabel')} {level+1}{t('sep')}15 — {lvName(level)} · {lv.emoji} {foe(level)}</div>
              <div style={{width:180,height:5,background:'#333',borderRadius:3,margin:'3px auto',overflow:'hidden',maxWidth:'40vw'}}>
                <div style={{width:`${prog}%`,height:'100%',background:`linear-gradient(90deg,${lv.ec},#FFD700)`,borderRadius:3}}/>
              </div>
              <div style={{fontSize:10,color:'#666'}}>{total}{t('sep')}{GOALS_PER_LEVEL} {t('goals')}</div>
            </div>
            <div style={{color:'#FF6666',fontWeight:700,fontSize:20}}>{score.r} 🟥</div>
          </div>
          {!isMobile&&(
            <div style={{width:'100%',background:'rgba(0,0,0,0.7)',padding:'5px 12px',boxSizing:'border-box',display:'flex',alignItems:'center',gap:8,borderTop:'1px solid rgba(255,255,255,0.07)'}}>
              <SkillBar pi={0} color='#00CED1' label='🟦'/>
              <div style={{width:1,height:24,background:'rgba(255,255,255,0.1)'}}/>
              <SkillBar pi={1} color='#FF6666' label='🟥'/>
            </div>
          )}
          <div style={{position:'relative',width:'100%'}}>
            <canvas ref={cvs} width={GW} height={GH} style={{display:'block',border:'3px solid #222',width:'100%',height:'auto',touchAction:'none'}}/>
            {lvAnim&&(
              <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,0.75)'}}>
                <div style={{fontSize:'min(46px,7vw)',fontWeight:900,color:'#FFD700'}}>🎉 {t('levelUp')} {level+1}!</div>
                <div style={{fontSize:'min(20px,4vw)',color:LEVELS[Math.min(level+1,14)].ec,marginTop:10}}>{LEVELS[Math.min(level+1,14)].emoji} {foe(Math.min(level+1,14))}</div>
                <div style={{fontSize:'min(14px,3vw)',color:'#888',marginTop:6}}>{lvName(Math.min(level+1,14))} {t('welcome')}</div>
              </div>
            )}
            {paused&&!lvAnim&&(
              <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,0.7)'}}>
                <div style={{fontSize:'min(42px,7vw)',fontWeight:900,color:'#fff',letterSpacing:2}}>⏸ {t('paused')}</div>
                <button onClick={togglePause} style={{marginTop:18,padding:'10px 28px',background:'#00CED1',border:'none',borderRadius:10,fontSize:16,fontWeight:700,cursor:'pointer',color:'#000'}}>{t('resume')}</button>
              </div>
            )}
          </div>

          {/* Mobile touch controls */}
          {isMobile&&(
            <div style={{width:'100%',display:'flex',flexDirection:'column',gap:8,marginTop:8}}>
              {pMode==='multi'&&(
                <div style={{background:'rgba(0,0,0,0.5)',borderRadius:10,padding:'8px 10px'}}>
                  <div style={{fontSize:10,color:'#00CED1',fontWeight:700,marginBottom:4}}>🟦</div>
                  <TouchPad side='L'/>
                </div>
              )}
              <div style={{background:'rgba(0,0,0,0.5)',borderRadius:10,padding:'8px 10px'}}>
                <div style={{fontSize:10,color:'#FF6666',fontWeight:700,marginBottom:4}}>🟥</div>
                <TouchPad side='R'/>
              </div>
            </div>
          )}

          <div style={{marginTop:8,display:'flex',gap:10}}>
            <button onClick={togglePause} style={{padding:'7px 20px',background:paused?'#00CED1':'#444',border:'none',borderRadius:6,color:paused?'#000':'#fff',cursor:'pointer',fontSize:14,fontWeight:600}}>{paused?t('resume'):t('pause')}</button>
            <button onClick={()=>{cancelAnimationFrame(rafId.current);pausedRef.current=false;setPaused(false);setScreen('menu');}} style={{padding:'7px 18px',background:'#333',border:'none',borderRadius:6,color:'#aaa',cursor:'pointer',fontSize:14}}>↩ {t('menu')}</button>
          </div>
        </div>
      )}

      {screen==='gameover'&&(
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:56,marginBottom:12}}>🏆</div>
          <div style={{fontSize:34,fontWeight:900,color:'#FFD700',marginBottom:8}}>{t('congrats')}</div>
          <div style={{fontSize:17,color:'#aaa',marginBottom:24}}>{t('allDone')}</div>
          <button onClick={()=>setScreen('menu')} style={{padding:'12px 28px',background:'#FFD700',border:'none',borderRadius:10,fontSize:17,fontWeight:700,cursor:'pointer',color:'#000'}}>{t('playAgain')}</button>
        </div>
      )}
    </div>
  );
}
