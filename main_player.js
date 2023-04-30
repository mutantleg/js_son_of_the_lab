 
//player update 


  function playUpdate(a)
  {
    var i;
    for (i=0;i<9;i+=1)
    {      if (isKeyDown(key_1+i)) { curGun = 1+i; }     }
  
    if (gunDelay > 0)
    { 
      gunDelay -= 1; if (gunDelay<=0) { prevGun=-1;} 
      if (curGun == 2 && gunDelay<10) { gunFire += 10; }
      if (prevGun==-1 && curGun==2) { gunFire=170;}
    }//endifdelay 
  
    if (curGun != prevGun)
    {
      prevGun = curGun;
      gunFire=170;
      if (curGun == 2)
      { gunSpr = "handgren"; }
      else { gunSpr = "launcher"; }

    }//endifprevgun
    
    
    if ((keyFire) && a.reload < gt)
    { 
      a.reload = gt + 15;
      playSnd("fire",1.0);
      gunFire = 15;
      
      var b;
      
      //grenade
      if (curGun == 2)
      {
        gunSpr = "handthrow"; 
        gunFire = 25;
        gunDelay = 15;
        
       a.reload = gt + 45;
       b = makeBomb(a.cx, a.cy);
        b.ownerid = a.id;
        b.team = a.team;
        b.vx = Math.cos(a.ang)*3;
        b.vy = Math.sin(a.ang)*3;
        b.vz += Math.sin(a.pitch*2);
        if (b.vz<0){b.vz=0;}
        b.funcUpdate(b);
        if (b.dead==false) { b.funcUpdate(b); }
      }//endifgun2
         
      if (curGun == 1)
      {
        a.reload = gt + 5;
        
        b = addAct();
        b.sprName = "fireball"+a.dir;
        //console.log(gt," fireball dir ", a.dir, " ang ", a.ang);
        b.cx = a.cx;
        b.cy = a.cy;
        b.cz = 4;
        b.dmg = 8;
        b.hp = 150;
        b.ownerid = a.id;
        b.team = a.team;
        b.vx = Math.cos(a.ang)*3;
        b.vy = Math.sin(a.ang)*3;
        
        b.vz = Math.sin(a.pitch*2);
        
        b.funcRender = renderBull;
        b.funcUpdate = bullUpdate;
        b.funcUpdate(b);
        if (b.dead==false) { b.funcUpdate(b); }
      }//endifgun1
      
    
      //rocket     
      if (curGun == 3)
      {
        a.reload = gt + 45;
        b = addAct();
        b.sprName = "fireball";
        b.rendSpr = "rocket3";
        b.cx = a.cx;
        b.cy = a.cy;
        b.cz = 8;
        b.dmg = 50;
        b.hp = 150;
        b.ownerid = a.id;
        b.team = a.team;
        b.vx = Math.cos(a.ang)*3;
        b.vy = Math.sin(a.ang)*3;
        
        b.vz = Math.sin(a.pitch*2);
        
        b.funcRender = renderBomb;
        b.funcUpdate = rocketUpdate;
        b.funcUpdate(b);
        if (b.dead==false) { b.funcUpdate(b); }
      }//endifgun3

      
    }//endiffire2
    
    var dx, dy; var ms; var ts;
    var ta; ta = a.ang - 1.57;
    ms = 0.80;
    a.vx *= ms;
    a.vy *= ms;
    if (Math.abs(a.vx)<0.05) { a.vx = 0.0; }
    if (Math.abs(a.vy)<0.05) { a.vy = 0.0; }
    a.angSpeed *= 0.60;

    dx=0;dy=0; ms=1; ts = 6.28 / 180.0;
    
    ms = 0.25; ms = 0.20;
    ts = 0.023;
    if (keyUp)    { dx += Math.cos(a.ang)*ms;  dy += Math.sin(a.ang)*ms; }
    if (keyDown)  { dx += Math.cos(a.ang)*-ms; dy += Math.sin(a.ang)*-ms; }
    
    if (keyFire2 || mouseAim)
    {
     if (keyLeft)   { dx += Math.cos(ta)*ms;  dy += Math.sin(ta)*ms; }
     if (keyRight)  { dx += Math.cos(ta)*-ms; dy += Math.sin(ta)*-ms; }
    }
    else 
    {
     if (keyLeft)  { a.angSpeed -= ts; }
     if (keyRight) { a.angSpeed += ts; }
    }
    
    if (mouseAim)
    {
      a.ang   += -mvx * 0.005;
      a.pitch +=  mvy * 0.005;
      ms = 1.5;
      ms = 0.6;
      
      a.ang = Math.floor(a.ang * 100) * 0.01;
      a.pitch = Math.floor(a.pitch * 100) * 0.01;
      
      if (a.pitch<-ms){a.pitch = -ms; }
      if (a.pitch>ms){a.pitch = ms; }
    }//endif
   
    if (mouseAim==false) { a.pitch = 0.0; }
    
    a.ang += a.angSpeed;
    
    /*
    if (keyUp)    { dy -= ms; }
    if (keyDown)  { dy += ms; }
    if (keyLeft)  { dx -= ms; }
    if (keyRight) { dx += ms; }
      */
      
     if ( (Math.abs(dx) + Math.abs(dy)) > 0.0)
     {
       
       if (keyFire2 == false)
       {
        // a.ang = Math.atan2(dy,dx);
         
         var d; 
         d = a.ang;
         if (d < 0) { d = (3.1415 - -d) + 3.1415; }
         a.dir = ( ( ((d)*(360/6.28)) / 45 ) | 0 ) * 45;
         if (a.dir > 315) { a.dir = 0; }
         if (a.dir < 0) { a.dir = 0; }
       }//endif3       
    
       
       a.xmir = false;
       if (a.dir == 0)  { a.sprName = "wizard2"; } 
       if (a.dir == 45)  { a.sprName = "wizard1"; } 
       if (a.dir == 90)  { a.sprName = "wizard0"; } 
       if (a.dir == 135)  { a.sprName = "wizard1"; a.xmir = true; } 
       if (a.dir == 180)  { a.sprName = "wizard2"; a.xmir = true; } 
       if (a.dir == 225)  { a.sprName = "wizard3"; a.xmir = true; } 
       if (a.dir == 270)  { a.sprName = "wizard4"; } 
       if (a.dir == 315)  { a.sprName = "wizard3"; } 
       
       if ( (gt & 16) == 0) { a.sprName += "w"; }
       
       /*
       if (Math.abs(dy) < 0.01)
       {
         if (dx > 0) { a.dir = 0; }
         else { a.dir = 180; }         
       }
       else 
         */
       
     }//endif    

     
      
      a.vx += dx; 
      a.vy += dy;
      
      //hud 
      runFrame += getMag(a.vx, a.vy);
      
        
      var tx, ty; var tw;
       tx = Math.floor(a.cx / tilew);
       ty = Math.floor(a.cy / tileh);
        //setTile(vecMid, tx, ty, 0);
        
        //pick item 
        tw = getTile(vecMid,  tx, ty);
        if (tw >= 16 && tw <= 31)
        {
          if (tw == 30) {  gameState = 300; a.dead=true; return;}
          if (a.hp < 150)
          {
           blueFade = 1.0;
           playSnd("pickup",1.0);
           a.hp += 10;
           if (a.hp > 150) { a.hp = 150; }
           setTile(vecMid,  tx, ty, 0);
          }//endif3
        }//endifitem  
        
        //fix tile pushing dir to be 1 tile width
          if (Math.abs(dx) > 0 && Math.abs(dy) > 0)
          {
            if (Math.abs(dx) > Math.abs(dy))
            { if (dx>0){dx=1;} else{dx=-1;} dy = 0; }
            else 
            { if (dy>0){dy=1;} else{dy=-1;} dx = 0; }
          }//endif
          
      
      //check tile pushed 
     // tw = getTile(vecMid,  tx+dx, ty+dy);
     // if (tw > 0 && bDebug)
      //{ console.log(gt, " pushed tile ", tw); }
      
      
       //todo -- normalise dx dy  (its already normalised so i got lazy)
      //push tile 
      playPushTile(a, a.crad+3, dx, dy);
      
      /*
      if ( ( (Math.abs(dx) + Math.abs(dy)) < 2.0)  &&  mapMove(a, a.crad, 1.0) )
      {

        //if (tw > 0 && getTile(vecMid,  tx+dx+dx, ty+dy+dy) < 1)
        if (tw == pushTile && getTile(vecMid,  tx+dx+dx, ty+dy+dy) < 1)
        {
         setTile(vecMid, tx+dx, ty+dy, 0);
         updateFlag3(tx+dx, ty+dy);
         //setTile(vecMid, tx+dx+dx, ty+dy+dy, tw);
         
         a.vx *= -1.0;
         a.vy *= -1.0;
         
            playSnd("pushwall",1.0);
         
         var b;
         b = addAct();
          b.sprName = "pushtile";
           b.cx = (tx+dx) * tilew + tilew * 0.50;
           b.cy = (ty+dy) * tileh + tileh * 0.50;
           b.vx = dx;
           b.vy = dy;
           b.hp = tilew*2; //need to move 2 spaces 
           //pushtile steals the lower tile 
           //todo -- this means they cannot be pushed down..
           //update -- oh well 
            tw = getTile(vecMid,  tx+dx, ty+dy+1);
            if (tw == 0)
            { tw = getTile(vecMid,  tx+dx+1, ty+dy); }
           b.reload = tw;
           b.funcUpdate = pushBlockUpdate; 
           b.funcRender = renderPushBlock;
         
        }//endif3
      }//endif
      */
 
      /*
    if (a.vx > 0.0 && wallTest(a.cx+a.vx+a.crad,a.cy)) { a.vx = 0; }
    if (a.vx < 0.0 && wallTest(a.cx+a.vx-a.crad,a.cy)) { a.vx = 0; }
    if (a.vy > 0.0 && wallTest(a.cx,a.cy+a.vy+a.crad)) { a.vy = 0; }
    if (a.vy < 0.0 && wallTest(a.cx,a.cy+a.vy-a.crad)) { a.vy = 0; }
  */
    checkActCol(a, colFuncPlay);
   
      var i;
      for (i=0;i<3;i+=1)
      { if (mapMove(a, a.crad, 1.0)==false) { break; } }
    
    a.cx += a.vx;
    a.cy += a.vy;
    
    //a.cx = Math.floor(a.cx * 100) * 0.01;
    //a.cy = Math.floor(a.cy * 100) * 0.01;

    putInGrid(a);
    

    
    dx = a.cx - camx;
    dy = a.cy - camy; 
    var h;    
    ms = 1;
    //ms = 3;
    h = 45;    
    if (dx < 160-h) { camx -= ms; }
    if (dx > 160+h) { camx += ms; }
    h = 20; 
    if (dy < 120-h) { camy -= ms; }
    if (dy > 120+h) { camy += ms; }    
    
      //3D 
       camYaw = -a.ang-1.57;
       camPitch = a.pitch;
       camRoll = 0.0;
       if (a.dmgTime > gt) { camRoll = getRand2()*0.2; } 
       
       camPos.x = a.cx;
       camPos.y = 8;
       camPos.z = a.cy;
       
      
    
    
    /*
     dx = a.cx - 160;
     dy = a.cy - 120;
     dx |= 0;
     dy |= 0;
     
     camx += (dx-camx)*0.10;
     camy += (dy-camy)*0.10;
     camx |= 0;
     camy |= 0;
     */

     //if (bDebug && isKeyDown(key_j)) { a.dead = true; }
     if (bDebug && onKeyPress(key_j)) { a.dead = true; }
     if (bDebug && onKeyPress(key_m)) { toggleFullScreen(); }
   

    //clamp in update 
    
    /*
    if (camx > worldw-320) { camx = worldw-320; }
    if (camy > worldh-240) { camy = worldh-240; }
    
    if (camx < 0) { camx = 0; }
    if (camy < 0) { camy = 0; }
    */
    
    
  }//playupdate 
  
  
  function colFuncPlay(m, a)
  {
    
    //exit
    if (a.spec == 300)
    {
      //console.log(gt,"meet exit ", a);
      gameState = 300;
      m.dead=true;
      return false;
    }//endif
    
    //door 
    if (a.spec == 3)
    {
      if (a.cmd == 0)
      { a.cmd = 1; }
      else { a.wait = 0; }    
      return true;
    }//endif 
    
    //defeated
    if (a.hp <= 0) { return true; }
    
    var nx, ny;
    var d;  var dot;
      
    nx = a.cx-m.cx; 
    ny = a.cy-m.cy;
    d = getMag(nx,ny);
      
       if (d<=0.0){d=0.01;}
       
       nx /= d;         
       ny /= d;
         
       dot = m.vy * ny + m.vx * nx;       
       
       if (dot > 0.0)
       {  
         m.vx -=  nx * dot; 
         m.vz -=  ny * dot;       
       }//endif

  /*
    if (m.vx > 0 && a.cx > m.cx) { m.vx *= 0; }
    else if (m.vx < 0 && a.cx < m.cx) { m.vx *= 0; }
    if (m.vy > 0 && a.cy > m.cy) { m.vy *= 0; }
    else if (m.vy < 0 && a.cy < m.cy) { m.vy *= 0; }
    */
    
   return true;
  }//colFuncPlay
  