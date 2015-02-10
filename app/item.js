
App.Item = function(properties) {
  properties = properties || {};
  App.Glyph.call(this, properties);
  this.name = properties.name || '';
};

App.Item.prototype.describe = function() {
  return this.name;
};

App.Item.prototype.describeOne = function(shouldCapitalize) {
  var prefixes = shouldCapitalize ? ['A','An'] : ['a','an'];
  var desc     = this.describe();
  var first    = desc.charAt(0).toLowerCase();
  var prefix   = 'aeiou'.indexOf(first)<0 ? prefixes[0] : prefixes[1];
  return prefix +" "+ desc;
};
