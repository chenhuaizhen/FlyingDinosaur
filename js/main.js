var documentWidth = $(window).width(); 
var documentHeight =  $(window).height(); 
var containerW = documentWidth;
var containerH = 0.995*documentHeight;
var ismoblie = false;
var ctx;
var canvas;
var contain = new Array();
var canvasW;
var canvasH;
var canmove = false;
var tid;
var birds = new Array();
var birdNum = 1;
var birdPic1 = new Image();
var birdPic2 = new Image();
var backPic = new Image();
var dinosaurPic1 = new Image();
var bigGun = new Image();
var shell = new Image();
var bigGuns;
var shells = new Array();
var shellNum = 1;
var lastTime;
var currentTime;
var dinosaur;
var startX;
var timenum=0;
var time = new time();
var gameChoice;
var score = new Score();
var globalID;
var isgameover = false;
var dinosaurPic = new Image();

$(document).ready(function(){
	prepareForMobile();
    Common();
	init();
});

function prepareForMobile(){
	if(documentWidth>700){
		containerW = 0.5*documentWidth;
	}
	else{
		ismoblie = true;
	}
	$('.container').css('width',containerW);
	$('.container').css('height',containerH);
	canvasW = containerW;
	canvasH = containerH;
	$('.content').css('width',canvasW);
	$('.content').css('height',canvasH);
	$('#canvas').attr('width',canvasW);
	$('#canvas').attr('height',canvasH);
}

function preImage(callback){      
    if (dinosaurPic.complete) { 
        callback.call(dinosaurPic);  
        return; 
     }    
     dinosaurPic.onload = function () { 
         callback.call(dinosaurPic);
     };  
}  

function init(){
    canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');
	canvas.addEventListener('mousedown',findDinosaur,false);
	canvas.addEventListener('mousemove',moveDinosaur,false);
    canvas.addEventListener('mouseup',loosenDinosaur,false);
    backPic.src="img/background.png";
    dinosaurPic1.src="img/dinosaurFly.png";
    dinosaurPic.src="img/dinosaur.png";
    ctx.clearRect(0,0,canvasW,canvasH);
    isgameover = false;
    preImage(function(){  
        ctx.drawImage(this,0,0,951,1000,0,0,canvasW,canvasH);  
    });
    gameChoice=0;
}

function about(){
    ctx.clearRect(0,0,canvasW,canvasH);
    ctx.drawImage(dinosaurPic,951,0,951,1000,0,0,canvasW,canvasH);  
    gameChoice=1;
}

function gate(){
    ctx.clearRect(0,0,canvasW,canvasH);
    score.init();
    ctx.drawImage(dinosaurPic,0,1000,951,1000,0,0,canvasW,canvasH);
    gameChoice=2;
}

function gameOne(){
    if(!ismoblie)
        birdPic1.src="img/birds2.png";
    birdPic2.src="img/birds.png";
    birds = [];
    contain = [];
    birdNum = 1;
    time.init();
    gameChoice=3;
    for(var i = 0;i<birdNum;i++){
        var obj = new Birds();
        birds.push(obj);
        birds[i].init();
    }
    dinosaur = new Dinosaur(canvasW*0.5,canvasH*0.5,canvasW*0.07,canvasW*0.05);
    contain.push(dinosaur);
    contain.push(time);
    currentTime = Date.now();
    gameOneloop();
}

function gameOneloop(){
    globalID=requestAnimationFrame(gameOneloop);
    
    var now = Date.now();
    lastTime = now - currentTime;
    currentTime = now;
    if(!ismoblie||birdNum<=50)
        addBirds();
    draw();
    drawBirds();
}

function gameTwo(){
    bigGun.src="img/bigGun.png";
    shell.src="img/shell.png";
    shells = [];
    contain = [];
    shellNum = 0;
    time.init();
    gameChoice=4;
    dinosaur = new Dinosaur(canvasW*0.5,canvasH*0.5,canvasW*0.07,canvasW*0.05);
    contain.push(dinosaur);
    contain.push(time);
    currentTime = Date.now();
    bigGuns = new BigGun();
    contain.push(bigGuns);
    gameTwoloop();
}

