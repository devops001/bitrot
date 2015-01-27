
App.Tile = function(properties) {
  properties = properties || {};
  App.Glyph.call(this, properties);
  this.isWalkable  = properties.isWalkable  || false;
  this.isDiggable  = properties.isDiggable  || false;
  this.blocksLight = properties.blocksLight || true;
};

App.Tile.extend(App.Glyph);
