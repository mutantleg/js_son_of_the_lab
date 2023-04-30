

//https://developer.mozilla.org/en-US/docs/Web/API/ImageData
//imagedata is     width   height     data   (data is Uint8ClampedArray )

  // https://stackoverflow.com/questions/10754661/javascript-getting-imagedata-without-canvas
  //thanks to chrome we cannot do this
  function getImageAsData(img)
  {
   var canvas = document.createElement('canvas');
   var context = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0 );
    var myData = context.getImageData(0, 0, img.width, img.height);
   return myData;   
  }//getasdata
  
  
   //loading the image itself is blocked .. 
  var skinArray = [];
  function loadImageToSkin(imgName, useName)
  {
    var img= new Image();    
    img.src = imgName;
    img.crossOrigin = "Anonymous"; //doesnt work
    img.onload = function()  
    {
      skinArray[useName] = getImageAsData(this);
    }
  }//loadimagetoskin
  
  
  function setSkin(skinName)
  {
    var imgdat = skinArray[skinName];
    //console.log("imgdat ", imgdat);
    if (imgdat != undefined)
    {
     texw = imgdat.width;
     texh = imgdat.height;
     texData = imgdat.data;
    }
  }//setskin
     

   //1024x1024  64x64  tiles only
// update -- changed to 512x512 32x32 
//because i cannot be bothered to set it as parameters   
//remember -- use loadTileToSkin to load 
  function loadImageAsTile(img)
  {
   var canvas = document.createElement('canvas');
   var context = canvas.getContext('2d');
   var aw, ah;
   //todo -- set these from parameter or something 
   aw = 64; ah = 64;
    canvas.width = aw; //img.width;
    canvas.height = ah; //img.height;
    
    var k; var i; var t;
    t = 0;
    for (i=0;i<16;i+=1)
    {
     for (k=0;k<16;k+=1)
     {
       //todo -- draw without blend
       context.clearRect(0, 0, canvas.width, canvas.height);
       context.drawImage(img, k*aw,i*ah, aw,ah , 0,0, aw,ah );     
       skinArray[t] = context.getImageData(0, 0, aw, ah);
      t+= 1;
     }//nextk
    }//nexti
 
  }//loadImageAsTile
  
  function loadTileToSkin(imgName)
  {
    var img= new Image();    
    img.src = imgName;
    img.onload = function()  
    { loadImageAsTile(this); }
  }//loadTileToSkin
  
    
    