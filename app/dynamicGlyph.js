
// App.Glyph + name & mixins:
App.DynamicGlyph = function(properties) {
  properties = properties || {};
  App.Glyph.call(this, properties);   //<- sets ch, fg, bg
  this.name        = properties.name || '';
  this.mixins      = {};
  this.mixinGroups = {};
  var mixins = properties.mixins || [];
  for (var i=0; i<mixins.length; i++) {
    for (var key in mixins[i]) {
      if (key!='init' && key!='name' && !this.hasOwnProperty(key)) {
        this[key] = mixins[i][key];
      }
    }
    this.mixins[mixins[i].name]       = true;
    this.mixinGroups[mixins[i].group] = true;
    if (mixins[i].init) {
      mixins[i].init.call(this, properties);
    }
  }
};

App.DynamicGlyph.extend(App.Glyph);

App.DynamicGlyph.prototype.hasMixin = function(mixin) {
  if (typeof mixin === 'object') {
    return this.mixins[mixin.name] || this.mixinGroups[mixin.name];
  } else {
    return this.mixins[mixin] || this.mixinGroups[mixin];
  }
};

App.DynamicGlyph.prototype.describe = function() {
  return this.name;
};

App.DynamicGlyph.prototype.describeOne = function(shouldCapitalize) {
  var prefixes = shouldCapitalize ? ['A','An'] : ['a','an'];
  var desc     = this.describe();
  var first    = desc.charAt(0).toLowerCase();
  var prefix   = 'aeiou'.indexOf(first)<0 ? prefixes[0] : prefixes[1];
  return prefix +" "+ desc;
};
