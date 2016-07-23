var EnemyList = new (function(){
  var enemyList = [];

  this.push = function(enemy) {
    enemyList.push(enemy);
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

  this.update = function () {
    for (var i = enemyList.length - 1; i >= 0; i--) {
      enemyList[i].update();

      if (enemyList[i].isReadyToRemove) {
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

var SimpleEnemy = function(_x, _y) {
  var x = _x;
  var y = _y;
  var vx = -3;

  var halfWidth = Images.simple_enemy.width / 2;
  var quarterWidth = Images.simple_enemy.width / 4;
  var eighthWidth = Images.simple_enemy.width / 8;
  var halfHeight = Images.simple_enemy.height / 2;
  var quarterHeight = Images.simple_enemy.height / 4;
  var eighthHeight = Images.simple_enemy.height / 8;

  var health = 10;
  this.damage = 10;

  this.isReadyToRemove = false;

  this.boundingBox = function() {
    return {
      left: x-halfWidth,
      top: y-halfHeight,
      right: x+halfWidth,
      bottom: y+halfHeight
    };
  };

  this.bounds = function() {
    return [
      {x: x-quarterWidth, y: y},
      {x: x, y: y+halfHeight},
      {x: x+quarterWidth, y: y+halfHeight},
      {x: x+quarterWidth, y: y-halfHeight},
      {x: x, y: y-halfHeight}
    ];
  };

  this.doDamage = function(amount) {
    health -= amount;
  };

  this.update = function() {
    x += vx;
    this.isReadyToRemove = (x < Grid.cameraPanX());

    if (!this.isReadyToRemove) {
      ProjectileList.damagedBy(this, [Bullet, Rocket]);
    }

    if (health <= 0) {
      this.isReadyToRemove = true;
      ParticleList.spawnParticles(PFX_BUBBLE, x, y, 360, 0, 20, 30);
      Sounds.explosion_simple_enemy.play();
    }
  };

  this.draw = function() {
    drawBitmapCenteredWithRotation(gameContext, Images.simple_enemy, x, y, 0);

    if (debug) {
      var b = this.bounds();
      for (var c = 0; c < b.length; c++) {
        drawCircle(gameContext, b[c].x, b[c].y, 5, '#ff0');
      }
      b.push(b[0]);
      drawLines(gameContext, 'yellow', b);
    }
  };
};
