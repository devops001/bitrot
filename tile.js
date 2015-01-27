
App.Tile = function(properties) {
  p = properties || {};
  App.Glyph.call(this, p);
  this.isWalkable  = (p.isWalkable===undefined)  ? false : p.isWalkable;
  this.isDiggable  = (p.isDiggable===undefined)  ? false : p.isDiggable;
  this.blocksLight = (p.blocksLight===undefined) ? true  : p.blocksLight;
};

App.Tile.extend(App.Glyph);
