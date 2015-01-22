
App.Entity = function(properties) {
  properties = properties || {};
  App.Glyph.call(this, properties);
  this.name   = properties.name   || '';
  this.x      = properties.x      || 0;
  this.y      = properties.y      || 0;
  this.map    = null;
  this.mixins = {};
  this.groups = {};

  var mixins = properties.mixins || [];
  for (var i=0; i<mixins.length; i++) {
    for (var key in mixins[i]) {
      if (key!='init' && key!='name' && key!='group' && !this.hasOwnProperty(key)) {
        this[key] = mixins[i][key];
      }
    }
    this.mixins[mixins[i].name]  = true;
    this.groups[mixins[i].group] = true;
    if (mixins[i].init) {
      mixins[i].init.call(this, properties);
    }
  }
};

App.Entity.extend(App.Glyph);

App.Entity.prototype.hasMixin = function(mixin) {
  if (typeof mixin === 'object') {
    return this.mixins[mixin.name] || this.groups[mixin.name];
  } else {
    return this.mixins[mixin] || this.groups[mixin];
  }
}

