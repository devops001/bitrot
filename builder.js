
App.Builder = function(width, height, depth) {
  this.width   = width;
  this.height  = height;
  this.depth   = depth;
  this.tiles   = new Array(depth);
  this.regions = new Array(depth);

  for (var z=0; z<depth; z++) {
    this.tiles[z]   = this.generateLevel();
    this.regions[z] = new Array(width);
    for (var x=0; x<width; x++) {
      this.regions[z][x] = new Array(height);
      for (var y=0; y<height; y++) {
        this.regionx[z][x][y] = 0;
      }
    }
  }
};

App.Builder.prototype.generateLevel = function(iterations) {
  iterations = iterations || 3;
  var map    = new Array(this.width);
  for (var x=0; x<this.width; x++) {
    map[x] = new Array(this.height);
  }
  var generator = new ROT.Map.Cellular(this.width, this.height);
  generator.randomize(0.5);
  for (var i=0; i<iterations-1; i++) {
    generator.create();
  }
  generator.create(function(x,y,v) {
    map[x][y] = v===1 ? App.Tiles.floor : App.Tiles.wall;
  });
  return map;
};

App.Builder.prototype.canFillRegion = function(x, y, z) {
  if (x<0 || y<0 || z<0 || x>=this.width || y>=this.height || z>=this.depth) {
    return false;   //<- out of bounds
  }
  if (this.regions[z][x][y] != 0) {
    return false;   //<- already has a region
  }
  return this.tiles[z][x][y].isWalkable;
};

App.Builder.prototype.fillRegion = function(region, x, y, z) {
  var tiles = [{x:x, y:y}];
  var tile, neighbors;
  var tilesFilled = 1;
  this.regions[z][x][y] = region;
  while (tiles.length > 0) {
    tile      = tiles.pop();
    neighbors = App.getPositionsAround(x, y);
  }
  while (neighbors.length > 0) {
    tile = neighbors.pop();
    if (this.canFillRegion(tile.x, tile.y, z)) {
      this.regions[z][tile.x][tile.y] = region;
      tiles.push(tile);
      tilesFilled++;
    }
  }
  return tiles;
};
