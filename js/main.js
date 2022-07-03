$("body").append(`<div class="Score">점수 : </div>`)
  .append(`<div class="ScorePoint">0</div>`)
  .append(`<div class="ObjectZone" style="position: absolute" onclick="FindLocation(event)"></div>`);

let score = 0;

function FindLocation(event){
  let clickx = event.clientX;
  let clicky = event.clientY;
  console.log(clickx);
  return ClickEffect(clickx, clicky);
}

function ClickEffect(x, y){
  let effectx = x;
  let effecty = y;
  $(".ObjectZone").append(`<div class="ClickEffect" style="position:absolute; left:${effectx-150}px; top:${effecty-150}px;"></div>`);

  setTimeout(function (){
    $(".ClickEffect").detach();
  }, 1000);
  return ScoreChange(-10);
}

function ClickDeleteEffect(object){
  let effectx = object.x;
  let effecty = object.y;

  $(".ObjectZone").append(`<div class="DeleteEffect" style="position:absolute; left:${effectx-150}px; top:${effecty-150}px;"></div>`);
  this.body = $(".DeleteEffect");
  this.body.css("backgroundImage", "url(https://image.freepik.com/free-vector/boom_1308-2927.jpg)");

  setTimeout(function (){
  $(".DeleteEffect").detach();
  },1000);
}

function ClickDeleteEffectProgress(object){
  let _object = object;

  return function (){
    ClickDeleteEffect(_object);
  }
}

function ScoreChange(_score) {
  score += Math.floor(_score);
  document.querySelector(".ScorePoint").innerHTML = `${score}`;
}

function Spread(object){
  let _object = object;
  _object.body.detach();
  let size = _object.size*0.8;

  let SpreadScore = object.score - size;
  let chageScore = Math.floor(SpreadScore/10) *10;
  let x = object.x;
  let y = object.y;
  factory.CreateObject([4,5,6,7], size, x, y,"https://www.costco.co.kr/medias/sys_master/images/h53/h69/34486787833886.jpg");
  factory.CreateObject([4,5,6,7], size, x, y,"https://www.costco.co.kr/medias/sys_master/images/h53/h69/34486787833886.jpg");
  console.log(chageScore);
  return ScoreChange(chageScore);
}

function SpreadProgress(object){
  let _object = object;

  return function(){
    Spread(_object);
  }
}

function AIProgress(object, AIFuncArray){
  let _object = object;
  let _AIFuncArray = AIFuncArray;

  return function(){
    let i;
    for(i=0; i<_AIFuncArray.length; ++i){
      _AIFuncArray[i](_object);
    }
  }
}

class UnitObject{
  constructor(AIArray, size, x, y, imageurl = ""){
    this.x = x;
    this.y = y;
    this.move_side = 0;
    this.move_updown = 1;
    this.sidespeed = 1;
    this.updownspeed = 1;

    this.size = size;
    this.score = 300;
    let randimage = Math.floor(Math.random() * 3 - 1);
    this.image = randimage;

    $("body").append(`<div class="Object" style="position:absolute; width: ${this.size}px; height: ${this.size}px; left:${this.x}px; top:${this.y}px;"></div>`);
    this.body = $("body>div:last-child");
    this.body.css("backgroundImage", `url(${imageurl})`);
    this.body.click(SpreadProgress(this));
    this.body.click(ClickDeleteEffectProgress(this));
    this.body.click(FindLocation);
    setInterval(AIProgress(this, AIArray), 50);
  }
}

class Factory{
  constructor(){
    this.AI = [];
  }
  Push(AIFunc){
    this.AI.push(AIFunc);
  }
  CreateObject(AINumber,size, x, y, imageurl=""){
    let i;
    let AIArray = [];
    for(i = 0; i < AINumber.length; ++i){
      AIArray.push(this.AI[AINumber[i]]);
    }
    return new UnitObject(AIArray, size, x, y, imageurl);
  }
}


let factory = new Factory();
factory.Push(
  function(object){ // →
    object.x += 1;
    object.body.css("left", `${object.x}px`);
  });
factory.Push(
  function(object){ // ↓
    object.y += 1;
    object.body.css("top", `${object.y}px`);
  });
factory.Push(
  function(object){ // ←
    object.x -= 1;
    object.body.css("left", `${object.x}px`);
  });
factory.Push(
  function(object){ // ↑
    object.y -= 1;
    object.body.css("top", `${object.y}px`);
  });
factory.Push(
  function(object){ // ↔
    if(object.x >= 700){ // ←
      object.move_side = 0;
    }
    if(object.x <= 200){ // →
      object.move_side = 1;
    }
    if(object.move_side == 0){ // ←
      object.x -= object.sidespeed;
    }
    if(object.move_side == 1) { // →
      object.x += object.sidespeed;
    }
    object.body.css("left", `${object.x}px`);
  }
);
factory.Push(
  function(object){ // ↕
    if(object.y >= 700){ // ↑
      object.move_updown = 0;
    }
    if(object.y <= 200){ // ↓
      object.move_updown = 1;
    }
    if(object.move_updown == 0){ // ↑
      object.y -= object.updownspeed;
    }
    if(object.move_updown == 1){ // ↓
      object.y += object.updownspeed;
    }
    object.body.css("top", `${object.y}px`);
  }
);
factory.Push(function (object){
  let randside = Math.floor(Math.random() * 3);
  let randupdown = Math.floor(Math.random() * 5);
  if(object.sidespeed > 20){
    object.sidespeed = 2;
  }
  if(object.updownspeed > 20){
    object.updownspeed = 2;
  }
  object.sidespeed += randside;
  object.updownspeed += randupdown;
});

factory.Push(function (object){

  if(object.image == 0){
    object.body.css("backgroundImage", "url(https://m.jumpmall.co.kr/web/product/big/201704/3586_shop1_743781.jpg)");

  }
  if(object.image == 1){
    object.body.css("backgroundImage", "url(https://www.costco.co.kr/medias/sys_master/images/h53/h69/34486787833886.jpg)");
  }
  if(object.image == 1){
    object.body.css("backgroundImage", "url(https://cdn.imweb.me/thumbnail/20190327/5c9ae36786eab.jpg)");
  }
});


//factory.CreateObject([4,5,6], "https://www.costco.co.kr/medias/sys_master/images/h53/h69/34486787833886.jpg");
//factory.CreateObject([4,5,6], "https://m.jumpmall.co.kr/web/product/big/201704/3586_shop1_743781.jpg");
//factory.CreateObject([4,5,6], "https://cdn.imweb.me/thumbnail/20190327/5c9ae36786eab.jpg");
factory.CreateObject([4,5,7], 300,200, 450,"https://www.costco.co.kr/medias/sys_master/images/h53/h69/34486787833886.jpg");

