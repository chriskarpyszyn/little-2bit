const MAXHEALTH = 20;
const SHIP_FRAME_DELAY = 2;
const SHIP_DEFAULT_PROJECTILE = Laser;

var Ship = new (function() {
  this.keyHeld_N = false;
  this.keyHeld_S = false;
  this.keyHeld_W = false;
  this.keyHeld_E = false;

  this.isDead = false;
  this.speedX = 8;
  this.speedY = 5;
  this.damage = 50;

  var x, y;
  var minX, minY, maxX, maxY;
  var width = 100;
  var height = 35;
  var halfWidth, quarterWidth, eighthWidth;
  var halfHeight, quarterHeight;

  this.health = MAXHEALTH;

  var projectileType;
  var ProjectileClass;
  var projectileLast = 0;
  var projectileTimeout = 0;

  var frame = 0;
  var maxFrames = 0;
  var frameDelay = SHIP_FRAME_DELAY;

  this.initialize = function() {
    var levelInfo = Grid.levelInfo();

    x = 100;
    y = levelInfo.height / 2;

    halfWidth = width / 2;
    quarterWidth = width / 4;
    eighthWidth = width / 8;
    halfHeight = height / 2;
    quarterHeight = height / 4;
    minX = halfWidth;
    maxX = levelInfo.width - halfWidth;
    minY = halfHeight;
    maxY = levelInfo.height - halfHeight;

    maxFrames = Math.floor(Images.ship.width / width);

    this.setProjectile(SHIP_DEFAULT_PROJECTILE);
  };

  this.doDamage = function(amount) {
    this.health -= amount;

    shakeScreen(5 * amount);

    this.isDead = (this.health <= 0);
  };

  this.boundingBox = function() {
    return {
      left: x - halfWidth,
      top: y - halfHeight,
      right: x + halfWidth,
      bottom: y + halfHeight
    };
  };

  this.bounds = function() {
    return [
      // Upper halfway right
      { x: x + quarterWidth, y: y - halfHeight },
      // Upper halfway left
      { x: x, y: y - halfHeight },
      // Upper left
      { x: x - (eighthWidth * 3), y: y - halfHeight },
      // Middle left
      { x: x - quarterWidth, y: y },
      // Lower left
      { x: x - quarterWidth, y: y + halfHeight },
      // Lower middle
      { x: x, y: y + halfHeight },
      // Lower halfway right
      { x: x + quarterWidth, y: y + halfHeight },
      // Lower right
      { x: x + halfWidth, y: y + quarterHeight },
      // Middle right
      { x: x + halfWidth, y: y }
    ];
  };

  this.muzzleCoords = function() {
    return {
      x: x + halfWidth,
      y: y + 2
    };
  };

  this.checkCollisions = function() {
    var checkCoords = this.bounds();
    for (var c = 0; c < checkCoords.length; c++) {
      if (Grid.isSolidTileTypeAtCoords(checkCoords[c].x, checkCoords[c].y)) {
        if (debug) {
          drawFillCircle(gameContext, checkCoords[c].x, checkCoords[c].y, 5, '#0f0');
        }
        this.isDead = true;
        break;
      }
    }

    if (!this.isDead) {
      enemyProjectiles.checkCollision(this);
      EnemyList.checkCollision(this);
      PowerUpList.checkCollision(this);
    }
  };

  this.setProjectile = function(projectile) {
    ProjectileClass = projectile;
    projectileType = ProjectileClass.prototype.constructor.name;
    projectileTimeout = 0;
    if (PROJECTILE_INFO[projectileType].timeLimit > 0) {
      projectileTimeout = Date.now() + PROJECTILE_INFO[projectileType].timeLimit * 1000;
    }
  };

  this.update = function() {
    if (this.isDead) {
      return;
    }

    if (this.keyHeld_N) {
      y -= this.speedY;
      if (y < minY) {
        y = minY;
      }
    }
    else if (this.keyHeld_S) {
      y += this.speedY;
      if (y > maxY) {
        y = maxY;
      }
    }

    if (this.keyHeld_W) {
      x -= this.speedX;
      if (x < Grid.cameraPanX() + minX) {
        x = Grid.cameraPanX() + minX;
      }
    }
    else if (this.keyHeld_E) {
      x += this.speedX;
      if (x > maxX) {
        x = maxX;
      }
    }

    this.checkCollisions();

    if (this.isDead) {
      shakeScreen(35);

      EnemyList.clear();
      PowerUpList.clear();
      shipProjectiles.clear();
      enemyProjectiles.clear();
      ParticleList.spawnParticles(PFX_BUBBLE, x, y, 360, 0, 25, 50);
      Sounds.explosion_ship.play();
    }

    if (PROJECTILE_INFO[projectileType]) {
      projectileLast++;

      if (projectileLast >= PROJECTILE_INFO[projectileType].rate) {
        projectileLast = 0;
        var muzzle = this.muzzleCoords();
        shipProjectiles.spawn(ProjectileClass, muzzle.x, muzzle.y);
      }
    }

    // Reset to default projectile
    if (projectileTimeout > 0 && projectileTimeout <= Date.now()) {
      this.setProjectile(SHIP_DEFAULT_PROJECTILE);
    }
  };

  this.draw = function() {
    if (!this.isDead) {
      gameContext.drawImage(Images.ship, width * frame, 0, width, height, x - halfWidth, y - halfHeight, width, height);
      if (frameDelay-- <= 0) {
        frameDelay = SHIP_FRAME_DELAY;
        frame++;
        if (frame >= maxFrames) {
          frame = 0;
        }
      }
    }

    if (debug) {
      var b = this.bounds();
      for (var c = 0; c < b.length; c++) {
        drawFillCircle(gameContext, b[c].x, b[c].y, 5, '#f00');
      }
      b.push(b[0]);
      drawLines(gameContext, '#f00', b);
      this.checkCollisions();
      var muzzle = this.muzzleCoords();
      drawFillCircle(gameContext, muzzle.x, muzzle.y, 5, "#00f");
    }
  };

  this.coords = function() {
    return { x: x, y: y };
  };

  this.currentProjectile = function() {
    return ProjectileClass;
  };

  return this;
})();
