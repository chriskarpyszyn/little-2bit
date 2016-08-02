var EnemyList = new (function() {
  var enemyList = [];

  this.brickTypeIsEnemy = function(type) {
    return brickTypeEnemyClasses[type];
  };

  this.createEnemyByBrickType = function(type, x, y) {
    var Enemy = brickTypeEnemyClasses[type];
    enemyList.push(new Enemy(x, y));
  };

  this.clear = function() {
    enemyList = [];
  };

  this.checkCollision = function(ship) {
    for (var i = 0; i < enemyList.length; i++) {
      if (checkCollisionShapes(ship, enemyList[i])) {
        ship.doDamage(enemyList[i].damage);
        enemyList[i].doDamage(ship.damage);
      }
    }
  };

  this.update = function() {
    var i;
    for (i = enemyList.length - 1; i >= 0; i--) {
      enemyList[i].move();

      enemyList[i].isReadyToRemove = enemyList[i].isReadyToRemove || enemyList[i].outOfBounds;

      if (!enemyList[i].isReadyToRemove) {
        ProjectileList.damagedBy(enemyList[i], [Laser, DoubleLaser, Rocket]);
      }
    }

    for (i = enemyList.length - 1; i >= 0; i--) {
      if (!enemyList[i].isReadyToRemove) {
        ProjectileList.blastDamagedBy(enemyList[i], [Laser, DoubleLaser, Rocket]);
      }

      if (enemyList[i].isReadyToRemove) {
        enemyList[i].explode();
        enemyList.splice(i, 1);
      }
    }
  };

  this.draw = function() {
    for (var i = 0; i < enemyList.length; i++) {
      enemyList[i].draw();
    }
  };
})();

function EnemyBase(x, y, vx, health, damage, width, height, image) {
  var halfWidth = width / 2;
  var halfHeight = height / 2;

  var frame = 0;
  var frameDelay = 1;
  var maxFrames = image.width / width;

  this.damage = damage;
  this.outOfBounds = false;
  this.isReadyToRemove = false;

  this.boundingBox = function() {
    return {
      left: x - halfWidth,
      top: y - halfHeight,
      right: x + halfWidth,
      bottom: y + halfHeight
    };
  };

  this.bounds = function() {
    return this._bounds(x, y);
  };

  this.coords = function() {
    return { x: x, y: y };
  };

  this.coordsTip = function() {
    return { x: x + halfWidth, y: y };
  };

  this.doDamage = function(amount) {
    health -= amount;
    this.isReadyToRemove = (health <= 0);
  };

  this.explode = function() {
    if (!this.outOfBounds) {
      this._explode(x, y);
    }
  };

  this.move = function() {
    x += vx;

    var levelInfo = Grid.levelInfo();
    this.outOfBounds = (levelInfo.leftBound - width > x || x > levelInfo.rightBound + width || 0 > y || y > levelInfo.height);
  };

  this.draw = function() {
    this._draw(frame, x, y, width, height);

    if (frameDelay-- <= 0) {
      frameDelay = 1;
      frame++;
      if (frame >= maxFrames) {
        frame = 0;
      }
    }

    if (debug) {
      var b = this.bounds();
      for (var c = 0; c < b.length; c++) {
        drawFillCircle(gameContext, b[c].x, b[c].y, 5, '#ff0');
      }
      b.push(b[0]);
      drawLines(gameContext, 'yellow', b);
    }
  }
}

var brickTypeEnemyClasses = [];
brickTypeEnemyClasses[ENEMY_SIMPLE] = SimpleEnemy;
brickTypeEnemyClasses[ENEMY_ADVANCED] = SimpleEnemy;
brickTypeEnemyClasses[ENEMY_TURRET_SIMPLE] = SimpleEnemy;
brickTypeEnemyClasses[ENEMY_TURRET_ADVANCED] = SimpleEnemy;

function SimpleEnemy(x, y) {
  var vx = -3;
  var health = 10;
  var damage = 2;
  var width = 60;
  var height = 94;

  var halfWidth = width / 2;
  var quarterWidth = width / 4;
  var eighthWidth = width / 8;
  var halfHeight = height / 2;
  var quarterHeight = height / 4;
  var eighthHeight = height / 8;

  this._bounds = function(x, y) {
    return [
      { x: x - quarterWidth, y: y },
      { x: x, y: y + halfHeight },
      { x: x + quarterWidth, y: y + halfHeight },
      { x: x + quarterWidth, y: y - halfHeight },
      { x: x, y: y - halfHeight }
    ];
  };

  this._explode = function(x, y) {
    ParticleList.spawnParticles(PFX_BUBBLE, x, y, 360, 0, 20, 30);
    Sounds.explosion_simple_enemy.play();
  };

  this._draw = function(frame, x, y, width, height) {
    drawBitmapCenteredWithRotation(gameContext, Images.simple_enemy, x, y, 0);
  };

  EnemyBase.call(this, x, y, vx, health, damage, width, height, Images.simple_enemy);
}

SimpleEnemy.prototype = Object.create(EnemyBase.prototype);
SimpleEnemy.prototype.constructor = SimpleEnemy;
