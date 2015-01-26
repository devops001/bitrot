
App.Map = function(tiles, player) {
  this.tiles     = tiles;
  this.depth     = tiles.length;
  this.width     = tiles[0].length;
  this.height    = tiles[0][0].length;
  this.scheduler = new ROT.Scheduler.Simple();
  this.engine    = new ROT.Engine(this.scheduler);
  this.entities  = [];
  // add player:
  this.addEntityAtRandPos(player, 0);
  // add entities:
  for (var z=0; z<this.depth; z++) {
    for (var i=0; i<20; i++) {
      var fungus;
      if (Math.random()>0.25) {
        fungus = new App.Entity(App.Templates.fungus);
      } else {
        fungus = new App.Entity(App.Templates.poisonousFungus);
      }
      this.addEntityAtRandPos(fungus, z);
    }
  }
};

// tiles:

App.Map.prototype.getTile = function(x, y, z) {
  if (x<0 || x>=this.width || y<0 || y>=this.height || z<0 || z>=this.depth) {
    return App.Tiles.null;
  }
  return this.tiles[z][x][y] || App.Tiles.null;
};

App.Map.prototype.getRandOpenPos = function(z) {
  var x, y;
  do {
    x = Math.floor(Math.random()*this.width);
    y = Math.floor(Math.random()*this.height);
  } while (!this.isOpen(x,y,z));
  return {x:x, y:y, z:z};
};

App.Map.prototype.dig = function(x, y, z) {
  if (this.getTile(x,y,z).isDiggable) {
    this.tiles[z][x][y] = App.Tiles.floor;
  }
};

App.Map.prototype.isOpen = function(x, y, z) {
  return this.getTile(x,y,z).isWalkable && !this.getEntityAt(x,y,z);
};

// entities:

App.Map.prototype.getEntityAt = function(x, y, z) {
  for (var i=0; i<this.entities.length; i++) {
    var entity = this.entities[i];
    if (entity.z==z && entity.x==x && entity.y==y) {
      return entity;
    }
  }
  return null;
};

App.Map.prototype.addEntity = function(entity) {
  var e = entity;
  if (e.x<0 || e.x>=this.width || e.y<0 || e.y>=this.height || e.z<0 || e.z>=this.depth) {
    throw new Error('addEntity: entity out of map bounds');
  }
  entity.map = this;
  this.entities.push(entity);
  if (entity.hasMixin('Acting')) {
    this.scheduler.add(entity, true);
  }
};

App.Map.prototype.addEntityAtRandPos = function(entity, z) {
  var pos = this.getRandOpenPos(z);
  entity.setPosition(pos.x, pos.y, pos.z);
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

App.Map.prototype.getEntitiesWithinRadius = function(x, y, z, radius) {
  var entities = [];
  var left   = x-radius;
  var right  = x+radius;
  var top    = y-radius;
  var bottom = y+radius;
  for (var i=0; i<this.entities.length; i++) {
    var e = this.entities[i];
    if (e.z==z && e.x>=left && e.x<=right && e.y>=top && e.y<=bottom) {
      entities.push(e);
    }
  }
  return entities;
};
