
App.Tile = function(properties) {
  properties = properties || {};
  App.Glyph.call(this, properties);
  this.isWalkable = properties.isWalkable || false;
  this.isDiggable = properties.isDiggable || false;
};

App.Tile.extend(App.Glyph);


