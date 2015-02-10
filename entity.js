
App.Entity = function(properties) {
  properties = properties || {};
  App.DynamicGlyph.call(this, properties);
  this.x      = properties.x      || 0;
  this.y      = properties.y      || 0;
  this.z      = properties.z      || 0;
  this.map    = null;
};

App.Entity.extend(App.DynamicGlyph);

App.Entity.prototype.setPosition = function(x, y, z) {
  var oldX = this.x;
  var oldY = this.y;
  var oldZ = this.z;
  this.x = x;
  this.y = y;
  this.z = z;
  if (this.map) {
    this.map.updateEntityPosition(this, oldX, oldY, oldZ);
  }
};
