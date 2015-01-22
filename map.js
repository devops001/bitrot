
App.Map = function(tiles, player) {
  this.tiles     = tiles;
  this.width     = tiles.length;
  this.height    = tiles[0].length;
  this.scheduler = new ROT.Scheduler.Simple();
  this.engine    = new ROT.Engine(this.scheduler);
  this.entities  = [];
  this.addEntityAtRandPos(player);
  for (var i=0; i<1000; i++) {
    this.addEntityAtRandPos(new App.Entity(App.Templates.fungus));
  }
};

App.Map.prototype.getTile = function(x, y) {
  if (x<0 || x>=this.width || y<0 || y>=this.height) {
    return App.Tiles.null;
  }
  return this.tiles[x][y] || App.Tiles.null;
};

App.Map.prototype.dig = function(x, y) {
  if (this.getTile(x,y).isDiggable) {
    this.tiles[x][y] = App.Tiles.floor;
  }
};

App.Map.prototype.getRandFloorPos = function() {
  var x, y;
  do {
    x = Math.floor(Math.random()*this.width);
    y = Math.floor(Math.random()*this.height);
  } while (!this.isOpen(x, y));
  return {x:x, y:y};
};

App.Map.prototype.getEntityAt = function(x, y) {
  for (var i=0; i<this.entities.length; i++) {
    var entity = this.entities[i];
    if (entity.x==x && entity.y==y) {
      return entity;
    }
  }
  return null;
};

App.Map.prototype.addEntity = function(entity) {
  if (entity.x<0 || entity.x>=this.width || entity.y<0 || entity.y>=this.height) {
    throw new Error('addEntity: entity out of map bounds');
  }
  entity.map = this;
  this.entities.push(entity);
  if (entity.hasMixin('Acting')) {
    this.scheduler.add(entity, true);
  }
};

App.Map.prototype.addEntityAtRandPos = function(entity) {
  var pos  = this.getRandFloorPos();
  entity.x = pos.x;
  entity.y = pos.y;
  this.addEntity(entity);
};

App.Map.prototype.removeEntity = function(entity) {
  for (var i=0; i<this.entities.length; i++) {
    if (this.entities[i] == entity) {
      this.entities.splice(i, 1);
      break;
    }
  }
  if (entity.hasMixin('Acting')) {
    this.scheduler.remove(entity);
  }
};

App.Map.prototype.isOpen = function(x, y) {
  return this.getTile(x,y).isWalkable && !this.getEntityAt(x,y);
};
