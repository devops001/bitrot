
//------------------------------
// Moving group:
//------------------------------
App.EntityMixins.Moving = {};

App.EntityMixins.Moving.Walker = {
  name:  'Walker',
  group: 'Moving',
  tryMove: function(x, y, z, map) {
    var currentTile    = map.getTile(this.x,this.y,this.z);
    var target         = map.getEntityAt(x,y,z);

    // attacking?
    if (target) {
      var playerInvolved = this.hasMixin('Player') || target.hasMixin('Player');
      if (!playerInvolved) {
        return false;
      }
      if (target.hasMixin('Defending') && this.hasMixin('Attacking')) {
        this.attack(target);
        return true;
      } else {
        App.sendMessage(this, "something is blocking that space that can't be attacked");
        return false;
      }
    }
    // going up?
    if (z < this.z) {
      if (currentTile == App.Tiles.stairsUp) {
        App.sendMessage(this, "You ascend to level %d", [z+1]);
        this.setPosition(x,y,z);
        return true;
      } else {
        App.sendMessage(this, "You can't go up there!");
        return false;
      }
    }
    // going down?
    if (z > this.z) {
      if (currentTile == App.Tiles.stairsDown) {
        App.sendMessage(this, "You descend to level %d", [z+1]);
        this.setPosition(x,y,z);
        return true;
      } else {
        App.sendMessage(this, "You can't go down there!");
        return false;
      }
    }
    // moving on same level:
    if (map.isOpen(x,y,z)) {
      this.setPosition(x,y,z);
      var items = map.getItemsAt(x,y,z);
      if (items) {
        if (items.length == 1) {
          App.sendMessage(this, "You see %s", [items[0].describeOne()]);
        } else if (items.length > 0) {
          App.sendMessage(this, "You see several items here");
        }
      }
      return true;
    } else {
      return false;
    }

  }
};

App.EntityMixins.Moving.Digger = {
  name:  'Digger',
  group: 'Moving',
  tryMove: function(x, y, z, map) {
    if (App.EntityMixins.Moving.Walker.tryMove.call(this, x, y, z, map)) {
      return true;
    } else if (map.getTile(x,y,z).isDiggable) {
      map.dig(x,y,z);
      return true;
    }
    return false;
  }
};

//------------------------------
// Acting group:
//------------------------------
App.EntityMixins.Acting = {};

App.EntityMixins.Acting.Player = {
  name:  'Player',
  group: 'Acting',
  act: function() {
    if (this.hasMixin('Eating')) {
      this.tickHunger();
    }
    App.refresh();
    App.Screens.play.map.engine.lock();
    this.clearMessages();
  }
};

App.EntityMixins.Acting.Fungus = {
  name:  'Fungus',
  group: 'Acting',
  init: function() {
    this.spawnsLeft = 5;
  },
  act: function() {
    if (this.spawnsLeft > 0) {
      if (Math.random() <= 0.02) {
        // dx,dy are in range: [-1, 0, 1]
        var dx = Math.floor(Math.random()*3)-1;
        var dy = Math.floor(Math.random()*3)-1;
        if (this.map.isOpen(this.x+dx, this.y+dy, this.z)) {
          var type  = Math.random()>0.5 ? 'fungus' : 'poisonousFungus';
          var spawn = App.EntityRepository.create(type);
          spawn.setPosition(this.x+dx, this.y+dy, this.z);
          this.map.addEntity(spawn);
          this.spawnsLeft--;
          App.sendMessageNear(this.map, this.x, this.y, this.z, "The fungus is spreading!");
          // stop most spwans from spawning more or the level will completely fill:
          if (Math.random() > 0.25) { spawn.spawnsLeft = 0; }
        }
      }
    }
  }
};

App.EntityMixins.Acting.Wanderer = {
  name: 'Wanderer',
  group: 'Acting',
  act: function() {
    var dir = (Math.round(Math.random())===1) ? 1 : -1;
    if (Math.round(Math.random())===1) {
      this.tryMove(this.x+dir, this.y, this.z, this.map);
    } else {
      this.tryMove(this.x, this.y+dir, this.z, this.map);
    }
  }
}

