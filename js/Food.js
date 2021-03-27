class Food {
    constructor() {
        this.img = loadImage("images/Milk.png");
        this.foodStock = foodStock;
        this.lastFed = lastFed;
    }

    getFoodStock() {
        this.foodStock = foodStock.on("value", function(data) {
            foodS = data.val();
        });
        return foodS;
    }

    updateFoodStock(x) {
        database.ref("/").update({
            "Food": x
        });
    }

    deductFood(x) {
        if (x <= 0) {
            x = 0;
            dogSprite.addImage("dog", happyDog);
        } else {
            x = x - 3;
        }
        
        database.ref('/').set({
            'Food': x
        });
    }

    display() {
        //var x = 80, y = 100;
        var x = 80, y = 100;

        imageMode(CENTER);
        image(this.img, 720, 220, 70, 70);
        if (foodS != 0) {
            for (var i = 0; i < foodS; i++) {
                if (i % 10 === 0) {
                    x = 80;
                    y = y + 50;
                }

                image(this.img, x, y, 50, 50);
                x = x + 30;
               
            }
        }

        
    }

    bedroom() {
        background(bedroomImg);
    }

    garden() {
        background(gardenImg);
    }

    washroom() {
        background(washroomImg);
    }
}