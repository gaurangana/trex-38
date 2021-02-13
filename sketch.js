var PLAY = 1;
var END = 0;
var gameState = PLAY;
var score;
var trex, trex_running, trex_collided ;
var ground, invisibleGround, groundImage ;
var cloudsGroup, cloudImage;
var obstaclesGroup ;
var obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var gameOverImg,restartImg, restart, database, allPlayers;
var jumpSound , checkPointSound , dieSound ;
 //var soundFlag = "silent" ;



function preload(){
  trex_running =   loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(windowWidth - 50 , windowHeight - 20);
  
  trex = createSprite(50,windowHeight - 60 ,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.x = width/2 ;

  trex.scale= 0.5 ;
  
  ground = createSprite(300,windowHeight- 40 ,600,20) ;
  ground.addImage("ground",groundImage) ;
  ground.debug = true ;
  ground.x = ground.width /2 ;
  console.log(ground.width/2) ;

  gameOver = createSprite(windowWidth/2 , windowHeight/2 );
  gameOver.addImage(gameOverImg);

  gameOver.scale = 0.5;

    //ground.velocityX = -(6 + 3*score/100);

  
  restart = createSprite(windowWidth/2 , windowHeight/2);
  restart.addImage(restartImg);
  
  restart.scale = 0.5;

  invisibleGround = createSprite(groundWidth/2, windowHeight-30, ground.width, 10);
  invisibleGround.visible = false;

  trex.setCollider("rectangle" ,0, 0, trex.width, trex.height) ;
  trex.debug = true ;
  trex.velocityX= -4 ;
  
  score = 0;
  if(localStorage["hightestScore"]){
      localStorage["hightScore"] = 0 ;
  }

  window.focus() ;

  cloudsGroup = new Group();
  obstaclesGroup = new Group();
}

function draw() {
  //trex.debug = true;
  background("white") ;
  textSize(15) ;
  text("Score: "+ score, windowWidth/2 + camera.position.x - 200 , 200);
  text("Hightest Score: "+ localStorage["highestScore"], windowWidth/2 + camra.position.x - 200, 100) ;
  
  if (gameState===PLAY){
    // score = score + Math.round(getFrameRate()/60);
    // ground.velocityX = -(6 + 3*score/100);
    gameOver.visible = false;
    restart.visible = false;

    camera.position.x = trex.x ;
  
    score = score+ Math.round(getFrameRate()/60);
    trex.velocityX += 0.05 ;
    if(score>0 && score% 100 === 0){
       checkPointSound.play() ;
    }

    if(camera.position.x + width/2 > ground.x + ground.width /2 ){
      ground.x = camera.position.x ;
      invisibleGround.x = camera.position.x ;
    }

    if((touches.length>0 || keyDown("space")) && trex.y>= windowHeight - 80){
      trex.velocityY = -12 ;

      if(soundFlag=== "silent"){
        jumpSound.play() ;
        soundFlag= "played"
      }
      touches[] ;
    }
     if(keyWentUp("space")){
       soundFlag = "silent" ;
      }
      trex.velocityY = trex.velocityX + 0.8 ;

      spawnClouds() ;
      spawnObstacles() ;

      if(obstaclesGroup.isTouching(trex)){
       gameState = END ;
       diesSound.display() ;
      }

  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    gameOver.x = trex.x ;
    restart.x = trex.x ;

    trex.changeAnimation("collided",trex_collided);

    trex.velocityX = 0;
    trex.velocityY = 0;

    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);

    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    trex.collide(invisibleGround) ;
  
    if(mousePressedOver(restart)) {
      reset();
    }
    touches[] ;

    drawSprites() ;
  }
  
  
  

  if(keyIsDown(UP_ARROW) && player.index !== null){
    player.distance +=10
    player.update();
  }
  
  drawSprites();

}

function reset(){
 gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;
  
}

 function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(
      camera.position.x + windowWidth/2 ,120,40,10 );
    cloud.y = Math.round(random(80,height - 100));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    // cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = abs(width/cloud.velocityX);
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 70 === 0) {
    var obstacle = createSprite(
      camera.position.x + windowWidth/2 ,
      windowHeight - 60, 
      10,
      40 ) ;
  
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle 

    obstacle.scale = 0.5;
    obstacle.lifetime = abs(width/ obstacle.velocityX) ;

    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}





