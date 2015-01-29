
App.Item = function(properties) {
  properties = properties || {};
  App.Glyph.call(this, properties);
  this.name = properties.name || '';
};

App.Item.extend(App.Glyph);
