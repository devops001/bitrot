
App.Entity = function(properties) {
  properties = properties || {};
  App.Glyph.call(this, properties);
  this.name   = properties.name   || '';
  this.x      = properties.x      || 0;
  this.y      = properties.y      || 0;
  this.z      = properties.z      || 0;
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
};

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

//------------------------------
// Repository:
//------------------------------

App.EntityRepository = new App.Repository('entities', App.Entity);

App.EntityRepository.define('fungus', {
  name:    'fungus',
  ch:      'F',
  fg:      '#0f0',
  maxHP:   15,
  defense: 0,
  mixins: [ App.Mixins.Acting.Fungus, App.Mixins.Defending.Defender ]
});

App.EntityRepository.define("poisonousFungus", {
  name:    'poisonousFungus',
  ch:      'F',
  fg:      '#0f0',
  bg:      '#200',
  maxHP:   15,
  defense: 0,
  mixins: [ App.Mixins.Acting.Fungus, App.Mixins.Defending.Poisonous ]
});

App.EntityRepository.define("bat", {
  name:       'bat',
  ch:         'b',
  fg:         '#faa',
  maxHP:       5,
  attackPower: 5,
  defense:     5,
  mixins: [
    App.Mixins.Acting.Wanderer, App.Mixins.Moving.Walker,
    App.Mixins.Defending.Defender, App.Mixins.Attacking.Attacker
  ]
});

App.EntityRepository.define("newt", {
  name:        'newt',
  ch:          'n',
  fg:          '#faf',
  maxHP:       5,
  attackPower: 4,
  defense:     6,
  mixins: [
    App.Mixins.Acting.Wanderer, App.Mixins.Moving.Walker,
    App.Mixins.Defending.Defender, App.Mixins.Attacking.Attacker
  ]
});

App.EntityRepository.define("poisonousMole", {
  name:       'poisonousMole',
  ch:         'm',
  fg:         '#afa',
  maxHP:       10,
  attackPower: 5,
  defense:     1,
  mixins: [
    App.Mixins.Acting.Wanderer, App.Mixins.Moving.Digger,
    App.Mixins.Defending.Poisonous, App.Mixins.Attacking.Attacker
  ]
});
