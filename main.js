



  var lastFpsTime = Date.now();
  var curFps = 0;
  var appTime = 0;
  var rendTime = 0; //time spent on rendering 
  var skipTime = 0;
   
   var rendSkip = 0;
   
  var wireMode = false; 
  
  var tileDataUp =  [];
  var tileDataDown =  [];
  
  //  getTile(tileDataUp, ax, ay);
    //getTile(tileDataDown, ax, ay);
  
  
   
  function countFps()
  {
    appTime += 1;
    d = (Date.now() - lastFpsTime)/1000;
    lastFpsTime = Date.now();
    if (appTime % 5 == 0)
    { curFps = (1.0 / d) | 0; }
  }//countfps
    
  var inFocus = false;
  var prevPaused = false; 
  var prevFocus = false;
  

  function resetGame()
  {
    gt = 0;
    gameOver = 0;
    setRandSeed(1000);
  
  }//resetgame
  
  
  
  function init()
  {
    console.log("init");

    //r_imgdata backdrop
    //320x240 resolution
    
    clearDataPix(128,64,64);
    
    //todo -- turn all sounds to be in a single .js 
    
    
    //add new sprite 
    //copy image into spr8 dir 
    //run makesp 

    loadImageToSpr(spr8png);

    //load test texture 
     loadImageToSkin(texpng, "test");
      setSkin("test");

     loadImageToSkin(spr8png, "spr8");
     loadTileToSkin(texture3png); //0-255
    
    //add new sound 
    //copy over mp3
    //add mp3 in makesp.bat 
    //run makesp bat 
    //add sound here     
    
    //loadSound(snd1mp3, "snd1", 3);
    loadSound(snd3mp3, "snd3", 3);  //old gameover sound 
    loadSound(snd5mp3, "snd5", 8);

    loadSound(snddoormp3,     "door",     3);
    loadSound(sndpushwallmp3, "pushwall", 3);
    loadSound(sndfiremp3,     "fire",     3);
    loadSound(sndpickupmp3,   "pickup",   3);
    loadSound(sndexplomp3,    "explo",    3);
    
    loadSound(sndattack1mp3,    "attack1",     3);
    loadSound(sndnotice1mp3,    "notice1",     3);
    loadSound(sndpainmp3,       "pain",     3);
    loadSound(sndgunmp3,        "gun",     3);
    loadSound(sndgameovermp3,   "gameover",     3);
  
    loadConfig();
    resetKeys(); 
    resetGame();
        
     //todo -- is this music streamed?
     //loadsound only sets the name so maybe 
     //but changing music seems to be tricky 
     //todo -- if put in the update 
     //curMus.play is undefined (???)
     //so calling it more than once is tricky 

     //but for now stfu
     /*
      loadSound("bgm.mp3", "bgm");
      playMus("bgm", 0.5);   
      */
      
      playMus("bgm.mp3", 0.5);   
  }//init
  
 

    
  function controls()
  {

    mouseUpdate();
    keyCheck(); 
    limitMouse(0,0,320,240);
      
    inFocus = (mouseLook == true);
    if (inFocus == false) 
    {
      if (paused==false) { pauseAllSnd();}
      paused = true; 
      clearKey();
    }//endif

    keyTime += 1;
    if (lastKey == keyTime-1 && inFocus) 
    {
      //f (lastKeyId!=27) { paused = false; }
      //P
      if (lastKeyId==80) { paused = !paused; }
    }//endif
    
    
    if (prevPaused != paused)
    {
      prevPaused = paused;
      //if (paused) { pauseAllSnd(); }
     // else { resumeAllSnd(); }
    }//endif 
    
   if (prevFocus != inFocus)
    {
      prevFocus = inFocus;
      if (inFocus == false) { pauseAllSnd(); }
      else { resumeAllSnd(); }
    }//endif 

    
    
  }//controls  
  
  
  function afterUpdate()
  {
    
   resetBtn(); resetBtnCol();  

  //paused menu 
    drawMenu();

   resetBtn(); resetBtnCol(); 

   if (false)
   {     
     sprBtn(900, "icon_pause",320-24, 4, 18,18);
     
     if (muteVol > 0.1) { sprBtn(903, "icon_sound",320-24-24, 4, 18,18); }
     else { sprBtn(903, "icon_muted",320-24-24, 4, 18,18); }
     
     sprBtn(901, "icon_full",320-24-24-24, 4, 18,18);
   }
   
   var ratOn; ratOn = false;
   if (mouseAim == false || paused) { ratOn = true;}
   
   if (ratOn)
   {
     if (btnPush == 900)   { paused = !paused; }
     if (btnPush == 901)   { toggleFullScreen(); }
     if (btnPush == 903)   { if (muteVol>0){muteVol=0.0;}else{muteVol=1.0;} recalMusVol(); }  
   }  
 
   //debug stuff 
   if (bDebug)
   {
    countFps();
    ctx.font = "8px Arial";
    ctx.fillStyle = "#ffFFff";
    //ctx.strokeStyle = "#000000"; 
    var ax, ay;
    ax = 3; ay = 8;
    ctx.fillText("fps:"+curFps,ax, ay); ay+=8;
    ctx.fillText("gt:"+gt, ax, ay); ay+=8;
    ctx.fillText("keyTime:"+keyTime, ax, ay); ay+=8;
    ctx.fillText("vmx:"+vmx, ax, ay); ay+=8;
    ctx.fillText("vmy:"+vmy, ax, ay); ay+=8;
    ctx.fillText("mbutton:"+mbutton, ax, ay); ay+=8;
    ctx.fillText("gameState:"+gameState,ax, ay); ay+=8;
    ctx.fillText("mapReach:"+mapReach,ax, ay); ay+=8;
    ctx.fillText("rendTime:"+rendTime,ax, ay); ay+=8;
    ctx.fillText("skipTime:"+skipTime,ax, ay); ay+=8;
    ctx.fillText("curGun:"+curGun,ax, ay); ay+=8;
//    ctx.fillText("mvx:"+mvx, ax, ay); ay+=8;
//    ctx.fillText("mvy:"+mvy, ax, ay); ay+=8;
//    ctx.fillText("camx:"+camx, ax, ay); ay+=8;
//    ctx.fillText("camy:"+camy, ax, ay); ay+=8;
//    ctx.fillText("wmx:"+wmx, ax, ay); ay+=8;
//    ctx.fillText("wmy:"+wmy, ax, ay); ay+=8;
//    ctx.fillText("act:"+(vecAct.length), ax, ay); ay+=8;
//    ctx.fillText("bull:"+(vecBull.length), ax, ay); ay+=8;
   }//endif
    
    if (inFocus == false)
    {  
      
     // ctx.font = "16px Arial";
        //ctx.fillText("out of focus", 32, 64);  
      ctx.fillStyle = "#00000080";
      ctx.fillRect(0, 0, 320, 240);
      //drawFont3Scale(40,40, 2,2, "OUT OF FOCUS");
      drawFont5(70,40, "OUT OF FOCUS");
      
    }
 
    //redraw mouse 
    if (ratOn)
    { drawRat(); }
 
  }//afterupdate
  
  
