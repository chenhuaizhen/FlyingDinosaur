function Dinosaur(x,y,length,width) {
  this.x = x;
  this.y = y;
  this.length = length;
  this.width = width;
  this.centerX = x+width*0.5;
  this.centerY = y+length*0.5;
  this.src = 0;
  this.draw = drawDinosaur;
  this.move = function(x,y,src){
    this.x =x;
    this.y =y;
    this.centerX = x+width*0.5;
    this.centerY = y+length*0.5;
    this.src = src;
  };
}

function drawDinosaur() {
  if(this.src==0)
    ctx.drawImage(dinosaurPic1,0,0,289,439,this.x,this.y,this.width,this.length);
  else
    ctx.drawImage(dinosaurPic1,289,0,289,439,this.x,this.y,this.width,this.length);
}

function Birds(){
  this.x;
  this.y;
  this.centerX;
  this.centerY;
  this.picnum;
  this.timenum;
  this.spdx;
  this.src;
  this.iscrash = iscrash;
  this.init = initBird;
  this.update =update;
  this.draw = drawBird;
}

function initBird(){
  if(!ismoblie){
    this.x = (Math.random()<=0.5)?-canvasW*0.08:canvasW;
    if(this.x==-canvasW*0.08)
      this.src=0;
    else
      this.src=1;
  }
  else{
    this.x=-canvasW*0.08;
    this.src=0;
  }
  this.y = Math.random()*canvasH;
  this.centerX = this.x+canvasW*0.04;
  this.centerY = this.y+canvasW*0.02;
  this.picnum = Math.floor(Math.random()*3);
  this.timenum = 0;
  this.spdx = Math.random()*5-2.5;
  if(this.spdx<0)
    this.spdx -= 1;
  if(this.spdx>0)
    this.spdx += 1;
}

function iscrash(){
  if(this.centerX<dinosaur.x+dinosaur.width&&this.centerX>dinosaur.x)
  {
    if(this.centerY>dinosaur.y&&this.centerY<dinosaur.y+dinosaur.length*0.84)
      return true;
  }
  return false;
}

function update(){
  if(this.iscrash()){    
    birds = [];
    birdNum = 0;
    isgameover = true;
    score.update(time.s,time.ms);
    gameover();
    return;
  } 
  this.timenum += lastTime;
  if(this.timenum>=100){
    this.timenum = 0;
    this.picnum ++;
    this.x += this.spdx*lastTime*0.3;
    this.centerX = this.x+canvasW*0.04;
    this.centerY = this.y+canvasW*0.02;
    if(this.x>=canvasW||this.x<-canvasW*0.08)
    {
      this.init();
      return;
    }
  }
  if(this.picnum>=9)
  {
    this.picnum = 0;
  }
}

function drawBird(){ 
  if(!ismoblie){
    if(this.src==1)
      ctx.drawImage(birdPic1,this.picnum*53,0,53,36,this.x,this.y,canvasW*0.08,canvasW*0.04);
    else
      ctx.drawImage(birdPic2,this.picnum*53,0,53,36,this.x,this.y,canvasW*0.08,canvasW*0.04);
  }
  else{
      ctx.drawImage(birdPic2,this.picnum*53,0,53,36,this.x,this.y,canvasW*0.1,canvasW*0.05);
  }
}

function drawBirds(){
    for(var i = 0;i<birdNum;i++)
    {
      if(!isgameover)
        birds[i].update();
      if(!isgameover)
        birds[i].draw();
    }
}

function time(){
  this.s;
  this.ms;
  this.timenum=0;
  this.init = initTime;
  this.draw = drawTime;
  this.update = updateTime;
}

function initTime(){
  this.s=0;
  this.ms=0;
}

function drawTime(){
  this.update();
  ctx.font="30px Arial";
  ctx.fillStyle = "red";
  ctx.fillText(this.s+':'+this.ms,10,30);
}

