 

 
 
 
 var vecSnd = {};
 

 var curMus;
 var mastVol = 1.0;
 var sndVol = 1.0;
 var musVol = 0.25;
 var muteVol = 1.0; // 0.0 to mute 
 
 //listener pos 
 var listx = 0.0;
 var listy = 0.0;
 var listz = 0.0;
 var listDist = 256.0; //512.0;
 
 function setListen(ax,ay,az)
 { listx=ax;listy=ay;listz=az; }
 
 function resetVol()
 {
   mastVol = 1.0;
   sndVol = 1.0;
   musVol = 0.25;

 }//resetvol
 
 
 function pauseAllSnd()
 {
    //todo 
 }//pauseall 
 
 function resumeAllSnd()
 {
    //todo   
   if (curMus != undefined)
   { curMus.play(); }
 }//resumeallsnd 
 
//https://www.html5rocks.com/en/tutorials/webaudio/intro/
 window.AudioContext = window.AudioContext || window.webkitAudioContext;
 var audctx = new AudioContext(); 
 
 
 
 function loadSound(srcName, sndName, npool)
 {
   //var aud =  new Audio(srcName);
  //vecSnd[sndName] = aud;   
  
  vecSnd[sndName] = {};
  vecSnd[sndName].req  = new XMLHttpRequest();
  vecSnd[sndName].req.open('GET', srcName, true);
  vecSnd[sndName].req.responseType = 'arraybuffer';
  vecSnd[sndName].ready = false;

    // Decode asynchronously
    vecSnd[sndName].req.onload = function() {
      audctx.decodeAudioData(vecSnd[sndName].req.response, function(buffer) {
        vecSnd[sndName].buffer = buffer;
        vecSnd[sndName].ready = true;
      });
    }
    vecSnd[sndName].req.send();
 }//loadsound 
 
 
 function getSnd(sndName)
 {
     //todo 
 }//getsnd  
 
 
 function playSnd(sndName, vol)
 {
   var a;
   a = vecSnd[sndName];
   if (a == null) { return; }
   if (a.ready == false) { return; }
 
   var gainNode = audctx.createGain();
   var source = audctx.createBufferSource();
   source.buffer = a.buffer;              
   source.connect(gainNode);   
   source.connect(audctx.destination);       
   gainNode.gain.value = vol;
   source.start(0);   
 }//playsound
 
 function sndMag3(ax,ay,az)
 { return Math.sqrt(ax*ax+ay*ay+az*az); }
 
 function playSnd3(sndName, vol, ax, ay, az)
 {
   //todo -- calc distance to listener 
    playSnd(sndName, vol);
 }//playsnd3
 
 
 function recalMusVol()
 {
   if (curMus == undefined) { return; }
   curMus.volume = 1.0 * mastVol * musVol * muteVol;
 }//recalmus 
 
 function playMus(srcName)
 {
   var a =  new Audio(srcName);
   a.autoplay = false; 
   
  if (curMus != undefined)
   { curMus.stop(); }
   curMus = a; 
   
   a.loop = true;
   a.volume = 1.0 * mastVol * musVol * muteVol;
   a.play();
 }//playmus 

 