////////////////////////////////////////////////////////////////////////////////////
  
  function getMag(dx, dy)  { return Math.sqrt(dx*dx + dy*dy); }
  
 
 function wallTest(ax,ay)
 { var t; t = getTile(vecMid,ax/tilew,ay/tileh); return t > lastNoCol; }
  
 function getWallTile(ax,ay)
 { return getTile(vecMid,ax/tilew,ay/tileh); }
  
 function getMapTile(tx,ty)
 { return getTile(vecMid,tx,ty); }
 
   
   function setWall(ax, ay, t)
   { 
      setTile(vecMid,Math.floor(ax/tilew), Math.floor(ay/tileh),t);
      updateFlag3(Math.floor(ax/tilew), Math.floor(ay/tileh));
   }//setwall
   
 
  function canSee(ax, ay, bx, by)
  {
    var d; var dx, dy;
    var i; var num;
    dx = bx-ax;
    dy = by-ay;
    d = getMag(dx, dy);
    if (d < 16) { return true; }
    dx /= d;
    dy /= d;
    dx *= 8;
    dy *= 8;
    num = d / 8;
    for (i=0;i<num;i+=1)
    {
      if (wallTest(ax,ay)) { return false; }
      ax += dx;
      ay += dy;
    }//nexti 
    return true;
  }//cansee
  
  //a actor  (obj)
  //rad  radius (float)
  //bt   bounce time (1.0 default -- slide)
  function mapMove(a, rad, bt)
  {
    var tx, tz;
    var k, i; var t;
    var bx, bz;
    var ix, iz;
    var px, pz;
    var d;
    var ta;
    var nx, nz;
    var dot;
    var ret;
    ret = false;
    
    px = a.cx;
    pz = a.cy;
    
    tx = (px / tilew)|0;
    tz = (pz / tileh)|0;
    for (i = -1; i <= 1; i += 1) 
    {
     for (k = -1; k <= 1; k += 1) 
     {
        t = getMapTile( tx+k, tz+i );
        if (t<=lastNoCol) {continue;}
        
         bx = (tx+k)*tilew; 
         bz = (tz+i)*tileh;
        
         if (px < bx) {ix = bx; }
         else if (px > bx+tilew)  { ix = bx + tilew; }
         else {ix=px;}
         if (pz < bz) {iz = bz; }
         else if (pz > bz+tileh)  { iz = bz + tileh; }
         else {iz=pz;}

         nx = ix-px; nz = iz-pz;
         d = getMag(nx,nz);
         if (d<=0.0){d=0.01;}

         if (d > rad) { continue; }
         
         nx /= d;         nz /= d;
            
         //dot = a.vz * nz + a.vx * nx;
         dot = a.vy * nz + a.vx * nx;
         
         if (dot > 0.0)
         {  
           dot *= bt;
           a.vx -=  nx * dot; 
           a.vy -=  nz * dot;       
           //a.vz -=  nz * dot;       
           ret = true;

         }//endif
    
     }//nextk
    }//nexti
    return ret;
  }//mapmove
  
  
  
  
  function playPushTile(a, rad, dx, dy)
  {
    var sx, sz;
    var tx, tz;
    var k, i; var t;
    var bx, bz;
    var ix, iz;
    var px, pz;
    var d;
    var ta;
    var nx, nz;
    var dot;
    var ret;
    var dx, dy;
    var tw;
    
    ret = false;
    
    px = a.cx;
    pz = a.cy;
    
    sx = (px / tilew)|0;
    sz = (pz / tileh)|0;
    
    //test around the tile 
    //    .#.
    //    #P#
    //    .#.
    
    for (i = -1; i <= 1; i += 1) 
    {
     for (k = -1; k <= 1; k += 1) 
     {
       //dont push diagonal
       if (Math.abs(k) == Math.abs(i)) { continue; } //skip diag
       
       tx = sx + k;
       tz = sz + i;
        t = getMapTile( tx, tz );
        if (t<=lastNoCol) {continue;}
        if (t != pushTile) { continue; }
        
         bx = (tx)*tilew; 
         bz = (tz)*tileh;
          
         //speed and dir of push          
         dx = k;
         dy = i;
         if (dy != 0) { dx = 0; }
        
         if (px < bx) {ix = bx;  }
         else if (px > bx+tilew)  { ix = bx + tilew;  }
         else {ix=px;}
         if (pz < bz) {iz = bz;   }
         else if (pz > bz+tileh)  { iz = bz + tileh;  }
         else {iz=pz;}
         
    

         nx = ix-px; nz = iz-pz;
         d = getMag(nx,nz);
         if (d<=0.0){d=0.01;}

         if (d > rad) { continue; }
         
         
        if (getTile(vecMid,  tx+dx, tz+dy) < 1)
        {
         setTile(vecMid, tx, tz, 0);
         updateFlag3(tx, tz);
         
          a.vx *= 0.0;
          a.vy *= 0.0;
         
            playSnd("pushwall",1.0);
         
           var b;
           b = addAct();
            b.sprName = "pushtile";
             b.cx = (tx) * tilew + tilew * 0.50;
             b.cy = (tz) * tileh + tileh * 0.50;
             b.vx = dx;
             b.vy = dy;
             b.hp = tilew*2; //need to move 2 spaces 
             //pushtile steals the lower tile 
             //todo -- this means they cannot be pushed down..
             //update -- oh well 
              tw = getTile(vecMid,  tx, tz+1);
              if (tw == 0)
              { tw = getTile(vecMid,  tx+1, tz); }
             b.reload = tw;
             b.funcUpdate = pushBlockUpdate; 
             b.funcRender = renderPushBlock;
           
        }//endif3
         
         //nx /= d;         nz /= d;
            
            /*
         //dot = a.vz * nz + a.vx * nx;
         dot = a.vy * nz + a.vx * nx;
         
         if (dot > 0.0)
         {  
           dot *= bt;
           a.vx -=  nx * dot; 
           a.vy -=  nz * dot;       
           //a.vz -=  nz * dot;       
           ret = true;

         }//endif
         */
    
     }//nextk
    }//nexti
    return ret;
  }//pushtile

  
  function colFuncTest(m, a)
  {
    //m  actor testing 
    //a  actor m collided with
    
    //a.sprName = "chomp0";
    if (a.hp <= 0) { return true; }
    
    if (m.vx > 0 && a.cx > m.cx) { m.vx *= -1; m.wallhit |= 1; }
    else if (m.vx < 0 && a.cx < m.cx) { m.vx *= -1; m.wallhit |= 1; }
    if (m.vy > 0 && a.cy > m.cy) { m.vy *= -1; m.wallhit |= 1;  }
    else if (m.vy < 0 && a.cy < m.cy) { m.vy *= -1; m.wallhit |= 1;  }
    
   return true;
  }//colFuncTest
  
  
  function testUpdate(a)
  {
    if (a.state == 0)
    {
      a.state = 1;
      a.vx = getRand2();
      a.vy = getRand2();
    }
    
    a.wallhit = 0;
    if (a.vx > 0.0 && wallTest(a.cx+a.vx+a.crad,a.cy)) { a.vx *=-1; a.wallhit |= 1; }
    if (a.vx < 0.0 && wallTest(a.cx+a.vx-a.crad,a.cy)) { a.vx *=-1; a.wallhit |= 1; }
    if (a.vy > 0.0 && wallTest(a.cx,a.cy+a.vy+a.crad)) { a.vy *=-1; a.wallhit |= 1; }
    if (a.vy < 0.0 && wallTest(a.cx,a.cy+a.vy-a.crad)) { a.vy *=-1; a.wallhit |= 1; }
    
    checkActCol(a, colFuncTest);
    
    if (a.wallhit <= 0)
    {
     a.cx += a.vx;
     a.cy += a.vy;
    }
    
    putInGrid(a);
  }//testupdate 
  
  function monstRender(a)
  {
    if (isVis3(a.cx,a.cy) == false) { return; }
    
    cullTri = false;
     
     setPixel = setPixelShad;
     drawSprShad(a.rendSpr, a.cx, 0.50, a.cy, 8, -camYaw-1.57);
      
     
     setPixel = setPixelLight;
     drawSprCam(a.rendSpr, a.cx, a.cz, a.cy, 16,16, -camRoll);
     
    cullTri = true;
     
     
  }//rendermonst

  function colFuncMonst(m, a)
  {
    //m  actor testing 
    //a  actor m collided with
    
    //a.sprName = "chomp0";

    //door 
    if (a.spec == 3)
    {
      if (a.cmd == 0)
      { a.cmd = 1; }
      else { a.wait = 0; }    
      return true;
    }//endif 

    if (a.hp <= 0) { return true; }
    
    //hurt player if too close 
    if (a.spec == 1 && m.hp > 1 && m.team != a.team )
    {
      if (a.dmgTime < gt) 
      {
        a.dmgTime = gt + 10; a.hp -= 3; redFade = 1.0; 
        playSnd("pain", 1.0);
      }
    }//endif 
    
    if (m.vx > 0 && a.cx > m.cx) { m.vx *= -1; m.wallhit |= 1; }
    else if (m.vx < 0 && a.cx < m.cx) { m.vx *= -1; m.wallhit |= 1; }
    if (m.vy > 0 && a.cy > m.cy) { m.vy *= -1; m.wallhit |= 1;  }
    else if (m.vy < 0 && a.cy < m.cy) { m.vy *= -1; m.wallhit |= 1;  }
    
   return true;
  }//colFuncMonst
  
  function monstThink(a)
  {
    if ( (gt + a.id) % 60 == 0)
    {
      //todo -- hack -- for now player pos is assumed to be camera pos 
      a.targValid = 0;
      if (canSee(a.cx, a.cy, camPos.x, camPos.z))
      {
        if (a.state == 0) { a.state = 70; }
        a.targid = playerId;
        a.targValid = 1;
        a.targx = camPos.x;
        a.targy = camPos.z;        
      }//endif3 
    }//endif 
  }//thinkmonst 
  
  //default states 
  function monstState(a)
  {
    if (a.state == 0)
    {
      a.state = 1;
      a.vx = Math.cos(a.ang)*0.50;
      a.vy = Math.sin(a.ang)*0.50;
    }//endifstate0
    
    if (a.state == 1)
    {
      if (a.targValid > 0)
      {
        a.stateCount += getRand()*3;
        if (a.stateCount >= 90)
        { a.stateCount = 0; a.state = 3; }        
      }
      
      
      if (a.targValid == 1 && (gt+a.id)%60 == 0)
     {
      
      if (a.wallhit > 0) { a.targValid = 2; }
      else 
      {
        
       d = getMag(a.cx - a.targx, a.cy-a.targy);
       if (d < 64) { a.targValid = 2; }
       else 
       {
       // ta = Math.atan2(a.targx-a.cx, a.targy-a.cy);
        ta = Math.atan2(a.cx-a.targx, a.cy-a.targy);
        a.ang = -ta-1.57;
        a.vx = Math.cos(a.ang)*0.5;
        a.vy = Math.sin(a.ang)*0.5;
       }
      }//endif3
    }//endifstate1 

    
    }//endif 
    
    if (a.state == 3)
    {
      a.vx *= 0.90;
      a.vy *= 0.90;
      a.stateCount += 1; 
        
        
        ta = Math.atan2(a.cx-a.targx, a.cy-a.targy);
        a.ang = -ta-1.57;
        
      if (a.stateCount == 20)
      {
          var b;
           b = addAct();
            b.sprName = "orb";
            b.cx = a.cx;
            b.cy = a.cy;
            b.cz = 8;
            b.dmg = 23;
            b.hp = 150;
            b.ownerid = a.id;
            b.team = a.team;
            b.vx = Math.cos(a.ang)*2;
            b.vy = Math.sin(a.ang)*2;                       
            b.funcRender = renderBull;
            b.funcUpdate = bullUpdate;        
      }//endif3
      if (a.stateCount >= 30)
      {
        a.stateCount = 0;
        a.state = 1;
      }//endif3
    }//endifstate3  
    
  }//monststate 
  
  function monstUpdate(a)
  {
    var ta; var d;
      
    monstThink(a);

    if (a.funcState != undefined) { a.funcState(a); }    
    
    a.wallhit = 0;
    if (a.vx > 0.0 && wallTest(a.cx+a.vx+a.crad,a.cy)) { a.vx *=-1; a.wallhit |= 1; }
    if (a.vx < 0.0 && wallTest(a.cx+a.vx-a.crad,a.cy)) { a.vx *=-1; a.wallhit |= 1; }
    if (a.vy > 0.0 && wallTest(a.cx,a.cy+a.vy+a.crad)) { a.vy *=-1; a.wallhit |= 1; }
    if (a.vy < 0.0 && wallTest(a.cx,a.cy+a.vy-a.crad)) { a.vy *=-1; a.wallhit |= 1; }
    
    checkActCol(a, colFuncMonst);
    
    if (a.wallhit <= 0)
    {
     a.cx += a.vx;
     a.cy += a.vy;
    }
    
    putInGrid(a);
  }//monstupdate 
  
  
  function renderMonstBull(a)
  {
     drawSprCam(a.rendSpr, a.cx, a.cz, a.cy, 8,8, 0);
    
  }//rendermonstbull

  function renderBull(a)
  {
     drawSprCam("bigexplo0", a.cx, a.cz, a.cy, 8,8, 0);
    
  }//renderbull 
  
  //monstdamage
  function damageMonst(a, dmg)
  {
    if (a.dead) { return; }
    
    //dont hurt player so much 
    if (a.spec == 1)
    { if (a.dmgTime > gt) { return; }         playSnd("pain", 1.0);  redFade = 1.0; }
    
    a.hp -= dmg;
    a.dmgTime = gt + 30;

    
    
    //console.log(gt, "damagemonst ", a.hp, a.state,a.spec, dmg);
    
    if (a.hp <= 0 && a.spec == 13)
    {
      if (a.state >= 100)
      { if (a.hp<-50){a.dead=true; } return; }
       
       a.team = -1; 
       a.state = 100; 
      return;
    }//endif 

    if (a.hp <= 0) 
    { 
      makeExploFx(a.cx, a.cy, 8);
      a.dead = true; 
      return;
    }//endif 
  
  }//damagemonst 
 
  function colFuncBull(m, a)
  {
    if (m.ownerid == a.id) { return true; }
    if (a.team < 0) { return true; }
    if (a.dead) { return true; }
    
    //hack -- smaller box for player 
    //update -- use brad (bullet radius) for all actor 
    //if (a.team == 1)
    {
      var d;
      d = getMag(m.cx-a.cx, m.cy-a.cy);
      if (d > (a.brad+m.brad)) { return true; }
    }//endif 
  
    damageMonst(a, m.dmg);  
    a.vx += m.vx*0.3;
    a.vy += m.vy*0.3;    
  
     m.dead = true;     
    
    return false; 
  }//colFuncBull
  


  function bullUpdate(a)
  {
    
    checkActCol(a, colFuncBull);
    
   
    if ( wallTest(a.cx+a.vx,a.cy+a.vy)) 
    {
      a.dead=true;
      
      //let player destroy some tiles 
      if (a.team == 1  && lastTile == exploTile && a.dmg > 20)
      { 
        setWall(a.cx+a.vx, a.cy+a.vy, 0);
        //updateFlag3((a.cx/tilew)|0, (a.cy/tileh)|0);
        playSnd3("explo",1,a.cx,8,a.cy);
        /*
        var p;
          p = addPart();
          p.animName = "tileexplo";
          p.cx = ((a.cx/tilew)|0)*tilew+tilew*0.50;
          p.cy = ((a.cy/tileh)|0)*tileh+tileh*0.50;
           p.curFrame = 0;
           p.size = 16;
           */
      }//endif3
    }//endif
    
    a.cx += a.vx;    
    a.cy += a.vy;
    a.cz += a.vz; 
      
    //hit floor or ceiling 
    if (a.cz < 3 || a.cz > 13) { a.dead = true; }
      
     a.hp -= 1;
    
     if (a.hp<=0) {a.dead=true;}
    
    if (a.dead)
    {
      var p;
      p = addPart();
      p.cx = a.cx;
      p.cy = a.cy;
      p.cz = a.cz; 
      p.cx -= a.vx * 2;
      p.cy -= a.vy * 2;
      p.cz -= a.vz * 2;
      p.animName = "explo";
      p.curFrame = 0;  
    }
    
  }//bullupdate 
  

  function renderPushBlock(a)
  {
    //no vischeck -- always pushed by player 
     //drawSprCam("bigexplo0", a.cx, 8, a.cy, 8,8, 0);
    
      drawTri = drawTriSkin;
       setSkin(a.reload);

       drawBlock(0, a.cx-8, a.cy-8, 16)  
            
    //hack -- restore rendering
     drawTri = drawTriMask;
         setSkin("spr8");
  }//renderbull 
  
  function pushBlockUpdate(a)
  {
    
    a.hp -= 1;
    if (a.hp <= 0) 
    { 
      a.dead = true; 

      var tx, ty; var tw;
         tx = Math.floor(a.cx / tilew);
         ty = Math.floor(a.cy / tileh);
        setTile(vecMid, tx, ty, a.reload);
        updateFlag3(tx, ty);
      return;
    }//endif
    
    a.cx += a.vx;
    a.cy += a.vy;
    
  }//pushBlockUpdate
  
  
  
  
      
    /*
    var xmap_rect_numrect = 2;
    var xmap_rect = [ 
    { name:"test",  type:"test",  cx:175,  cy:152,  ang:0.00,  rx:144,  ry:128,  rw:63,  rh:48  },
    { name:"player",  type:"player",  cx:244,  cy:140,  ang:0.00,  rx:232,  ry:128,  rw:24,  rh:24  } 
    ];
    */



  var tempDoorSpr = { u0:0.0, u1:1.0, v0:0.0, v1:1.0 };
  
  
  function renderDoor(a)
  {
     //drawSprCam("bigexplo0", a.cx, 8, a.cy, 8,8, 0);
     cullTri = false;
     drawTri = drawTriSkin;     
     if (wireMode) { drawTri = drawTriWire; }
     setSkin(253);
     
     var b;
 //    b = getSpr("bigdoor");
     b = tempDoorSpr;
      bquad.u0 = b.u1; bquad.v0 = b.v0 + (b.v1-b.v0)*0.5; 
      bquad.u1 = b.u0; bquad.v1 = bquad.v0; 
      bquad.u2 = b.u1; bquad.v2 = b.v0;
      bquad.u3 = b.u0; bquad.v3 = b.v0; 

      bquad.x0 = a.cx;       bquad.z0 = a.cy;
      bquad.x1 = a.cx;       bquad.z1 = a.cy;
      bquad.x2 = a.cx;       bquad.z2 = a.cy;
      bquad.x3 = a.cx;       bquad.z3 = a.cy; 
             
       
     var y0, y1;
     var i; var ax, az;
     ax = a.cx - a.xrad;
     az = a.cy - a.yrad;
     for (i=0;i<a.reload;i+=1)
     {

       if (a.state == 1)
       {
        if (isVis(a.tx+i,a.ty)==false) { ax+=16; continue; }
        bquad.x0 = ax;    
        bquad.x1 = ax+16; 
        bquad.x2 = ax;    
        bquad.x3 = ax+16;
       }
       else
       {
        if (isVis(a.tx,a.ty+i)==false) { az+=16; continue; }
        bquad.z0 = az;    
        bquad.z1 = az+16; 
        bquad.z2 = az;    
        bquad.z3 = az+16;         
       }//endif3
       
        //bottom 
        y0 = 8; y1 = 16;
        y0 += a.walkFrame;
        y1 += a.walkFrame;
        
        bquad.v0 = b.v0 + (b.v1-b.v0)*0.5;
        bquad.v1 = bquad.v0; 
        bquad.v2 = b.v0;
        bquad.v3 = b.v0; 
        
        bquad.y0 = y0;   
        bquad.y1 = y0;   
        bquad.y2 = y1;   
        bquad.y3 = y1;          
        drawBquad();
        
    
        //top 
        y0 = 0; y1 = 8;
        y0 -= a.walkFrame;
        y1 -= a.walkFrame;
        
        bquad.v0 = b.v1; 
        bquad.v1 = b.v1; 
        bquad.v2 = b.v0 + (b.v1-b.v0)*0.5;
        bquad.v3 = bquad.v2; 
        
         bquad.y0 = y0;   
         bquad.y1 = y0;   
         bquad.y2 = y1;  
         bquad.y3 = y1;         
       drawBquad();
        
        ax+=16;
        az+=16;
     }//nexti 
     
     drawTri = drawTriMask;
     cullTri = true;
     setSkin("spr8");
  }//renderdoor 
  
  
  function doorUpdate(a)
  {
    if (a.cmd > 0) { a.walkFrame += 0.50; if (a.walkFrame>=7){a.walkFrame=7;} }
    else { a.walkFrame -= 0.50; if (a.walkFrame <= 0) {a.walkFrame=0;}  }
    
    if (a.cmd <= 0) { return; }

    var i; var t; var dx, dy;
    
    if (a.cmd == 1)
    {
      a.cmd = 2;
      playSnd3("door",1,a.cx,8,a.cy);
      a.wait = 0;
      dx = 0; dy = 0;
      if (a.state == 1) { dx = 1; }
      else { dy = 1; }
      for (i=0;i<16;i+=1)
      {
        t = getTile(vecMid,a.tx+i*dx,a.ty+i*dy);
        if (t != doorTile+1) { break; }
         setTile(vecMid, a.tx+i*dx,a.ty+i*dy, 0);
      }//nexti 
    }//endif 

    if (a.cmd == 2)
    {
      a.wait += 1;
      if (a.wait >= 50)
      {
        a.wait = 0;
        a.cmd = 0;
        playSnd3("door",1,a.cx,8,a.cy);
        dx = 0; dy = 0;
        if (a.state == 1) { dx = 1; }
        else { dy = 1; }
        for (i=0;i<16;i+=1)
        {
          t = getTile(vecMid,a.tx+i*dx,a.ty+i*dy);
          if (t != 0) { break; }
           setTile(vecMid, a.tx+i*dx,a.ty+i*dy, doorTile+1);
        }//nexti         
      }//endif
    }//endif 
    
  }//doorupdate 
  

  
  //detect doors based on tile 
  function makeDoor(ax, ay)
  {
    var i, k; var t;
    var dx, dy;
    dx = 1;
    dy = 0;
    
    if (getTile(vecMid, ax+1,ay) != doorTile) { dx = 0; dy = 1; }
    
    for (i=0;i<16;i+=1)
    {
      t = getTile(vecMid,ax+dx*i,ay+dy*i);
      if (t != doorTile) { break; }
      setTile(vecMid, ax+dx*i,ay+dy*i, doorTile+1);
    }//nexti 
    
    //fix for 1 tile doors 
    if (i<2)
    {  
      t = getTile(vecMid,ax+1,ay);
      if (t > 1) { dx = 1; dy = 0; }

      t = getTile(vecMid,ax,ay+1);
      if (t > 1) { dx = 0; dy = 1; }
    }
    
    
    //set floor and ceiling for door 
        var dt;
        dt = 250;
        if (dy > 0) { dt = 251; }
        
        for (i=0;i<16;i+=1)
        {
          t = getTile(vecMid,ax+dx*i,ay+dy*i);
          if (t != doorTile+1) { break; }
          setTile(tileDataUp, ax+dx*i,ay+dy*i, dt);
          setTile(tileDataDown, ax+dx*i,ay+dy*i, dt);
        }//nexti 
        
    
    
    var a;
    a = addAct();
     a.tx = ax;
     a.ty = ay;
     a.team = -1; //unkillable
     a.state = 1;
     a.spec = 3;
     a.reload = i;
     a.cx = ax * tilew + (tilew * 0.50);
     a.cy = ay * tileh + (tileh * 0.50);
     a.funcUpdate = doorUpdate;
     a.funcRender = renderDoor;
  
     if (dy > 0) 
     {
       a.state = 3; 
       a.xrad = tilew*0.5+3;
       a.yrad = i * tileh * 0.5;
       a.cy += a.yrad - tileh*0.5;
     }
     else 
     {
      a.xrad = i * tilew * 0.5;
      a.yrad = tileh*0.5+3;
      a.cx += a.xrad - tilew*0.5;
     }
     //console.log("makedoor ",ax,ay, "  width ", i, a.xrad);
     putInGrid(a);
    
  }//makedoor 
  

  //actfromtile
 //loadtile   
  function testTileForAct()
  {
    var i, k; var t;
    var ax, ay; var a;
    for (i=0;i<mapmh;i+=1)
    {
      for (k=0;k<mapmw;k+=1)
      {
         t = getTile(vecMid, k, i);
       
         if (t >= 64 && t <=74)
         {
           setTile(vecMid, k, i, 0);
           ax = k * tilew + tilew*0.50;
           ay = i * tileh + tileh*0.50;
           if (t == 66) { a = makeMonstRans(ax, ay); continue; } 
           //if (t == 64) { a = makeExit(ax, ay); continue; }
           if (t == 64) {  setTile(vecMid, k, i, 30); continue; }
           if (t == 65) { a = makePlayer(ax, ay); continue; }
             
           continue;
         }//endif 

         if (t != doorTile) { continue; }
         makeDoor(k, i);
         //setTile(vecMid, k, i, 0);
      }//nextk
    }//nexti 
    
    
  }//testdoor
  
  
  //debug
  function drawTriWire(x0, y0, z0,  u0, v0,   x1, y1, z1,  u1,v1,   x2, y2, z2,  u2,v2) 
  {

      setDataLine(x0,y0, x1,y1,  255, 255,255);
      setDataLine(x1,y1, x2,y2,  255, 255,255);
      setDataLine(x2,y2, x0,y0,  255, 255,255);
  }//drawtriwire   

  

  
  
  function renderWorld_part1()
  {
    //camera      
      resetQuat(camOri);
        //quatRotAxis(camOri, -camYaw+1.57, 1);
        quatRotAxis(camOri, camYaw, 1);
        quatRotAxis(camOri, camPitch, 0);
        quatRotAxis(camOri, camRoll, 2);

      rendw = 320/2; rendh = 200/2;
      camAspect = rendw/rendh;
      
      //wireframe 
      /*
       clearDataPix(128,64,64);
       drawTriMask = drawTriWire;
       drawTriSkin = drawTriWire;
      */
      /*
       drawTriMask = drawTriColor;
       drawTriSkin = drawTriColor;
      */
      
      setListen(camPos.x, camPos.y, camPos.z); 
      setProjMat(tempMat, camFov, camAspect, camNear, camFar);
      setViewMat(viewMat, camPos.x, camPos.y, camPos.z,  camOri.x, camOri.y, camOri.z, camOri.w);
      multMatrix(tempMat, viewMat, projMat); 
      
      camFar = 512;
      setFrustPlane(camFov, camAspect, camNear, camFar, camPos.x, camPos.y, camPos.z, camOri);
      setFrustCutter();
      clearDepth(1);
      //clearDataPix(128,64,64); // clear color 
        quatSetVec(camOri, sprMat);
        setTriColor(255,0,0);
        drawTri = drawTriColor;
        drawTri = drawTriSkin;
        //drawTri = drawTriMask;
         //drawTri = drawTriWire;
       //  drawTriAffine = drawTriWire;
        cullTri = true;
        setSkinWrap();
        setSkinClamp();
        
        if (wireMode) { clearDataPix(0,0,0); }
        
         visTest(camPos.x, camPos.z, -camYaw+1.57); //raycast test 
         visBox(camPos.x, camPos.z, 1); //x tile area around player always visible 

       // drawSprCam("ftest", 0,0, 256, 64,64, 0);
       // drawSprCam("ftest", 0,0, -256, 64,64, 0);
       //  setSkin("test");
     //   drawCamSpr(0,0,256, 64,64, 0);
    //    drawCamSpr(0,0,-256, 64,64, 0);
        //drawQuad(0,0,512,512);
        
       //clearDataPix(64,64,64);
        //todo -- these eat up most resources 
        //draw floor and ceiling 
          setTriColor(64,64,64);
          drawTri = drawTriColor;
          drawTri = drawTriSkin;
          if (wireMode) { drawTri = drawTriWire; }
        
 /*
          setSkinWrap();
          cullTri = false;
            setSkin(254);
            setTriColor(80,80,80);
             drawQuad3(0,  0,0,  512,512,  0,0, mapmw, mapmh);
            setSkin(255);
            setTriColor(64,64,64);
             drawQuad3(16,  512,512,  0,0,  0,0, mapmw, mapmh);
          cullTri = true;
          setSkinClamp();
          drawTri = drawTriSkin;
*/





        var ax, az;
        var i, k; var f; var t;
        var dx, dz;
        var dt;
        
        for (i=0;i<mapmh;i+=1)
        {
          for (k=0;k<mapmw;k+=1)
          {
            t = getTile(vecMid, k, i);
            if (isVis(k, i) == false) { continue; } 

            //if (t <= 0) { continue; }

             //check tile is block or item 
            if (t >  lastNoVis)  { continue; }

              ax = k*16+8;
              az = i*16+8;

              dx = (camPos.x - ax);
              dz = (camPos.z - az);
              
              dx = (dx*dx)+(dz*dz);
              if (dx < 2048)
              { drawTri = drawTriSkin; }
              else 
              { drawTri = drawTriAffine; }
              if (wireMode) { drawTri = drawTriWire; }
             
              setPixel = setPixelLight;
              
              // drawTri = drawTriAffine;
              //very noticeable (for the close tiles)
              //drawTri = drawTriAffine;
              
               //  getTile(tileDataUp, ax, ay);
    //
             dt = getTile(tileDataDown, k, i); 
            // setSkin(254); setTriColor(80,80,80);
             setSkin(dt); setTriColor(80,80,80);
             //if (k%2==0) { setSkin(255); }
             
             // -8 
             //     0
             //        8
             //
              
               drawQuad3(0, ax-8,  az-8, ax,az,  0, 0, 0.5, 0.5);
               drawQuad3(0, ax,  az-8, ax+8,az,  0.5,   0, 1, 0.5);
               drawQuad3(0, ax-8,  az, ax,az+8,  0, 0.5, 0.5, 1);
               drawQuad3(0, ax,  az, ax+8,az+8,  0.5,0.5, 1, 1);
             //  drawQuad3(0, ax,    az,   ax+8,az+8,  0,0, 1, 1);
               //drawQuad3(0, ax-8,  az-8, ax+8,az+8,  0,0, 1, 1);
               //drawQuad3(0, ax-8,  az-8, ax+8,az+8,  0,0, 1, 1);
               
               
             dt = getTile(tileDataUp, k, i); 
            // setSkin(255);   setTriColor(64,64,64);
             setSkin(dt);   setTriColor(64,64,64);
             //if (i%2==0) { setSkin(254); }
              // drawQuad3Flip(16, ax-8,  az-8, ax+8,az+8,  0,0, 1, 1);
                   
               drawQuad3Flip(16, ax-8,  az-8, ax,az,  0, 0, 0.5, 0.5);
               drawQuad3Flip(16, ax,  az-8, ax+8,az,  0.5,   0, 1, 0.5);
               drawQuad3Flip(16, ax-8,  az, ax,az+8,  0, 0.5, 0.5, 1);
               drawQuad3Flip(16, ax,  az, ax+8,az+8,  0.5,0.5, 1, 1);
               
              //if (t >= 16 && t<= 31)
              if (t >= 80 && t <= lastNoCol) 
              { setSkin(t); drawTri = drawTriMask; drawCamSprDef( ax , 12, az, 8,8, -camRoll);  }
              else if (t >= 16 && t<= 31)
              { setSkin(t); drawTri = drawTriMask; drawCamSprDef( ax, 4, az, 8,8, -camRoll);    }
              
            
          }//nextk
        }//nexti



    }//part1
  
  
    function renderWorld_part2()
    {

        setTriColor(128,128,128);

        drawTri = drawTriSkin;
    
      //draw blocks and items 
        var ax, az;
        var i, k; var f; var t;
        for (i=0;i<mapmh;i+=1)
        {
          for (k=0;k<mapmw;k+=1)
          {
            t = getTile(vecMid, k, i);
            if (isVis(k, i) == false) { continue; } 

            //if (t <= 0) { continue; }
            
            if (t <= lastNoVis)  { continue; }


              ax = k*16+8;
              az = i*16+8;
              
              dx = (camPos.x - ax);
              dz = (camPos.z - az);
              
              dx = (dx*dx)+(dz*dz);
              if (dx < 5096)
              { drawTri = drawTriSkin; }
              else 
              { drawTri = drawTriAffine; }
              //drawTri = drawTriAffine;
                 if (wireMode) { drawTri = drawTriWire; }

            
            f = getFlag(k,i); 
            
            //setSkin("test");
            setSkin(t); //0-255 for wall tile 
            if (t == pushTile)
            { 
              t = getTile(vecMid,k,i+1);
              if (t<=lastNoCol) {t = getTile(vecMid,k+1,i);}
              setSkin(t);           
             }
             drawBlock(f, k*16, i*16, 16)
              
             //drawCamSpr(k*16+8,8,i*16+8, 16,16, 0);
             
          }//nextk
        }//nexti

        //render actors 
        setPixel = setPixelLight;
        drawTri = drawTriMask;
         setSkin("spr8");
        
        var num; var a;
        num = vecAct.length | 0;
        for (i=0;i<num;i+=1)
        {
          a = vecAct[i];
          if (a.funcRender != undefined)
          { a.funcRender(a); }
        }//nexti 
        
        //render particles 
        
         drawTri = drawTriMask;
         setSkin("spr8");
         num = numPart;
        for (i=0;i<num;i+=1)
        {
          a = vecPart[i];
          if (a.hp <= 0) { continue; }

          drawSprCam(a.sprName, a.cx, a.cz, a.cy, a.size*0.25, a.size*0.25, a.ang);
          //drawSprAdv3(a.sprName, a.cx-camx, a.cy-camy, a.ang, a.size,a.size);
        }//nexti      
        
        
        
        // setDataLine(0,0, 320, 240,  255, 255,255);
     //    setDataLine(getRand()*320, getRand()*240,
     //getRand()*320, getRand()*240,  getRand()*255,getRand()*255,getRand()*255);
       
       //do this outside here for frameskip 
       // ctx.putImageData(imgData, 0, 0);

    flipImage();
  }//renderworld
  
  function renderWorld()
  {
    renderWorld_part1();
    renderWorld_part2();
  }//renderworld  
  
  
  //unused -- all actors loaded from mid 
  function loadActFromMap(vecRect)
  { 
    var a;  var i; var num; var xr;
    num = vecRect.length;
    
    for (i=0;i<num;i+=1)
    {
      xr = vecRect[i];
    }//nexti
  }//actfromrect

  


  function loadMap()
  {





         k_fireName =   "Fire";
         k_fire2Name =  "Strafe";
  
        //init game 
          gameState = 0; 
          
          gt = 0;
          gameOver = 0; //todo -- replaced with gamestate 
          playerId = 0;
          setRandSeed(1000);

          clearPart();
          
          var map_mw, map_mh, map_mid, map_rect;
          var map_up, map_down;
          
          map_mw = xmap_mid_mw;  map_mh = xmap_mid_mh; map_mid = xmap_mid; map_rect = xmap_rect
          map_up = xmap_up;
          map_down = xmap_down;
           
          if (gameMap >= 1)
          {
            if (gameMap == 1) { map_mw = amap_mid_mw;  map_mh = amap_mid_mh; map_mid = amap_mid; map_rect = amap_rect; }   
            if (gameMap == 2) { map_mw = bmap_mid_mw;  map_mh = bmap_mid_mh; map_mid = bmap_mid; map_rect = bmap_rect; }   
            if (gameMap == 3) { map_mw = cmap_mid_mw;  map_mh = cmap_mid_mh; map_mid = cmap_mid; map_rect = cmap_rect; }   
            if (gameMap == 4) { map_mw = dmap_mid_mw;  map_mh = dmap_mid_mh; map_mid = dmap_mid; map_rect = dmap_rect; }   
            if (gameMap == 5) { map_mw = emap_mid_mw;  map_mh = emap_mid_mh; map_mid = emap_mid; map_rect = emap_rect; }   
            if (gameMap == 6) { map_mw = fmap_mid_mw;  map_mh = fmap_mid_mh; map_mid = fmap_mid; map_rect = fmap_rect; }   
            if (gameMap >= 7) { map_mw = gmap_mid_mw;  map_mh = gmap_mid_mh; map_mid = gmap_mid; map_rect = gmap_rect; }                             
          }//endif3map
          
          tileDataUp = map_up.slice();
          tileDataDown = map_down.slice();
          
          loadTileMap(map_mw, map_mh, map_mid);
          resetVis(); 
          resetFlag();

          clearAct();
          initActGrid(0,0, mapmw*tilew, mapmh * tileh);
          //actFromRect(xmap_rect);     
          //loadActFromMap(map_rect);         

          //load actors from tiles 
          testTileForAct();

  }//loadmap 

  
  function update()
  { 
    
    if (firstRun == 1){ firstRun = 0; init(); gameState = 1; return; }
    controls();
       
    //UPDATE START
      var i; var num;
      num = 1;
      if (paused) { num = 0; }
      if (bDebug && isKeyDown(key_u)) {num=16;}
      
      if (gameState == 1) 
      { 
    
          loadMap();
    
          if (playerId == 0)
          { gameState = 110; }
          
          if (camx > worldw-320) { camx = worldw-320; }
          if (camy > worldh-240) { camy = worldh-240; }
          
          if (camx < 0) { camx = 0; }
          if (camy < 0) { camy = 0; }
        
        
      }//endifgamestate1
      
      if (paused == false)
      {
          //gameover check 
           if (gameState == 0 && getAct(playerId) == 0) { gameState = 3; }
           
           if (gameState == 0)
           {
             gameFade -= 0.01;
             if (gameFade <= 0.0)
             {gameFade = 0.0; }
           }//endif

           if (gameState == 5 || gameState == 6)
           {
             //5 win
             //6 defeat 
             //console.log(gt,"gamestate ",gameState, " fade ", gameFade);
             gameFade += 0.03;
             if (gameFade >= 1.0)
             {
               gameFade = 1.0; 
               
               //go to next map 
               if (gameState == 5)
               {
                gameMap += 1;
                if (gameMap >= mapReach)
                { mapReach = gameMap; saveConfig(); }
               }//endif5
               
                gameState = 1;
              }//endif3 
           }//endif 
           
           //win
           if (gameState == 300)
           {
             gameWait += 1;
             if (gameWait >= 20)
             {
               if (anyKeyHold == 1 || mhold == 1)
               { gameState = 5; }           
             }             
           }//endif           
           
           //defeat 
           if (gameState == 3)
           {
             if (camPos.y > 2) { camPos.y -= 0.3; }
             if (camRoll < 0.5) { camRoll +=0.03; }
             if (gameWait == 3)  { playSnd("gameover", 1.0); }
           
             gameWait += 1;
             if (gameWait >= 20)
             {
               if (anyKeyHold == 1 || mhold == 1)
               { gameState = 6; gameWait = 0; }           
             }
           }//endif
           //gameover check end 
        }//endifpaused 
    
    
        for (i=0;i<num;i+=1)
        {
          var dx, dy; var ms;
          dx = 0; dy = 0;
          ms = 8;
          /*
              if (keyUp)    { dy -= ms; }
              if (keyDown)  { dy += ms;}
              if (keyLeft)  { dx -= ms; }
              if (keyRight) { dx += ms; }
         
              camx += dx;
              camy += dy;
                   */
           
              
              updatePart();
              updateAct(vecAct);
              updateAct(vecBull);

          
              if (camx > worldw-320) { camx = worldw-320; }
              if (camy > worldh-240) { camy = worldh-240; }
              
              if (camx < 0) { camx = 0; }
              if (camy < 0) { camy = 0; }
              
            gt += 1;  
        }//nexti
 
  
      //UPDATE END 

        //RENDER     
          //ctx.fillStyle = "#000000";
          //ctx.fillStyle = "#808080";
          //ctx.fillRect(0, 0, 320, 240);
          
          //clear top of screen 
           ctx.fillStyle = "rgba(0,0,0,1)";
           ctx.fillRect(0,0,320,30);
                 
          //run in 30fps
          //if (appTime % 2 == 0)
         
          if (appTime % 100 == 0)
          {
            skipTime = 0;
            skipTime = Math.ceil(rendTime / 13);
            if (skipTime <= 1) { skipTime = 0; }
            if (skipTime > 4) { skipTime = 4; }

            //if (rendTime > 16) { skipTime = 2; }            
            //if (rendTime > 32) { skipTime = 3; }            
          }//endif
          
          //force 30 fps -- 60fps rendering doesnt seem to work
            //if (skipTime < 2) { skipTime = 2; }
          
          //now it runs in always 30 fps 
          //but its 60 fps breaking down the frame into two parts 
          //first drawing the floor 
          //and then drawing the tiles 
          
          if (skipTime <= 0 || ((appTime|0) % (skipTime|0)) == 0)
          { 
           
            rendTime = Date.now();      
             //renderWorld(); 
           
          
              if (rendSkip == 0) {  renderWorld_part1(); rendSkip = 1; }
              else { renderWorld_part2();  rendSkip = 0; }
            
            
            rendTime = (Date.now() - rendTime);
          }//endif 

//         ctx.putImageData(imgData, 0, 20);
       ctx.putImageData(drawData, 0, 20);
       
              
         
         
        /*         
          setDataLine(0,0, 320, 240,  255, 255,255);
          
          setDataLine(getRand()*320, getRand()*240,
          getRand()*320, getRand()*240,  getRand()*255,getRand()*255,getRand()*255);
          
          ctx.putImageData(imgData, 0, 0);
        */

         //  drawBackDrop();
          // drawTileGrid();
         //  drawAct();

        wireMode = (bDebug && isKeyDown(key_h));
 
        //tile drawing is now only for debug 
       if (bDebug && isKeyDown(key_g))
       {
         var sx, sy;
         var ox, oy;
            sx = Math.floor(camx/tilew);
            sy = Math.floor(camy/tileh);
            ox = camx - (sx*tilew);
            oy = camy - (sy*tileh);
             
            drawTileMap(vecMid,sx,sy, -ox,-oy);
            if (bDebug && isKeyDown(key_g))
              { drawVisDeb(sx,sy, -ox, -oy); }

            drawActTest(vecAct);
            //drawActTest(vecBull);

            drawPart();
       }//endif 
       
       
          //GUN 
          //runFrame += 0.10;
          var t;
          if (paused == false && gameState == 0)
          {
            gunLeft += mvx * -0.13;
            gunLeft *=0.90;
            if (gunLeft >15) { gunLeft = 15;}
            if (gunLeft < -15) { gunLeft=-15;}
            gunUp   += mvy * 0.13;
            gunUp *=0.90;
            if (gunUp >5) { gunUp = 5;}
            if (gunUp < -5) { gunUp=-5;}
          }//endif 
          
           t = runFrame * 0.07;
           ax = 220; ay = 220-35;
           ax+=gunLeft; ay+=gunUp;
           ay+=gunFire;
           ax += Math.cos(t)  * 12;
           ay += Math.sin(t) * Math.cos(t) * 8;  //sinsin for U  sincos for 8
           if (gameState < 6 && gameState != 5 && gameState == 0 )
           { drawSpr(gunSpr, ax, ay); }
        
         if (paused ==false) { gunFire *= 0.90; }
          
          //HUD
                 var dispHp; var b;
                 dispHp = 0;
                 b = getAct(playerId);
                 if (b != 0)
                 { dispHp = Math.ceil(b.hp); }
                 
                 ctx.fillStyle = "rgb(0,0,0)";
                 ctx.fillRect(0,220,320,20);
                 ctx.fillRect(319,0,1,240); //hide rendering error on side 
                 
               if (gameState < 6 && gameState != 5)
               {
                  drawFont3Scale(0,222, 1,1, "HP "+dispHp);
                  
                  ax = 160; ay = 222;
                  drawFont3Scale(320-80,222, 1,1, "GUN "+curGun);
               }//endif
               
                  /*
                  for (i=0;i<4;i+=1)
                  {
                    if (i == 0) { 
                     drawFont3Scale(ax,ay, 1,1, "GUN "); ax+=32;                  
                      continue;
                    }//endif 
                    if (curGun == i)
                    { drawFont3Scale(ax,ay, 1,1, "["+i+"]"); ax+=32; continue; }
                    drawFont3Scale(ax,ay, 1,1, ""+i); ax+=32;
                   
                  }//nexti 
                  */
                  
          //HUD END 
       
           //  drawPart();
         if (gameState == 3 || gameState == 6)   { drawFont3Scale(160-40,100,3,3, "OWWW"); }
         if (gameState == 110) { drawFont3Scale(160-45,100,3,3, "ERROR"); }
         if (gameState == 300 || gameState == 5) { drawFont3Scale(160-130,100,3,3, "WELL DONE"); }
         
         if (redFade > 0.0)
         { 
           redFade -= 0.03;
           if (redFade<=0.0) {redFade =0.0; }
           ctx.fillStyle = "rgba(255, 0, 0,"+(redFade*0.3)+")";
           ctx.fillRect(0, 0, 320, 240);          
         }//endif
         
        if (blueFade > 0.0)
         { 
           blueFade -= 0.08;
           if (blueFade<=0.0) {blueFade =0.0; }
           ctx.fillStyle = "rgba(0, 0, 255,"+(blueFade*0.13)+")";
           ctx.fillRect(0, 0, 320, 240);          
         }//endif
           
          var fade;
          //fade = 0.30;
          fade = gameFade; 
          if (fade<0.0) { fade = 0.0; }
          if (fade>1.0) { fade = 1.0; }
           ctx.fillStyle = "rgba(0, 0, 0,"+fade+")"; //"#00000080";
           ctx.fillRect(0, 0, 320, 240);
      
  
      afterUpdate();
  
  }//update

  