//------------------------------
// Defending group:
//------------------------------
App.EntityMixins.Defending = {};

App.EntityMixins.Defending.Defender = {
  name:  'Defender',
  group: 'Defending',
  init:  function(template) {
    this.maxHP    = template.maxHP   || 10;
    this.hp       = template.hp      || this.maxHP;
    this._defense = template.defense || 0;
  },
  takeDamage: function(attacker, amount) {
    this.hp -= amount;
    App.sendMessage(this, "You took %d damage from %s", [amount, attacker.name]);
    if (this.hp <= 0) {
      App.sendMessage(attacker, "You killed the %s", [this.name]);
      if (this.hasMixin("CorpseDropper")) {
        this.dropCorpse();
      }
      this.kill();
    }
  },
  getDefense: function() {
    var modifier = 0;
    if (this.hasMixin("Equipping")) {
      modifier += this.weapon ? this.weapon.defendValue : 0;
      modifier += this.armor  ? this.armor.defendValue  : 0;
    }
    return this._defense + modifier;
  }
};

App.EntityMixins.Defending.Poisonous = {
  name:  'Poisonous',
  group: 'Defending',
  init:  function(template) {
    App.EntityMixins.Defending.Defender.init.call(this, template);
    this.poisonStrength = 10;
  },
  takeDamage: function(attacker, amount) {
    App.EntityMixins.Defending.Defender.takeDamage.call(this, attacker, amount);
    if (attacker.hasMixin("Defending")) {
      attacker.takeDamage(this, this.poisonStrength);
    }
  },
  getDefense: function() {
    return App.EntityMixins.Defending.Defender.getDefense.call(this);
  }
};

//------------------------------
// Attacking group:
//------------------------------
App.EntityMixins.Attacking = {};

App.EntityMixins.Attacking.Attacker = {
  name:  'Attacker',
  group: 'Attacking',
  init:   function(template) {
    this._attackPower = template.attackPower || 1;
  },
  attack: function(target) {
    if (target.hasMixin('Defending')) {
      var power  = Math.max(0, this.getAttackPower() - target.getDefense());
      var damage = 1 + Math.floor(Math.random() * power);
      App.sendMessage(this, "You hit %s for %d damage", [target.name, damage]);
      target.takeDamage(this, damage);
    }
  },
  getAttackPower: function() {
    var modifier = 0;
    if (this.hasMixin("Equipping")) {
      modifier += this.weapon ? this.weapon.attackValue : 0;
      modifier += this.armor  ? this.armor.attackValue  : 0;
    }
    return this._attackPower + modifier;
  }
};

//------------------------------
// Messaging group:
//------------------------------
App.EntityMixins.Messaging = {};

App.EntityMixins.Messaging.Receiver = {
  name:  'Receiver',
  group: 'Messaging',
  init:  function(template) {
    this.messages = [];
  },
  receiveMessage: function(message) {
    this.messages.push(message);
  },
  clearMessages: function() {
    this.messages = [];
  }
};

//------------------------------
// Seeing group:
//------------------------------
App.EntityMixins.Seeing = {};

App.EntityMixins.Seeing.Sight = {
  name:  'Sight',
  group: 'Seeing',
  init: function(template) {
    this.sightRadius = template.sightRadius || 5;
  }
};

//------------------------------
// Inventory group:
//------------------------------
App.EntityMixins.Inventory = {};

