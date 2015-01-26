
App.Builder = function(width, height, depth) {
  this.width   = width;
  this.height  = height;
  this.depth   = depth;
  this.tiles   = new Array(depth);
  this.regions = new Array(depth);
  // generate one level per depth/z:
  for (var z=0; z<depth; z++) {
    this.tiles[z]   = this.generateLevel();
    this.regions[z] = new Array(width);
    for (var x=0; x<width; x++) {
      this.regions[z][x] = new Array(height);
      for (var y=0; y<height; y++) {
        this.regions[z][x][y] = 0;
      }
    }
  }
  // assign regions to groups each depth level:
  for (var z=0; z<depth; z++) {
    this.setupRegions(z);
  }
  // connect regions on different levels with stairs:
  this.connectAllRegions();
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

App.Builder.prototype.removeRegion = function(region, z) {
  for (var x=0; x<this.width; x++) {
    for (var y=0; y<this.height; y++) {
      if (this.regions[z][x][y] == region) {
        this.regions[z][x][y] = 0;
        this.tiles[z][x][y]   = App.Tiles.wall;
      }
    }
  }
};

App.Builder.prototype.setupRegions = function(z) {
  var minimumRegionSize = 20;
  var region = 1;
  var tilesFilled;
  for (var x=0; x<this.width; x++) {
    for (var y=0; y<this.height; y++) {
      if (this.canFillRegion(x,y,z)) {
        tilesFilled = this.fillRegion(region, x, y, z);
        if (tilesFilled < minimumRegionSize) {
          this.removeRegion(region, z);
        } else {
          region++;
        }
      }
    }
  }
};

App.Builder.prototype.findOverlappingRegions = function(z, region1, region2) {
  var matches = [];
  for (var x=0; x<this.width; x++) {
    for (var y=0; y<this.height; y++) {
      if (this.tiles[z][x][y]     == App.Tiles.floor &&
          this.tiles[z+1][x][y]   == App.Tiles.floor &&
          this.regions[z][x][y]   == region1         &&
          this.regions[z+1][x][y] == region2) {
        matches.push({x:x, y:y});
      }
    }
  }
  return matches.randomize();
};

App.Builder.prototype.connectRegions = function(z, region1, region2) {
  var overlap = this.findOverlappingRegions(z, region1, region2);
  if (overlap.length == 0) {
    return false;
  }
  var pos = overlap[0];
  this.tiles[z][pos.x][pos.y]  = App.Tiles.stairsDown;
  this.tiles[z+1][pos.x][pos.y] = App.Tiles.stairsUp;
  return true;
};

App.Builder.prototype.connectAllRegions = function() {
  for (var z=0; z<this.depth-1; z++) {
    var connected = {};
    var key;
    for (var x=0; x<this.width; x++) {
      for (var y=0; y<this.height; y++) {
        key = this.regions[z][x][y] +","+ this.regions[z+1][x][y];
        if (this.tiles[z][x][y]==App.Tiles.floor && this.tiles[z+1][x][y]==App.Tiles.floor && !connected[key]) {
          this.connectRegions(z, this.regions[z][x][y], this.regions[z+1][x][y]);
          connected[key] = true;
        }
      }
    }
  }
};
