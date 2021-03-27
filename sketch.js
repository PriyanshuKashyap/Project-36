//Create variables here
var dogSprite, dog, happyDog, sadDog, database, foodS, foodStock;
var feed, addFood, fedTime, lastFed;
var foodObj, button;
var changeState, readState, gameState;
var bedroomImg, gardenImg, washroomImg;

function preload()
{
  //load images here
  dog = loadImage("images/dogImg.png");
  happyDog = loadImage("images/dogImg1.png");
  bedroomImg = loadImage("images/virtual pet images/Bed Room.png");
  gardenImg = loadImage("images/virtual pet images/Garden.png");
  washroomImg = loadImage("images/virtual pet images/Wash Room.png");
  sadDog = loadImage("images/virtual pet images/deadDog.png");

}

function setup() {
  database = firebase.database();
  createCanvas(500, 500);
  dogSprite = createSprite(width/2, height/2, 10, 10);
  dogSprite.addAnimation("dog", dog);
  dogSprite.scale = 0.5;

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);
  foodObj = new Food();

  feed = createButton("Feed the dog");
  feed.position(675, 165);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(775, 165);
  addFood.mousePressed(addFoods);

  readState = database.ref("gameState");
  readState.on("value", function(data) {
    gameState = data.val();
  })
}


function draw() {  
  background(46, 139, 87);
  fill(255, 255, 254);
  textSize(15);
  if (lastFed >= 12) {
    text("Last feed: " + lastFed%12 + " PM", 350, 30);
  } else if (lastFed === 0) {
    text("Last fed: 12 AM", 350, 30);

  } else {
    text("Last Feed: " + lastFed + " AM", 350, 30);
  }

  if (gameState !== "hungry") {
    feed.hide();
    addFood.hide();
    dogSprite.remove();
  } else {
    feed.show();
    addFood.show();
    dogSprite.addImage("dog", sadDog);
  }

  if (hour() === lastFed + 1) {
    foodObj.garden();
    update("playing");
    gameState = "playing";
    
  } else if (hour() >= lastFed + 2 && hour() <= lastFed + 4) {
    foodObj.washroom();
    update("bathing");
    gameState = "bathing";
    
  } else {
    update("hungry");
    gameState = "hungry";
    foodObj.display();
  }

  drawSprites();
  //add styles here
  fill("white");
  text("Foodstock remaining: " + foodS, width/2, height/2 - 200);
  textSize(40);
  stroke("white");
  foodObj.display();
  fedTime = database.ref("FeedTime");
  fedTime.on("value", function(data) {
    lastFed = data.val();
  });

  
}

function addFoods() {
  foodS++;
  database.ref("/").update({
    "Food": foodS
  });
}

function feedDog() {
  
  if (foodS <= 0) {
    foodS = 0;
    dogSprite.addImage("dog", happyDog);
    
  } else {
    foodObj.updateFoodStock(foodObj.getFoodStock() - 1);
    dogSprite.addImage("dog", dog);
  }

  database.ref("/").update({
    "Food": foodObj.getFoodStock(),
    "FeedTime": hour()
  });
  image(foodObj.img, 350, 200, 50, 50);
}

function readStock(data) {
  foodS = data.val();
}

function update(state) {
  changeState = database.ref("gameState").update({
    gameState: state
  });
}