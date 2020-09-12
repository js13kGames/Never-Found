// ==ClosureCompiler==
// @output_file_name default.js
// @compilation_level SIMPLE_OPTIMIZATIONS
// @language ECMASCRIPT5
// @fileoverview
// @suppress {checkTypes | globalThis | checkVars}
// ==/ClosureCompiler==

//This is the file with the Ga game framework plugins that I am using. 

GA.custom = function(ga) {

  //Your own collection of plugins will go here
  //Create a random number within a specific range
  ga.randomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

    //### scaleToWindow
//Center and scale the game engine inside the HTML page
ga.scaleToWindow = function(backgroundColor) {

  var scaleX, scaleY, scale, center;

  backgroundColor = backgroundColor || "#2C3539";

  //1. Scale the canvas to the correct size
  //Figure out the scale amount on each axis
  scaleX = window.innerWidth / ga.canvas.width;
  scaleY = window.innerHeight / ga.canvas.height;

  //Scale the canvas based on whichever value is less: `scaleX` or `scaleY`
  scale = Math.min(scaleX, scaleY);
  ga.canvas.style.transformOrigin = "0 0";
  ga.canvas.style.transform = "scale(" + scale + ")";

  //2. Center the canvas.
  //Decide whether to center the canvas vertically or horizontally.
  //Wide canvases should be centered vertically, and
  //square or tall canvases should be centered horizontally
  if (ga.canvas.width > ga.canvas.height) {
    if (ga.canvas.width * scale < window.innerWidth) {
      center = "horizontally";
    } else {
      center = "vertically";
    }
  } else {
    if (ga.canvas.height * scale < window.innerHeight) {
      center = "vertically";
    } else {
      center = "horizontally";
    }
  }

  //Center horizontally (for square or tall canvases)
  var margin;
  if (center === "horizontally") {
    margin = (window.innerWidth - ga.canvas.width * scale) / 2;
    ga.canvas.style.marginLeft = margin + "px";
    ga.canvas.style.marginRight = margin + "px";
  }

  //Center vertically (for wide canvases)
  if (center === "vertically") {
    margin = (window.innerHeight - ga.canvas.height * scale) / 2;
    ga.canvas.style.marginTop = margin + "px";
    ga.canvas.style.marginBottom = margin + "px";
  }

  //3. Remove any padding from the canvas  and body and set the canvas
  //display style to "block"
  ga.canvas.style.paddingLeft = 0;
  ga.canvas.style.paddingRight = 0;
  ga.canvas.style.paddingTop = 0;
  ga.canvas.style.paddingBottom = 0;
  ga.canvas.style.display = "block";

  //4. Set the color of the HTML body background
  document.body.style.backgroundColor = backgroundColor;

  //5. Set the game engine and pointer to the correct scale.
  //This is important for correct hit testing between the pointer and sprites
  ga.pointer.scale = scale;
  ga.scale = scale;

  //It's important to set `canvasHasBeenScaled` to `true` so that
  //the scale values aren't overridden by Ga's check for fullscreen
  //mode in the `update` function (in the `ga.js` file.)
  ga.canvas.scaled = true;

  //Fix some quirkiness in scaling for Safari
  var ua = navigator.userAgent.toLowerCase();
  if (ua.indexOf("safari") != -1) {
    if (ua.indexOf("chrome") > -1) {
      // Chrome
    } else {
      // Safari
      ga.canvas.style.maxHeight = "100%";
      ga.canvas.style.minHeight = "100%";
    }
  }
};

ga.hitTestRectangle = function(r1, r2, global) {
   var hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

   //Set `global` to a default value of `false`
   if(global === undefined) global = false;

   //A variable to determine whether there's a collision
   hit = false;

   //Calculate the distance vector
   if (global) {
     vx = (r1.gx + r1.halfWidth) - (r2.gx + r2.halfWidth);
     vy = (r1.gy + r1.halfHeight) - (r2.gy + r2.halfHeight);
   } else {
     vx = r1.centerX - r2.centerX;
     vy = r1.centerY - r2.centerY;
   }

   //Figure out the combined half-widths and half-heights
   combinedHalfWidths = r1.halfWidth + r2.halfWidth;
   combinedHalfHeights = r1.halfHeight + r2.halfHeight;

   //Check for a collision on the x axis
   if (Math.abs(vx) < combinedHalfWidths) {

     //A collision might be occuring. Check for a collision on the y axis
     if (Math.abs(vy) < combinedHalfHeights) {

       //There's definitely a collision happening
       hit = true;
     } else {

       //There's no collision on the y axis
       hit = false;
     }
   } else {

     //There's no collision on the x axis
     hit = false;
   }

   //`hit` will be either `true` or `false`
   return hit;
 };


};
