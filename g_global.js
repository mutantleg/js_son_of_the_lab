 
    var gt = 0;  

    var camx = 0;
    var camy = 0;
    var camz = 0;

    var camYaw = 0;
    var camPitch = 0;
    var camRoll = 0;
    
    var wmx = 0;
    var wmy = 0;

  
  
    var gameState = 1;
    var gameWait = 0;
    var gameFade = 0.0;
    var gameMap = 0;
    
    var lastNoCol = 95;
    var lastNoFlag = 96+1;
    var lastNoVis = 96+1;
    var doorTile = 96;  
    var exploTile = 98;
    var pushTile = 99;



    var curGun = 1;
    var prevGun = -1;
    var hasGun = [0,   0, 0, 0,   0, 0, 0,   0, 0, 0,   0, 0];
    

    var redFade = 0.0; 
    var blueFade = 0.0;
    var runFrame = 0.0;
    var gunLeft = 0.0;
    var gunUp = 0.0;
    var gunFire = 0.0;
    var gunSpr = "launcher";
    var gunDelay = 0;
    
    var camFov = 60;
    var camAspect = 1.33;        
    var camNear = 1;
    var camFar = 8192;
    
   // var cori = {x:0, y:0, z:0, w:1}; //what was this thing again?
    
    var camOri = {x:0, y:0, z:0, w:1};
    var camPos = {x:0, y:0, z:0};
    
    //change these to float array?
    var projMat =  [1, 0, 0, 0,   0, 1, 0, 0,   0, 0, 1, 0,   0, 0, 0, 1]; 
    var viewMat =  [1, 0, 0, 0,   0, 1, 0, 0,   0, 0, 1, 0,   0, 0, 0, 1]; 
    var tempMat =  [1, 0, 0, 0,   0, 1, 0, 0,   0, 0, 1, 0,   0, 0, 0, 1]; 
    var identMat = [1, 0, 0, 0,   0, 1, 0, 0,   0, 0, 1, 0,   0, 0, 0, 1]; 

    var sprMat = [1, 0, 0, 0,   0, 1, 0, 0,   0, 0, 1, 0,   0, 0, 0, 1]; 
    
    var tq = { x:0,y:0,z:0,w:1 }; //temp quat 
    var tmat = [1, 0, 0, 0,   0, 1, 0, 0,   0, 0, 1, 0,   0, 0, 0, 1];  
    
    
  
  