
App.Item = function(properties) {
  properties = properties || {};
  App.DynamicGlyph.call(this, properties);
};

App.Item.extend(App.DynamicGlyph);
