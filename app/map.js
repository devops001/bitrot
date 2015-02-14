
App.Map = function(tiles, player) {
  this.tiles     = tiles;
  this.depth     = tiles.length;
  this.width     = tiles[0].length;
  this.height    = tiles[0][0].length;
  this.fov       = [];
  this.explored  = [];
  this.entities  = {};
  this.items     = {};
  this.player    = player;
  this.scheduler = new ROT.Scheduler.Speed();
  this.engine    = new ROT.Engine(this.scheduler);
  this.addEntityAtRandPos(player, 0);
  this.populateLevels();
  this.initFov();
  this.initExploredList();
};

// init:

App.Map.prototype.populateLevels = function() {
  var entitiesPerLevel = 15;
  var itemsPerLevel    = 10;
  for (var z=0; z<this.depth; z++) {
    for (var i=0; i<entitiesPerLevel; i++) {
      this.addEntityAtRandPos(App.EntityRepository.createRandom(), z);
    }
    for (var i=0; i<itemsPerLevel; i++) {
      this.addItemAtRandPos(App.ItemRepository.createRandom(), z);
    }
  }
  // unique items:
  var z = randIntFromRange(0, this.depth-1);
  this.addItemAtRandPos(App.ItemRepository.create('pumpkin'), z);
};

App.Map.prototype.initFov = function() {
  // TODO: test simple version:
  //var map = this;
  //for (var z=0; z<map.depth; z++) {
    //var cb = function(x,y) { return !map.getTile(x,y,z).blocksLight; };
    //map.fov.push(new ROT.FOV.DiscreteShadowcasting(cb, {topology:4}));
  //}
  var map = this;
  for (var z=0; z<this.depth; z++) {
    (function() {
      var depth = z;
      map.fov.push(
        new ROT.FOV.DiscreteShadowcasting(function(x,y) {
          return !map.getTile(x,y,depth).blocksLight;
        }, {topology:4})
      );
    })();
  }
};

App.Map.prototype.initExploredList = function() {
  this.explored = new Array(this.depth);
  for (var z=0; z<this.depth; z++) {
    this.explored[z] = new Array(this.width);
    for (var x=0; x<this.width; x++) {
      this.explored[z][x] = new Array(this.height);
      for (var y=0; y<this.height; y++) {
        this.explored[z][x][y] = false;
      }
    }
  }
}

// items:

App.Map.prototype.getItemsAt = function(x, y, z) {
  // TODO: stop using string keys
  return this.items[x+","+y+","+z];
};

App.Map.prototype.setItemsAt = function(x, y, z, items) {
  // TODO: stop using string keys
  var key = x +","+ y +","+ z;
  if (items.length == 0) {
    if (this.items[key]) {
      delete this.items[key];
    }
  } else {
    this.items[key] = items;
  }
};

App.Map.prototype.addItem = function(x, y, z, item) {
  var key = x +","+ y +","+ z;
  if (this.items[key]) {
    this.items[key].push(item);
  } else {
    this.items[key] = [item];
  }
};

App.Map.prototype.addItemAtRandPos = function(item, z) {
  var pos = this.getRandOpenPos(z);
  this.addItem(pos.x, pos.y, pos.z, item);
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

App.Map.prototype.isExplored = function(x, y, z) {
  if (this.getTile(x,y,z) == App.Tiles.null) {
    return false;
  } else {
    return this.explored[z][x][y];
  }
}

App.Map.prototype.setExplored = function(x,y,z, isExplored) {
  if (this.getTile(x,y,z) != App.Tiles.null) {
    this.explored[z][x][y] = isExplored;
  }
}

// entities:

App.Map.prototype.getEntityAt = function(x, y, z) {
  // TODO: improve speed by not using strings for keys:
  return this.entities[x+","+y+","+z];
};

App.Map.prototype.addEntity = function(entity) {
  entity.map = this;
  this.updateEntityPosition(entity);
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
  // TODO: improve speed by not using strings for keys:
  var key = entity.x +","+ entity.y +","+ entity.z;
  if (this.entities[key] == entity) {
    delete this.entities[key];
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
  for (var key in this.entities) {
    var e = this.entities[key];
    if (e.z==z && e.x>=left && e.x<=right && e.y>=top && e.y<=bottom) {
      entities.push(e);
    }
  }
  return entities;
};

App.Map.prototype.updateEntityPosition = function(entity, oldX, oldY, oldZ) {
  // TODO: improve speed by not using strings for keys:
  if (typeof oldX !== 'undefined') {
    var oldKey = oldX +","+ oldY +","+ oldZ;
    if (this.entities[oldKey] == entity) {
      delete this.entities[oldKey];
    }
  }
  var e = entity;
  if (e.x<0 || e.x>=this.width || e.y<0 || e.y>=this.height || e.z<0 || e.z>=this.depth) {
    throw new Error("tried to add entity that is out of bounds", entity);
  }
  var key = e.x +","+ e.y +","+ e.z;
  if (this.entities[key]) {
    throw new Error("tried to add entity in occupied space");
  }
  this.entities[key] = entity;
}