function gameTwoloop(){
    globalID=requestAnimationFrame(gameTwoloop);
    var now = Date.now();
    lastTime = now - currentTime;
    currentTime = now;
    draw();
    drawShells();
}

function drawbackground(){
    if(gameChoice==3)
        ctx.drawImage(backPic,0,0,1200,1696,0,0,canvasW,canvasH);
    if(gameChoice==4)
        ctx.drawImage(backPic,1200,0,1200,1696,0,0,canvasW,canvasH);
}

function findDinosaur(e) {
    var mx;
    var my;
    if ( e.layerX ||  e.layerX == 0) { 
        mx = e.layerX;
        my = e.layerY;
      } else if (e.offsetX || e.offsetX == 0) {
        mx = e.offsetX;
        my = e.offsetY;
      }
    if(gameChoice==0)
    {
        if(mx>=0.11*canvasW&&mx<=0.37*canvasW&&my>=0.14*canvasH&&my<=0.21*canvasH)
        {
            gate();
            return;
        }
        if(mx>=0.18*canvasW&&mx<=0.33*canvasW&&my>=0.29*canvasH&&my<=0.36*canvasH)
        {
            about()
            return;
        }
        return;
    }
    if(gameChoice==1){
        init();
        return;
    }
    if(gameChoice==2){
        if(my>=0.78*canvasH&&my<=0.93*canvasH)
        {
            if(mx>=0.04*canvasW&&mx<=0.56*canvasW)
            {
                gameOne();
                return;
            }  
            if(mx>=0.59*canvasW&&mx<=0.96*canvasW)
            {
                gameTwo();
                return;
            }  
        }
    }
    if(gameChoice==5){
        init();
        return;
    }
    if (distance(mx, my, dinosaur.centerX, dinosaur.centerY)<(dinosaur.length*0.5)*(dinosaur.length*0.5)) {
        canmove = true;
        startX = mx;
    }
}

function distance(x1,y1,x2,y2) {
    return (x1-x2)*(x1-x2)+(y1-y2)*(y1-y2);
}

function moveDinosaur(e) {
    var mx;
    var my;
    if (canmove) { 
        if(e.layerX || e.layerX == 0) { 
            mx = e.layerX;
            my = e.layerY;
        } else if (e.offsetX || e.offsetX == 0) { 
            mx = e.offsetX;
            my = e.offsetY;
        } 
    if(startX<mx)
        dinosaur.move(mx,my,0);
    else
        dinosaur.move(mx,my,1);
    }
}

function loosenDinosaur(){
    canmove = false;
}

function draw(){
	ctx.clearRect(0,0,canvasW,canvasH);
    drawbackground();
    for (var i=0;i<contain.length;i++) {
        contain[i].draw();
    }
}

function addBirds(){
    timenum += lastTime;
    if(timenum>=300){
        var obj = new Birds();
        obj.init();
        birds.push(obj);
        birdNum++;
        timenum = 0;
    }
}

function gameover(){
    cancelAnimationFrame(globalID);
    ctx.clearRect(0,0,canvasW,canvasH);
    if(gameChoice==3){
        ctx.drawImage(dinosaurPic,951,1000,951,1000,0,0,canvasW,canvasH);  
        score.draw();
    }        
    else{
        ctx.drawImage(dinosaurPic,1902,1000,951,1000,0,0,canvasW,canvasH);
        score.draw();
    }       
    gameChoice=5;
}

document.addEventListener('touchstart',function(event){
    var startx = event.touches[0].pageX;
    var starty = event.touches[0].pageY;
    if(gameChoice==3||gameChoice==4){
        if (distance(startx, starty, dinosaur.centerX, dinosaur.centerY)<(dinosaur.length*0.5)*(dinosaur.length*0.5)) {
            canmove = true;
            startX = startx;
        }
    }
});

document.addEventListener('touchmove',function(event){
    event.preventDefault();
    if (canmove) {
        var startx = event.changedTouches[0].pageX;
        var starty = event.changedTouches[0].pageY;
        if(startx<=0||startx>=canvasW||starty<=0||starty>=canvasH)
        {
            canmove = false;
            return;
        }
        if(startX<startx)
            dinosaur.move(startx,starty,0);
        else
            dinosaur.move(startx,starty,1);    
    }
});

document.addEventListener('touchend',function(event){
    canmove = false;
});
