
//needs an x_tilemap.js to work 

//doubles as raylib.js

 // wall vis -- if current wall visible (done with primitive raycast)
 //wall flag -- which side of a block wall is visible 
  
 //todo -- for now its a fixed size array 

 var curVis = 0;
 var vecVis = new Int32Array(64*64);
 var vecFlag = new Uint8Array(64*64);
  
  /*
  call after map loaded:
  resetFlag();
  resetVis();
  */
  
 function resetVis()
 {
   curVis = 0;
   vecVis = new Int32Array(mapmw*mapmh);
   
 }//resetvis 
 
  function isVis(ax,ay)
  {
    ax|=0; ay|=0;
    if (ax<0||ay<0||ax>=mapmw||ay>=mapmh){return false ;}   
    return    vecVis[ax+(ay*mapmw)]  == curVis;    
  }//isvis
 
   function isVis3(wx,wz)
  {
    wx = (wx/tilew)|0;
    wz = (wz/tileh)|0;
    return isVis(wx,wz);
  }//isvis
 
 
  function setVis(ax,ay, t)
  {
    ax|=0; ay|=0;
    if (ax<0||ay<0||ax>=mapmw||ay>=mapmh){return;}
   vecVis[ax+(ay*mapmw)] = t;    
  }//setVis
  
  function getVis(ax, ay)
  {
    ax|=0; ay|=0;
    if (ax<0||ay<0||ax>=mapmw||ay>=mapmh){return 1;}
    return vecVis[ax+(ay*mapmw)];
  }//getVis
  
  
  function visRay(ax, az, dx, dz, num)
  {    
    var tx, tz; var i;
    for (i=0;i<num;i+=1)
    {
      ax += dx;
      az += dz; 

      tx = (ax/tilew)|0;
      tz = (az/tileh)|0;
      
      setVis(tx,tz,   curVis);
      if (i > 8) //15) //made up number //~7 tiles 
      {
        setVis(tx+1,tz,   curVis); 
        setVis(tx-1,tz,   curVis);
        setVis(tx,tz+1,   curVis);
        setVis(tx,tz-1,   curVis);  
      }
      
      //todo -- set this test somewhere else to be custom 
      //lastNoCol in g_global.js
      // function getMapTile(ax,ay) in main.js
      if (getMapTile(tx,tz) > lastNoVis) 
      {
        //add some extra vis just in case 
        //(as it usually screws up at the walls)
        
        ax += dx;
        az += dz; 

        tx = (ax/tilew)|0;
        tz = (az/tileh)|0;
          setVis(tx+1,tz,   curVis); 
          setVis(tx-1,tz,   curVis);
          setVis(tx,tz+1,   curVis);
          setVis(tx,tz-1,   curVis);  
        
        return; 
      }//endif3
      
    }//nexti 
  }//visray 
  
  function visTest(ax, az, ang)
  {
     
     curVis += 1;
     
    //classic raycast test for vis
     
    var ta; var td; var tu; var ts;
    var num;
    td = 1.57 * 0.5; //90 deg  -45 to 45 
    tu = td / 90;  //dist between angles 
   
     //todo -- just  a hack for a wider angle 
     td += 0.10; //extra
     tu = td / 160; //100;
    
    ts = -8.0;  //step 
    //ts = -16.0;
    //num = 80; //80*8  640   -- map is 1024x1024
     num = 63;  //32x32 map  of 16x16 tiles 
    for (ta=-td; ta<=td; ta+= tu)
    {
      visRay(ax, az, Math.cos(ta+ang)*ts, Math.sin(ta+ang)*ts, num);      
    }//nextta
        
  }//vistest
  
  
  
  function visBox(ax, az, tilerad)
  {
    var i, k;
    var tx, tz;
    var tr;
    tx = (ax/tilew)|0;
    tz = (az/tileh)|0;
    
    //curVis += 1;
    
    tr = tilerad;
    
    for (i=-tr;i<=tr;i+=1)
    {
      for (k=-tr;k<=tr;k+=1)
      {
        setVis(tx+k, tz+i, curVis);
      }//nextk 
    }//nexti
  
  }//visbox 
  
  
  
  
   function drawVisDeb(stx, sty, ox, oy)
   {
    var k; var i; var t;
    var ax, ay; var yt;
    var tx, ty;
    var kw, kh;
    
    //kw = 20+1;
    //kh = 15+1;
    
    kw = scrTilew+1;
    kh = scrTileh+1;

    if (kw>mapmw){kw=mapmw;}
    if (kh>mapmh){kh=mapmh;}
    
    stx = Math.floor(stx);
    sty = Math.floor(sty);
    
    ctx.fillStyle = "#aabbcc80";

    
      for (i=0;i<kh;i+=1)
      {  
        ty = (i+sty);
        if (ty<0) { continue; }
        if (ty>=mapmh) { break; }
        yt = Math.floor(ty*mapmw);
        
        ay = i * tileh + oy;    
        
        for (k=0;k<kw;k+=1)
        {
          tx = (k+stx);
          if (tx<0){continue;}
          if (tx>=mapmw){break;}
          
          if (isVis(tx, ty) == false) { continue; } 
          
          ax = k * tilew + ox ;

           ctx.fillRect(ax,ay, tilew, tileh);

        }//nextk         
      }//nexti   
       
   }//drawvisdeb
  
  

  function getFlag(ax, ay)
  {
    ax|=0; ay|=0;
    if (ax<0||ay<0||ax>=mapmw||ay>=mapmh){return 1;}
    return vecFlag[ax+(ay*mapmw)];
  }//getFlag
  
  function setFlag(ax,ay, t)
  {
    ax|=0; ay|=0;
    if (ax<0||ay<0||ax>=mapmw||ay>=mapmh){return;}
   vecFlag[ax+(ay*mapmw)] = t;    
  }//setFlag
  
  //todo -- this should ignore doors 
  function updateFlag(ax, ay)
  {
    var f;
    f = 0;
    if (getMapTile(ax-1,ay)>lastNoFlag) { f|=1; }
    if (getMapTile(ax+1,ay)>lastNoFlag) { f|=2; }
    if (getMapTile(ax,ay-1)>lastNoFlag) { f|=4; }
    if (getMapTile(ax,ay+1)>lastNoFlag) { f|=8; }
    setFlag(ax,ay, f);
  }//updateflag 

  function updateFlag3(ax, ay)
  {
    var i, k;
    for (i=-1;i<2;i+=1)
    {
      for(k=-1;k<2;k+=1)
      {
        updateFlag(ax+k, ay+i);
      }
    }
    
  }//updateflag3
  
  function resetFlag()
  {
   var i, k;
    for (i=0;i<mapmh;i+=1)
    {
      for (k=0;k<mapmw;k+=1)
      {
        updateFlag(k,i);
      }//nextk
    }//nexti   
  }//resetflag 
  
  
  
  
  
  var bu0 = 0.0;  var bu1 = 1.0;
  var bv0 = 0.0;  var bv1 = 1.0;
  
  var bquad =  {x0:0,  y0:0, z0:0,   u0:1, v0:1,  
                x1:0,  y1:0, z1:0,   u1:1, v1:0,   
                x2:0,  y2:0, z2:0,   u2:0, v2:1,
                x3:0,  y3:0, z3:0,   u3:0, v3:0
               };
               
  var bquad2 =  {x0:0,  y0:0, z0:0,   u0:1, v0:1,  
                 x1:0,  y1:0, z1:0,   u1:1, v1:0,   
                 x2:0,  y2:0, z2:0,   u2:0, v2:1,
                };

  function drawBquad()
  {    
    drawCut(bquad, 0);
    
    //0 1 2
    //2 1 3
    
    bquad2.u0 = bquad.u2;    bquad2.v0 = bquad.v2;
    bquad2.x0 = bquad.x2;    bquad2.y0 = bquad.y2;  bquad2.z0 = bquad.z2;

    bquad2.u1 = bquad.u1;    bquad2.v1 = bquad.v1;
    bquad2.x1 = bquad.x1;    bquad2.y1 = bquad.y1;  bquad2.z1 = bquad.z1;
   
    bquad2.u2 = bquad.u3;    bquad2.v2 = bquad.v3;
    bquad2.x2 = bquad.x3;    bquad2.y2 = bquad.y3;  bquad2.z2 = bquad.z3;
    
    drawCut(bquad2, 0);
  }//drawBquad
  
  //function drawBlock(wall, flag, sideid, ax, az, aw)
  
  
  function drawBlock(flag, ax, az, aw)
  {
    var x0,y0,z0;
    var x1,y1,z1;
   //var flag;
    //flag = 0;
    //flag = 1 | 2 | 4| 8;
    
    x0 = ax;    y0 = 0.0;  z0 = az;
    x1 = x0+aw; y1=y0+aw;  z1=z0+aw;
    

   // setSkin(wall);
    
    //if (wall > 0)
    //{
      if ((flag & 8)  == 0)
      {        
        setPixel = setPixelDark;
        //setSideSkin(sideid+1);
        bquad.u0 = bu0; bquad.v0 = bv1; 
        bquad.u1 = bu1; bquad.v1 = bv1; 
        bquad.u2 = bu0; bquad.v2 = bv0; 
        bquad.u3 = bu1; bquad.v3 = bv0; 
        bquad.x0 = x0; bquad.y0 = y0; bquad.z0 = z1;
        bquad.x1 = x1; bquad.y1 = y0; bquad.z1 = z1;
        bquad.x2 = x0; bquad.y2 = y1; bquad.z2 = z1;
        bquad.x3 = x1; bquad.y3 = y1; bquad.z3 = z1;
        
        drawBquad();
      }//endif

      
      if ((flag & 4)  == 0)
      {
        
        setPixel = setPixelDark;
        //setSideSkin(sideid+0);
        bquad.u0 = bu1; bquad.v0 = bv1; 
        bquad.u1 = bu1; bquad.v1 = bv0; 
        bquad.u2 = bu0; bquad.v2 = bv1; 
        bquad.u3 = bu0; bquad.v3 = bv0; 
        bquad.x0 = x0; bquad.y0 = y0; bquad.z0 = z0;
        bquad.x1 = x0; bquad.y1 = y1; bquad.z1 = z0;
        bquad.x2 = x1; bquad.y2 = y0; bquad.z2 = z0;
        bquad.x3 = x1; bquad.y3 = y1; bquad.z3 = z0;
        
        drawBquad();
      }//endif 
      
        
     if ((flag & 2)  == 0)
      {
        setPixel = setPixelLight;
        //setSideSkin(sideid+2);
        bquad.u0 = bu1; bquad.v0 = bv1; 
        bquad.u1 = bu1; bquad.v1 = bv0; 
        bquad.u2 = bu0; bquad.v2 = bv1; 
        bquad.u3 = bu0; bquad.v3 = bv0; 
        bquad.x0 = x1; bquad.y0 = y0; bquad.z0 = z0;
        bquad.x1 = x1; bquad.y1 = y1; bquad.z1 = z0;
        bquad.x2 = x1; bquad.y2 = y0; bquad.z2 = z1;
        bquad.x3 = x1; bquad.y3 = y1; bquad.z3 = z1;
        
        drawBquad();
      }//endif 
         
      if ((flag & 1)  == 0)
      {
        setPixel = setPixelLight;
        //setSideSkin(sideid+3);
        bquad.u0 = bu0; bquad.v0 = bv1; 
        bquad.u1 = bu1; bquad.v1 = bv1; 
        bquad.u2 = bu0; bquad.v2 = bv0; 
        bquad.u3 = bu1; bquad.v3 = bv0; 
        bquad.x0 = x0; bquad.y0 = y0; bquad.z0 = z0;
        bquad.x1 = x0; bquad.y1 = y0; bquad.z1 = z1;
        bquad.x2 = x0; bquad.y2 = y1; bquad.z2 = z0;
        bquad.x3 = x0; bquad.y3 = y1; bquad.z3 = z1;
        
        drawBquad();
      }//endif   
      
    //  return;
    //}//ifwall 
    
    
/*
    //ceil 
    setSideSkin(sideid+4);
    bquad.u0 = bu1; bquad.v0 = bv0; 
    bquad.u1 = bu0; bquad.v1 = bv0; 
    bquad.u2 = bu1; bquad.v2 = bv1; 
    bquad.u3 = bu0; bquad.v3 = bv1; 
    bquad.x0 = x0; bquad.y0 = y1; bquad.z0 = z0;
    bquad.x1 = x1; bquad.y1 = y1; bquad.z1 = z0;
    bquad.x2 = x0; bquad.y2 = y1; bquad.z2 = z1;
    bquad.x3 = x1; bquad.y3 = y1; bquad.z3 = z1;    
    drawBquad();
    
    //floor
    setSideSkin(sideid+5);
    bquad.u0 = bu1; bquad.v0 = bv1; 
    bquad.u1 = bu1; bquad.v1 = bv0; 
    bquad.u2 = bu0; bquad.v2 = bv1; 
    bquad.u3 = bu0; bquad.v3 = bv0; 
    bquad.x0 = x0; bquad.y0 = y0; bquad.z0 = z0;
    bquad.x1 = x0; bquad.y1 = y0; bquad.z1 = z1;
    bquad.x2 = x1; bquad.y2 = y0; bquad.z2 = z0;
    bquad.x3 = x1; bquad.y3 = y0; bquad.z3 = z1;    
    drawBquad();
    */

  }//drawblock
  
  
  
  
  
  
  
  
  
  
  
  
  