App.EntityMixins.Inventory.Carrier = {
  name:  'Carrier',
  group: 'Inventory',
  init: function(template) {
    var slots  = template.inventorySlots || 10;
    this.items = new Array(slots);
  },
  hasItems: function() {
    var empty = this.numEmptySlots();
    var leng  = this.items.length;
    return this.numEmptySlots()!=this.items.length;
  },
  getItems: function() {
    return this.items;
  },
  getItem: function(i) {
    return this.items[i];
  },
  addItem: function(item) {
    for (var i=0; i<this.items.length; i++) {
      if (!this.items[i]) {
        this.items[i] = item;
        return true;
      }
    }
    return false;
  },
  removeItem: function(index) {
    this.items[index] = null;
  },
  numEmptySlots: function() {
    var count = this.items.length;
    for (var i=0; i<this.items.length; i++) {
      if (this.items[i]) count--;
    }
    return count;
  },
  canAddItem: function() {
    return this.numEmptySlots().length>0;
  },
  pickupItems: function(indices) {
    var items     = this.map.getItemsAt(this.x, this.y, this.z);
    var leftOver  = [];
    var isTooFull = false;
    for (var i=0; i<items.length; i++) {
      var item = items[i];
      if (indices.indexOf(i)>-1) {
        if (!this.addItem(item)) {
          leftOver.push(item);
          isTooFull = true;
        }
      } else {
        leftOver.push(item);
      }
    }
    this.map.setItemsAt(this.x, this.y, this.z, leftOver);
    return !isTooFull;
  },
  dropItem: function(index) {
    var item = this.getItem(index);
    if (item) {
      if (this.map) {
        this.map.addItem(this.x, this.y, this.z, item);
      }
      this.removeItem(index);
    }
  },
  dropItems: function(indices) {
    for (var i=0; i<indices.length; i++) {
      this.dropItem(indices[i]);
    }
  }
};

//------------------------------
// Eating group:
//------------------------------
App.EntityMixins.Eating = {};

App.EntityMixins.Eating.Eater = {
  name:  'Eater',
  group: 'Eating',
  init: function(template) {
    this.maxFullness = template.maxFullness || 1000;
    this.fullness    = template.fullness    || (this.maxFullness/2);
    this.hungerRate  = template.hungerRate  || 1;
  },
  tickHunger: function() {
    this.modifyFullness(-this.hungerRate);
  },
  modifyFullness: function(amount) {
    this.fullness += amount;
    if (this.fullness < 0) {
      this.kill("You have starved to death!");
    } else if (this.fullness > this.maxFullness) {
      this.kill("You choked and died while overeating!")
    }
  },
  getHungerDescription: function() {
    var perPercent = this.maxFullness / 100;
    if (this.fullness <= perPercent * 5) {
      return "%c{red}%b{black}Starving";
    } else if (this.fullness <= perPercent * 25) {
      return "%c{white}%b{black}Hungry";
    } else if (this.fullness >= perPercent * 95) {
      return "%c{red}%b{black}Dangerously Full";
    } else if (this.fullness >= perPercent * 75) {
      return "%c{gray}%b{black}Full";
    } else {
      return "%c{gray}%b{black}Not Hungry";
    }
  }
};

//------------------------------
// CorpseDropping group:
//------------------------------
App.EntityMixins.CorpseDropping = {};

App.EntityMixins.CorpseDropping.CorpseDropper = {
  name:  'CorpseDropper',
  group: 'Dropping',
  init: function(template) {
    this.corpseDropRate = template.corpseDropRate || 100;
  },
  dropCorpse: function() {
    if (Math.round(Math.random()*100) < this.corpseDropRate) {
      var corpse = App.ItemRepository.create('corpse', {name:this.name+" corpse"});
      this.map.addItem(this.x, this.y, this.z, corpse);
    }
  }
}

//------------------------------
// Equipping group:
//------------------------------
App.EntityMixins.Equipping = {};

App.EntityMixins.Equipping.Equipper = {
  name:  'Equipper',
  group: 'Equipping',
  init: function(template) {
    this.weapon = null;
    this.armor  = null;
  },
  wield: function(item) {
    this.weapon = item;
  },
  unwield: function(item) {
    this.weapon = null;
  },
  wear: function(item) {
    this.armor = item;
  },
  takeOff: function(item) {
    this.armor = null;
  },
  unequip: function(item) {
    if (this.armor == item) {
      this.takeOff(item);
    }
    if (this.weapon == item) {
      this.unwield(item);
    }
  }
};
