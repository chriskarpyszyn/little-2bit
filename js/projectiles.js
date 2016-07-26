var ProjectileList = new (function() {
  var projectiles = [];

  this.push = function(projectile) {
    projectiles.push(projectile);
  };

  this.clear = function() {
    projectiles = [];
  };

  this.update = function() {
    for (var p = projectiles.length - 1; p >= 0; p--) {
      projectiles[p].update();
      if (projectiles[p].readyToRemove || Ship.isDead) {
        projectiles.splice(p, 1);
      }
    }
  };

  this.draw = function() {
    if (Ship.isDead) {
      return;
    }

    for (var p = 0; p < projectiles.length; p++) {
      projectiles[p].draw();
    }
  };

  this.damagedBy = function(object, types) {
    var objectBounds = object.bounds();
    if (!objectBounds) {
      return;
    }

    for (var p = projectiles.length - 1; p >= 0; p--) {
      if (types.indexOf(projectiles[p].constructor) == -1) {
        continue;
      }

      if (checkCollisionPointShape(projectiles[p].coords(), objectBounds)) {
        object.doDamage(projectiles[p].damage);

        projectiles.splice(p, 1);
      }
    }
  }
})();

var Bullet = function(x, y) {
  this.readyToRemove = false;
  this.damage = 3;

  var vx = 11;
  var width = 8;
  var height = 2;
  var halfWidth = width / 2;
  var halfHeight = height / 2;
  y += 7;

  Sounds.laser.play();

  this.update = function() {
    x += vx;

    if (Grid.isSolidTileTypeAtCoords(x + halfWidth, y)) {
      this.readyToRemove = true;
    }
    else {
      var levelInfo = Grid.levelInfo();
      this.readyToRemove = (x > levelInfo.rightBound);
    }
  };

  this.draw = function() {
    drawRect(gameContext, x-halfWidth, y-halfHeight, width, height, 'white');
  };

  this.coords = function() {
    return {x: x, y: y};
  };

  this.bounds = function() {
    return [
      {x: x, y: y},
      {x: x+width, y: y},
      {x: x+width, y: y+height},
      {x: x, y: y+height}
    ];
  };
};

var Rocket = function(x, y) {
  this.readyToRemove = false;
  this.damage = 5;

  var vx = 16;
  var width = 24;
  var height = 6;
  var halfWidth = width / 2;
  var halfHeight = height / 2;
  y += 4;

  Sounds.rocket.play();

  this.update = function() {
    x += vx;

    if (Grid.isSolidTileTypeAtCoords(x + halfWidth, y)) {
      this.readyToRemove = true;
    }
    else {
      var levelInfo = Grid.levelInfo();
      this.readyToRemove = (x > levelInfo.rightBound);
    }
  };

  this.draw = function() {
    drawBitmapCenteredWithRotation(gameContext, Images.rocket, x-halfWidth, y-halfHeight, 0);
  };

  this.coords = function() {
    return {x: x, y: y};
  };

  this.bounds = function() {
    return [
      {x: x, y: y},
      {x: x+width, y: y},
      {x: x+width, y: y+height},
      {x: x, y: y+height}
    ];
  };
};
