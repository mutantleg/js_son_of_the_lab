


 
 var imgData = new Uint8ClampedArray(320*240*4); //  ctx.createImageData(320, 240);
 var drawData  = ctx.createImageData(320, 240);

 
 function flipImage()
 {
   drawData.data.set(imgData);
 }//flipimage 
 
 //ctx.putImageData(imgData, 0, 0);
  //    imgData[t+0] = rc;
  //    imgData[t+1] = gc;
  //    imgData[t+2] = bc;
  //    imgData[t+3] = 255;
 
  function setDataPix(ax, ay, rc, gc, bc)
  {
    ax |= 0; ay |= 0;
    var t = (ax + (ay*320)) * 4;
    //console.log(" t ", t);
    imgData[t+0] = rc;
    imgData[t+1] = gc;
    imgData[t+2] = bc;
    imgData[t+3] = 255;
  }//setpixel  
   
   //used by 3D stuff 
  function setPixel(ax, ay, rc, gc, bc)
  {
    ax |= 0; ay |= 0;
    var t = (ax + (ay*320)) * 4;
    //console.log(" t ", t);
    imgData[t+0] = rc;
    imgData[t+1] = gc;
    imgData[t+2] = bc;
    imgData[t+3] = 255;
  }//setpixel  

  
  function setPixelLight(ax, ay, rc, gc, bc)
  {
    ax |= 0; ay |= 0;
    var t = (ax + (ay*320)) * 4;
    //console.log(" t ", t);
    imgData[t+0] = rc;
    imgData[t+1] = gc;
    imgData[t+2] = bc;
    //imgData[t+3] = 255;
  }//setpixeldark  

  
  function setPixelDark(ax, ay, rc, gc, bc)
  {
    ax |= 0; ay |= 0;
    var t = (ax + (ay*320)) * 4;
    //console.log(" t ", t);
    imgData[t+0] = rc*0.60;
    imgData[t+1] = gc*0.60;
    imgData[t+2] = bc*0.60;
    //imgData[t+3] = 255;
  }//setpixeldark  

  function setPixelShad(ax, ay, rc, gc, bc)
  {
    ax |= 0; ay |= 0;
    var t = (ax + (ay*320)) * 4;
    //console.log(" t ", t);
    imgData[t+0] = 32;
    imgData[t+1] = 32;
    imgData[t+2] = 32;
    //imgData[t+3] = 255;
  }//setpixeldark  

  
  function clearDataPix( rc, gc, bc)
  {
      var i; var num;
      num=320*240*4;
      for (i=0;i<num;i+=4)
      {
        imgData[i+0] = rc;
        imgData[i+1] = gc;
        imgData[i+2] = bc;
        imgData[i+3] = 255;  
      }//nexti 
  }//cleardata 
  
  
  function setDataLine(x0, y0, x1, y1,  rc, gc, bc) 
 {
   var dx, dy, err, e2; var i;
   x0 |= 0; y0 |= 0; x1 |= 0; y1 |= 0;
   
   dx = Math.abs(x1-x0), sx = x0<x1 ? 1 : -1;
   dy = Math.abs(y1-y0), sy = y0<y1 ? 1 : -1; 
   err = (dx>dy ? dx : -dy)/2;
 
    for(i=0;i<400;i+=1){
      setDataPix(x0, y0, rc, gc, bc);
      if (x0==x1 && y0==y1) break;
      e2 = err;
      if (e2 >-dx) { err -= dy; x0 += sx; }
      if (e2 < dy) { err += dx; y0 += sy; }
    }//nexti
}//setline
  
  
  