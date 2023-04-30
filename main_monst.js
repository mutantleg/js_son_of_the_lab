 

 //monster states 
 
  function makeMonst(ax, ay)
  {
    var a;
       a = addAct();
         a.sprName = "cat";
         a.cx = ax;
         a.cy = ay;
         a.cz = 8;
         a.team = 3 ;
         a.spec = 13; //monst
         a.ang = getRand() * 6.28;
         //a.funcUpdate = testUpdate;
         a.funcUpdate = monstUpdate;
         a.funcRender = monstRender;
         a.funcState  = monstState;
         a.hp = 50;

    return a;
  }//makemonst 
  
  function makePlayer(ax, ay)
  {
    a = addAct();
       a.sprName = "wizard2";
       a.spec = 1;
       a.team = 1; 
       a.xrad = 10;
       a.yrad = 10;
       a.cx = ax;
       a.cy = ay;
       a.cz = 8;
       a.hp = 100;
       a.crad = 5;
       a.funcUpdate = playUpdate;
       playerId = a.id;
       
       camx = a.cx - 160;
       camy = a.cy - 120;

    return a;
  }//makeplayer
  
  function makeExit(ax, ay)
  {
    a = addAct();
     a.sprName = "magichit";
     a.spec = 300;
     a.team = -10; //unshootable
     a.cx = ax;
     a.cy = ay;
     putInGrid(a);
    return a;
  }//makeexit 
 
  function makeMonstRans(ax, ay)
  {
    var a; 
     a = makeMonst(ax, ay);
     a.rendSpr = "ransacker0"; 
     a.funcState = sackState;
  }//makerans
 

 
  function makeExploFx(ax, ay,  az)
  {
     playSnd3("explo",1, ax, az, ay);
       

      var p;
        p = addPart();
        p.animName = "bigexplo";
        p.cx = ax;
        p.cy = ay;
        p.cz = az;
        p.vz = 0.10;
         p.curFrame = 0;
         p.size = 16*4;
         
       var i; 
       for (i=0;i<33;i+=1)       
       {
        p = addPart();
         p.sprName = "spark";
         p.cx = ax;
         p.cy = ay;
         p.cz = az;
         p.vx = getRand2()*2;
         p.vy = getRand2()*2;
         p.vz = getRand()*1+0.5;
         p.grav = -0.06;
         p.dec = 0.99;
         p.hp = 20+getRand()*40;
         p.size = 8 + getRand()*8;
       }//nexti     
  }//makeexplo 
 
 
 
 //explocheck 
     function exploCheck(ax, ay, rad, team, dmg)
     {
        var c;  var i, k, num;
        var d; var t;
        
        num = getQuery(ax, ay, rad+8);

        for (i=0;i<num;i+=1)
        {
          c = colVec[i];

          for (k=0;k<c.numObj;k+=1)
          {
            a = c.vec[k];
          
            //console.log(gt," explo loop ", a.id)
          
          
            if (a.cx + rad < ax-1) { continue; }
            if (a.cx - rad > ax+1) { continue; }
            if (a.cy + rad < ay-1) { continue; }
            if (a.cy - rad > ay+1) { continue; }
            
            if (a.dead) { continue; }
            if (a.team < 0 && a.spec != 13) { continue; } //only explode bodies 

            d = getMag(a.cx-ax, a.cy-ay);
            
            //console.log(gt,"explocheck ",rad, d, a.id, a.team , team )
            
            if (d > rad) { continue; }
            if (canSee(ax, ay, a.cx, a.cy)==false) { continue; }
            
            t = dmg; 
            if (a.team == team) { t *= 0.50; if (t > a.hp) { t = 0; } }
            if (d > rad *0.50) { t *= 0.50; }
           
             damageMonst(a, t);      
                                      
          }//nextk 
        }//nexti
     }//explocheck
 
 
 
  //grenade

    function makeBomb(ax, ay)
    {
      a = addAct();
         a.sprName = "orb";
         a.rendSpr = "orb";
         a.team = 1; 
         a.cx = ax;
         a.cy = ay;
         a.cz = 4;
         a.vz = 1;
         a.hp = 60;
         a.dmg = 35;
         a.crad = 3;
         a.funcRender = renderBomb;
         a.funcUpdate = bombUpdate;

      return a;
    }//makebomb
    
    function renderBomb(a)
    {
       //drawSprCam(a.rendSpr, a.cx, a.cz, a.cy, 4,4, 0);      
         
     cullTri = false;
       
       setPixel = setPixelShad;
       drawSprShad(a.rendSpr, a.cx, 0.50, a.cy, 2, -camYaw-1.57);
        
       
       setPixel = setPixelLight;
       drawSprCam(a.rendSpr, a.cx, a.cz, a.cy, 4,4, -camRoll);
       
      cullTri = true;
    }//renderbomb

    function colFuncBomb(m, a)
    {
      //m  actor testing 
      //a  actor m collided with
      
      if (a.team < 0) { return true; }
      
      //ignore door (use tile to bounce back)
      if (a.spec == 3) { return true; }
      
      if (a.spec == 13 && m.ownerid != a.id ) 
      { 
        m.cmd = 1; 
        damageMonst(a, m.dmg);
        return false; 
      }//endif  
      
      if (m.vx > 0 && a.cx > m.cx) { m.vx *= -0.5; m.wallhit |= 1; }
      else if (m.vx < 0 && a.cx < m.cx) { m.vx *= -0.5; m.wallhit |= 1; }
      if (m.vy > 0 && a.cy > m.cy) { m.vy *= -0.5; m.wallhit |= 1;  }
      else if (m.vy < 0 && a.cy < m.cy) { m.vy *= -0.5; m.wallhit |= 1;  }
      
     return true;
    }//colFuncMonst
    
    function bombUpdate(a)
    {
      a.hp -= 1;
      if (a.hp <= 0) { a.cmd = 1; a.dead = true; }
      
      
       var dx, dy;
       dx = a.vx * 5;
       dy = a.vy * 5;
       if (dx > 8) { dx = 8; }
       if (dx < -8) { dx = -8; }
       if (dy > 8) { dy = 8; }
       if (dy < -8) { dy = -8; }
       dx = a.cx + dx ;
       dy = a.cy + dy ;
       
       //setWall(dx, dy, 0);
       
        if ( wallTest(dx, dy) ) 
        {
          
          if (a.team == 1  && lastTile == exploTile)
          { 
            a.cmd = 1; 
            a.dead=true;
            setWall(dx, dy, 0);
            //updateFlag3((dx/tilew)|0, (dy/tileh)|0);
          }//endif3
        }//endif
    
      
      a.vz -= 0.075;
      a.vx *= 0.99;
      a.vy *= 0.99;
      
      if (a.vz < 0 && a.cz + a.vz < 3) 
      { a.cz = 3; a.vz *= -0.5;
        if (Math.abs(a.vz)<0.5){ a.vz=0; a.vx *=0.91; a.vy*=0.91; } 
      }//endif 
      if (a.vz > 0 && a.cz + a.vz > 13) { a.cz = 13; a.vz*=-0.5; }

      
      a.cz += a.vz;
      
        a.wallhit = 0;
        if (a.vx > 0.0 && wallTest(a.cx+a.vx+a.crad,a.cy)) { a.vx *=-0.50; a.wallhit |= 1; }
        if (a.vx < 0.0 && wallTest(a.cx+a.vx-a.crad,a.cy)) { a.vx *=-0.50; a.wallhit |= 1; }
        if (a.vy > 0.0 && wallTest(a.cx,a.cy+a.vy+a.crad)) { a.vy *=-0.50; a.wallhit |= 1; }
        if (a.vy < 0.0 && wallTest(a.cx,a.cy+a.vy-a.crad)) { a.vy *=-0.50; a.wallhit |= 1; }
        
        checkActCol(a, colFuncBomb);
        
        if (a.wallhit <= 0)
        {
         a.cx += a.vx;
         a.cy += a.vy;
        }
    
      //putInGrid(a);
      
      if (a.cmd == 1)
      {
        a.cx -= a.vx;
        a.cy -= a.vy;
        makeExploFx(a.cx, a.cy,  a.cz);
        a.dead = true;
        exploCheck(a.cx, a.cy, 16, a.team, 40);
        exploCheck(a.cx, a.cy, 24, a.team, 10);
      }//endif 

    }//bombUpdate

    
  //rocket 
 
  function colFuncRocket(m, a)
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
  }//colFuncRocket
  


  function rocketUpdate(a)
  {
    
    checkActCol(a, colFuncRocket);
    
   
    if ( wallTest(a.cx+a.vx,a.cy+a.vy)) 
    {
      a.dead=true;
      
      //let player destroy some tiles 
      if (a.team == 1  && lastTile == exploTile)
      { 
        setWall(a.cx+a.vx, a.cy+a.vy, 0);
      }//endif3
    }//endif
    
    a.cx += a.vx;    
    a.cy += a.vy;
    a.cz += a.vz; 
      
    //hit floor or ceiling 
    if (a.cz < 3 || a.cz > 13) { a.dead = true; }
      
     a.hp -= 1;
    
     if (a.hp<=0) {a.dead=true;}
     
     
      var p;
        p = addPart();
        p.cx = a.cx;
        p.cy = a.cy;
        p.cz = a.cz; 
        p.cx += getRand2()*1.20;
        p.cy += getRand2()*1.20;
        p.cz += getRand2()*1.20;
        p.animName = "smoke";
        p.curFrame = 0;  
        p.size = 5;
     
    
    if (a.dead)
    {
      a.cx -= a.vx * 2;
      a.cy -= a.vy * 2;
      a.cz -= a.vz * 2;
      
      makeExploFx(a.cx, a.cy,  a.cz);
        a.dead = true;
        exploCheck(a.cx, a.cy, 16, a.team, 50);
        exploCheck(a.cx, a.cy, 24, a.team, 5);
    }//endif 
    
  }//rocketupdate 
 
 
 
 
 
 //ransacker 
 
  function sackState(a)
  {
    if (a.state >= 100)
    {
       a.vx *= 0.90; a.vy *= 0.90; 
       if (a.state >= 110) { return; }

        if (a.state == 100)
        {     
          a.rendSpr = "ransacker6";
          a.state = 101; 
          a.stateCount = 0;
          return;
        }//endif 
        
        if (a.state == 101)
        { a.stateCount += 1; if (a.stateCount >= 8) { a.state = 102; a.stateCount = 0; a.rendSpr = "ransacker7"; }  }
        if (a.state == 102)
        { a.stateCount += 1; if (a.stateCount >= 11) { a.state = 120; a.stateCount = 0; a.rendSpr = "ransacker8"; }  }
        
        return;
    }//endif     
    
    if (a.state == 70)
    {

      playSnd3("notice1",1, a.cx, a.cz,  a.cy);
      a.state = 1;
      a.vx = Math.cos(a.ang)*0.50;
      a.vy = Math.sin(a.ang)*0.50;
    }//endifstate0
    
    if (a.state == 1)
    {
      if (a.dmgTime > gt)
      {
        a.rendSpr = "ransacker5";
         a.vx *= 0.93;
         a.vy *= 0.93;
        return;        
      }
      else 
      if ( (gt+a.id)%8 == 0)
      {
        a.walkFrame += 1;
        if (a.walkFrame > 3) { a.walkFrame = 0; }
        a.rendSpr = "ransacker"+a.walkFrame;        
      }//endif 
      
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
        
       if (a.stateCount == 10)
       { a.rendSpr = "ransacker4"; }
        
        ta = Math.atan2(a.cx-a.targx, a.cy-a.targy);
        a.ang = -ta-1.57;
        
      if (a.stateCount == 20)
      {
        playSnd3("attack1",1, a.cx, a.cz,  a.cy);
 
          var b;
           b = addAct();
            b.sprName = "orb";
            b.rendSpr = "discharge";
            b.cx = a.cx;
            b.cy = a.cy;
            b.cz = 8;
            b.dmg = 23;
            b.hp = 150;
            b.ownerid = a.id;
            b.team = a.team;
            b.vx = Math.cos(a.ang)*2;
            b.vy = Math.sin(a.ang)*2;                       
            b.funcRender = renderMonstBull;
            b.funcUpdate = bullUpdate;        
      }//endif3
      if (a.stateCount >= 30)
      {
        a.stateCount = 0;
        a.state = 1;
      }//endif3
    }//endifstate3  
    
  }//ransackstate 
  
 
 

