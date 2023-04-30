

  var vecAct = [];
  var mapAct = {}; //hash by id 
  var curId = 1;
  var playerId = -1;
  
  var vecBull = [];
  

  function clearAct()
  {
    playerId = -1;
    curId = 1; //tman is 1 start at 3 //update tman is now actor
    vecAct = [];
    vecBull = [];
    mapAct = {};
    //todo -- clear array
  }//resetact
  
  function getAct(id)
  {
    a = mapAct[id];
    if (a==undefined){ a = 0; }
    if (a.id !=id) {return 0; }
    return a;
  }//getact 
  
  
  function getEmptAct()
  {
    var a;
        a = { 
          id:-1,
          hp:10,
          dead:false,
          cx:0, cy:0, cz:0, 
          crad:8, xrad:8,  yrad:8, zrad:8,
          brad:5, //bullet hit radius
          vx:0, vy:0, vz:0,
          cell:null,
          cellid:-1,

          sprName:"beast",
          visible:true,
          xmir:false,
          ymir:false,
          drawOrder:3, //bucket id 0 back - 7 front  //no longer used 
          funcUpdate:undefined,   //e.g. function updateMe(a) {  a.cx += 5; }  a.funcUpdate = updateMe;
          funcRender:undefined,
          funcState:undefined, //used by monster update 
          rendSpr:"midi",  //sprite for funcrender 
          //destfunc:undefined,
         
          ownerid:-1,
          team:0,
          spec:0,            
          state:0,
          stateCount:0,          

          ang:0,     
          angSpeed:0,
          pitch:0,
          
          dmg:5,
          dmgTime:0,
          reload:0,
          
          wallhit:0,
          dir:0,
    
          tx:0, ty:0,     

          cmd:0,
          wait:0,
          
          
          targid:0,
          targValid:0,
          targx:0,
          targy:0,
          
          size:16,
          yoff:0,
          walkFrame:0,
          lastSee:0,
          canJump:false,
          onGround:false,
          drawy:0,
          yhack:false,
          jumpy:0,
          djump:0
       
        };
     return a;
  }//getemptact
  
  
  function addAct()
  {
    var a;
    a = getEmptAct();
    a.id = curId;
    curId +=1;
    mapAct[a.id] = a;    
    vecAct.push(a);    
    return a;
  }//addact
  
  
  function addBull()
  {    
    var a;
     a = getEmptAct();
     a.id = curId;
     curId +=1;
     vecBull.push(a);    
    return a;
  }//addbull
  
  
  
  //remove dead actors after update
  function cleanAct(vec)
  {
   // return;
    var i; var num; var a; var k; var nk;
    num = vec.length | 0; 
    for (i=0;i<num;i+=1)
    {
      a = vec[i];
      if (a.dead)
      {
        for (k=i;k<num;k+=1)
        { vec[k] = vec[k+1]; }
        vec.pop();
        i -= 1; num -=1;   
        delete mapAct[a.id];
        
        if (a.cell!=null)
        { remObj(a.cell, a); }
        
        continue;        
      }//endif
    }//nexti  
    
   // console.log("cleanact ",gt," vec" ,vec);
   //console.log("cleanact ",gt," map " ,mapAct);
  }//cleanact 
  
  
  

  
  function remObj(cell, a)
  {
    //if (a.cellid == undefined) {}
    if (cell==null) { return; }
    if (a.cellid < 0) { return; }

    var b; 
    b = null;
    
    if (cell.numObj >= 2)
    {
     b = cell.vec[ cell.numObj - 1];
     b.cellid = a.cellid;
    }

    cell.vec[a.cellid] = b;
    cell.numObj -= 1;    

    a.cellid = -1;
    a.cell = null;
  }//remobj
  
  function addObj(cell, a)
  {
    if (a.cell == cell) { return; }
    if (a.cell != null) { remObj(a.cell, a); }
    
    cell.vec[cell.numObj] = a;
    a.cellid = cell.numObj;
    a.cell = cell;
    cell.numObj += 1;
  }//addobj
  
  var actGrid = 
  {
    vecGrid:[],
    mw:0,
    mh:0,    
    cx:0,
    cy:0,
    cw:128,
    ch:128,
    curTest:0
  };//actgrid 
  
  function initActGrid(ax,ay,aw,ah)
  {
     var a;
     a = actGrid;
     a.cx = ax;
     a.cy = ay;
     a.cw = 32; 
     a.ch = 32;
     a.mw = (aw / a.cw) + 1;
     a.mh = (ah / a.ch) + 1;
    
     a.curTest = 1;
    
     a.vecGrid = [];
    
    var num; var i;
    num = a.mw * a.mh;
    for(i=0;i<num;i+=1)
    {
      a.vecGrid[i] = { vec:[], numObj:0, test:0, cx:0, cy:0};
      a.vecGrid[i].cx = (i%a.mw) * a.cw;
      a.vecGrid[i].cy = Math.floor(i/a.mw)*a.ch;
    }//nexti
  
    console.log("init act grid ",ax,ay,aw,ah);    
  }//initactgrid
  
  
  function putInGrid(a)
  {
    var g; var c;
    var ax, ay;
    
    g = actGrid;
    
    ax = Math.floor((a.cx - g.cx)/g.cw);
    ay = Math.floor((a.cy - g.cy)/g.ch);
    
    if (ax<0||ax>=g.mw ||ay<0||ay>=g.mh) 
    { remObj(a.cell, a); return; }
  
    c = g.vecGrid[ax +(ay*g.mw)];
    addObj(c, a);    
    
  }//putingrid
  
  
  function getCell(ax, ay)
  {
    var g; var c;
    
    g = actGrid;
      
    ax = Math.floor((ax - g.cx)/g.cw);
    ay = Math.floor((ay - g.cy)/g.ch);
    
    if (ax<0||ax>=g.mw ||ay<0||ay>=g.mh) { return null }
    
   // console.log(gt,"get cell ",ax,ay);
    
    return g.vecGrid[ax +(ay*g.mw)];

  }//getcell 
  
  function getCellTile(tx, ty)
  {
    var g; var c;
    g = actGrid;
    if (tx<0||tx>=g.mw ||ty<0||ty>=g.mh) { return null }    
    return g.vecGrid[tx +(ty*g.mw)];    
  }//getcelltile
  
  var colVec = [];
  
  //radius is ignored for now)
  function getQuery(ax, ay, r)
  {
    var g; var c; var it;   
    g = actGrid;
    g.curTest += 1;
    it = 0;
    
    var tx, ty;
    tx =  Math.floor((ax - g.cx)/g.cw);
    ty =  Math.floor((ay - g.cy)/g.ch);

    //todo -- this always returns a 3x3 cell block for query 
    var i, k;
    for (i=-1;i<2;i+=1)
    {
      for (k=-1;k<2;k+=1)
      {
       c = getCellTile(tx+k, ty+i);   
       if (c==null) { continue; }
       if (c.test == g.curTest) { continue; }
       c.test = g.curTest;
       if (c.numObj <= 0) { continue; }
       colVec[it] = c; it+=1;  
      }//nextk
    }//nexti 
    
    /*
    c = getCell(ax-r, ay-r);    if (c!= null) { if (c.test != g.curTest && c.numObj>0) { c.test = g.curTest; colVec[it] = c; it+=1; } }
    c = getCell(ax+r, ay-r);    if (c!= null) { if (c.test != g.curTest && c.numObj>0) { c.test = g.curTest; colVec[it] = c; it+=1; } }
    c = getCell(ax-r, ay+r);    if (c!= null) { if (c.test != g.curTest && c.numObj>0) { c.test = g.curTest; colVec[it] = c; it+=1; } }
    c = getCell(ax+r, ay+r);    if (c!= null) { if (c.test != g.curTest && c.numObj>0) { c.test = g.curTest; colVec[it] = c; it+=1; } }
    */
    
    return it;    
  }//getquery 

  
  
  
  
  
  
  function lineRect(ax, ay, aw, ah)
  {
    ctx.fillRect(ax,ay, aw, 1);
    ctx.fillRect(ax,ay+ah-1, aw, 1);

    ctx.fillRect(ax,ay, 1, ah);
    ctx.fillRect(ax+aw-1,ay, 1, ah);
      
  }//linerect 
 
  function canSeeTest(ax, ay, bx, by)
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
      lineRect(ax-camx,ay-camy, 3,3);
      ax += dx;
      ay += dy;
    }//nexti 
    return true;
  }//cansee
  
  function drawActTest(vec)
  {
    var ax, ay;    var sx, sy;
    var i; var num; var a;
    num = vec.length | 0; 
    
    var showRect;
    showRect = false;
    if (isKeyDown(key_g)) { showRect = true; }
    
    ctx.strokeStyle = "#FF0000";    
    ctx.fillStyle = "#ffFFff";
      
    for (i=0; i < num; i+=1)
    {
      a = vec[i];
      
      if (a.visible == false) { continue; }
  
      ax = (a.cx - camx)|0;
      ay = (a.cy - camy)|0;
      
      if (a.yhack)
      { ay = (a.drawy - camy) |0; }
      
     
      if (a.cell!=null)
      {
        ctx.beginPath();
         ctx.moveTo(ax, ay);
         ctx.lineTo(a.cell.cx-camx, a.cell.cy-camy);
        ctx.stroke(); 
      }
      

      if (a.xmir || a.ymir)
      {
        
        sx=1; sy=1;
        if (a.xmir) { sx*=-1; }
        if (a.ymir) { sy*=-1; }
         drawSprAdv(a.sprName, ax, ay+a.yoff, 0, sx,sy); 
       // continue;        
      }
      else
      {
        drawSpr(a.sprName, ax, ay+a.yoff);                       
      }//endif
        
         //lineRect(ax,ay, ax+Math.cos(a.ang)*8, ay+Math.sin(a.ang)*8); 
       ctx.beginPath();
         ctx.moveTo(ax, ay);
         ctx.lineTo(ax+Math.cos(a.ang)*8, ay+Math.sin(a.ang)*8);
        ctx.stroke(); 
        
      if (a.spec == 1)
      {
        canSeeTest(a.cx,a.cy, a.cx+Math.cos(a.ang)*256,a.cy+Math.sin(a.ang)*256);

      }//endif     
        
        if (bDebug == false) { continue; }
        if (showRect == false) { continue; }
        
       
      ctx.fillStyle = "#ff00aa";
      lineRect(ax - a.crad, ay - a.crad, a.crad*2, a.crad*2);
      ctx.fillStyle = "#ffFFff";
      lineRect(ax - a.xrad, ay - a.yrad, a.xrad*2, a.yrad*2);
        
    }//nexti   
  }//drawacttest

  
  
  function updateAct(vec)
  {
    var i; var num; var a;
    var bclean = false;
    num = vec.length | 0; 
    
   
    for (i=0; i < num;i+=1)
    {
      a = vec[i];
      if (a.dead){ bclean=true; continue;}
      
      //only update actor if it appeared on screen 
     // if (a.lastSee <= 0) { continue; }
      
      if (a.funcUpdate != undefined)      {  a.funcUpdate(a); continue; }

      /*      
            if (a.spec == 1)       { movePlayer(a); }
           // else if (a.spec == 3)       { moveBull(a); }
            else   { moveAct(a); }
        */    
      /*
      if (a.spec == 1) { upPlayer(a); continue; }
      if (a.spec == 3) { upMonst(a); continue; }
      if (a.spec == 99) { upBlock(a); continue; }
      */
    }//nexti 
    if (bclean) { cleanAct(vec); }
  }//updateact
  
  
  
