
App.Map = function(tiles) {
  this.tiles  = tiles;
  this.width  = tiles.length;
  this.height = tiles[0].length;
};

App.Map.prototype.getTile = function(x, y) {
  if (x<0 || x>=this.width || y<0 || y>=this.height) {
    return App.Tiles.null;
  }
  return this.tiles[x][y] || App.Tiles.null;
};