function updateTime(){
  this.timenum += lastTime;
  if(this.timenum>=100){
    this.ms++;
    this.timenum=0;
  }
  if(this.ms==10){
    this.s++;
    this.ms=0;
  }
}

function Score(){
  this.s;
  this.ms;
  this.init = initScore;
  this.update = function(x,y){
    this.s =x;
    this.ms =y;
  }; 
  this.draw = drawScore;
}

function initScore(){
  this.s = 0;
  this.ms = 0;
}

function drawScore(){
  ctx.fillStyle = "white";
  if(documentWidth>700){
    ctx.font="120px white Arial";
    ctx.fillText(this.s+"."+this.ms+"s",0.35*canvasW,0.9*canvasH);
  } 
  else if(documentWidth>400){
    ctx.font="110px white Arial";
    ctx.fillText(this.s+"."+this.ms+"s",0.25*canvasW,0.9*canvasH);
  }  
  else {
    ctx.font="100px white Arial";
    ctx.fillText(this.s+"."+this.ms+"s",0.2*canvasW,0.9*canvasH);
  }
}

function Shell(){
  this.radius = canvasW*0.02;
  this.x = this.radius+canvasH*0.05;
  this.y = canvasH-this.radius-canvasH*0.05;
  this.ds = Math.random()*canvasW*0.02;
  this.angle;
  this.draw = drawShell;
  this.move = moveShell;
  this.reflect = reflect;
  this.ishit = ishit;
}

function drawShell(){
  ctx.drawImage(shell,0,0,100,123,this.x-this.radius,this.y-this.radius,this.radius*2,this.radius*2);
}

function ishit(){
  var dis = distance(this.x+this.radius,this.y+this.radius,dinosaur.centerX,dinosaur.centerY);
  if(dis<=(dinosaur.width*0.5+this.radius)*(dinosaur.width*0.5+this.radius))
    return true;
  else
    return false;
}

function reflect(){
  if(this.ishit())
  {
    isgameover = true;
    shells = [];
    shellNum = 0;
    score.update(time.s,time.ms);
    gameover();
    return;
  }
  if(this.x-this.radius<=0||this.x+this.radius>=canvasW||this.y-this.radius<=0||this.y+this.radius>=canvasH)
    this.angle = Math.PI-this.angle;
  if(this.y-this.radius<=0||this.y+this.radius>=canvasH)
    this.ds = -this.ds;
}

function moveShell(){
  this.x += this.ds*Math.cos(this.angle);
  this.y -= this.ds*Math.sin(this.angle);
  this.reflect();
}

function BigGun(){
  this.x = 0;
  this.y = canvasH*0.95;
  this.picnum = 0;
  this.timenum = 0;
  this.update = updateBigGun;
  this.draw = drawBigGun;
}

function updateBigGun(){
  this.timenum += lastTime;
  if(this.timenum>=300){
    this.timenum = 0;
    this.picnum ++;
    var obj  = new Shell();
    switch(this.picnum){
      case 0:
      case 1:
          var tha = Math.random()*22.5+67.5;
          obj.angle = tha*Math.PI/180;
          break;
      case 2:
      case 5:
          var tha = Math.random()*22.5+45;
          obj.angle = tha*Math.PI/180;
          break;
      case 3:
      case 4:
          var tha = Math.random()*22.5+22.5;
          obj.angle = tha*Math.PI/180;
          break;
    }
    shells.push(obj);
    shellNum++;  
  }
  if(this.picnum>=5)
  {
    this.picnum = 0;
  }
}

function drawBigGun(){
  if(!ismoblie||shellNum<=20)
    this.update();
  ctx.drawImage(bigGun,106.33*this.picnum,0,106.33,101,this.x,this.y,canvasH*0.05,canvasH*0.05);
}

function drawShells(){
    for(var i=0;i<shellNum;i++){
      if(!isgameover)
        shells[i].move();
      if(!isgameover)
        shells[i].draw();
    }
}