//experimental
//checkActCol(a, colFuncTest);
function checkActCol(m, colFunc)
{
  var c;  var i, k, num;

  if (colFunc == undefined) { return; }

  var d;
  d = m.xrad;
  if (m.yrad > d) { d = m.yrad; }
  
  num = getQuery(m.cx, m.cy, d+8);
  for (i=0;i<num;i+=1)
  {
    c = colVec[i];
    for (k=0;k<c.numObj;k+=1)
    {
      a = c.vec[k];
    
      if (m.cx + m.xrad < a.cx - a.xrad) { continue; }
      if (m.cx - m.xrad > a.cx + a.xrad) { continue; }
      if (m.cy + m.yrad < a.cy - a.yrad) { continue; }
      if (m.cy - m.yrad > a.cy + a.yrad) { continue; }
      if (m == a) { continue; }
      if (a.dead) { continue; }
      
      
      if (colFunc(m, a) == false) { return; }
        
    }//nextk 
  }//nexti
}//actcol  

  
  /*
//example for cheackactcol
function checkActColEx(m)
{
  var c; var k; var dot;
  var d; var dx; var dy;
  var ix, iy;  var ret;
  ret = false ;

  num = getQuery(m.cx, m.cy, m.crad+8);
  for (i=0;i<num;i+=1)
  {
    c = colVec[i];
    for (k=0;k<c.numObj;k+=1)
    {
      a = c.vec[k];
    
      if (m.cx + m.crad < a.cx - a.crad) { continue; }
      if (m.cx - m.crad > a.cx + a.crad) { continue; }
      if (m.cy + m.crad < a.cy - a.crad) { continue; }
      if (m.cy - m.crad > a.cy + a.crad) { continue; }
      if (m == a) { continue; }
    

      dx = m.cx - ix;
      dy = m.cy - iy;
      
      d = Math.sqrt(dx*dx+dy*dy);
      if (d > m.crad) { continue; }
      if (d == 0.0) { continue; }
      dx /= d;
      dy /= d;
      
      dot = dx*m.vx + dy*m.vy;
      if (dot <= 0)
      {
        m.vx -= dx * dot;
        m.vy -= dy * dot;
        ret = true;
      }    
      
    }//nextk 
  }//nexti
  return ret;
}//actcol  
*/
  