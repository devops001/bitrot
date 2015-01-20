
App.Map = function(tiles) {
  this.tiles     = tiles;
  this.width     = tiles.length;
  this.height    = tiles[0].length;
  this.entities  = [];
  this.scheduler = new ROT.Scheduler.Simple();
  this.engine    = new ROT.Engine(this.scheduler);
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
  } while (this.getTile(x,y) != App.Tiles.floor);
  return {x:x, y:y};
};

App.Map.prototype.getEntityAt(x, y) {
  for (var i=0; i<this.entities.length; i++) {
    var entity = this.entities[i];
    if (entity.x==x && entity.y==y) {
      return entity;
    }
  }
  return null;
};

