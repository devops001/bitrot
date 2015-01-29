
//------------------------------
// Moving group:
//------------------------------
App.Mixins.Moving = {};

App.Mixins.Moving.Walker = {
  name:  'Walker',
  group: 'Moving',
  tryMove: function(x, y, z, map) {
    var currentTile = map.getTile(this.x,this.y,this.z);
    var target      = map.getEntityAt(x,y,z);

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
      return true;
    } else {
      return false;
    }

  }
};

App.Mixins.Moving.Digger = {
  name:  'Digger',
  group: 'Moving',
  tryMove: function(x, y, z, map) {
    if (App.Mixins.Moving.Walker.tryMove.call(this, x, y, z, map)) {
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
App.Mixins.Acting = {};

App.Mixins.Acting.Player = {
  name:  'Player',
  group: 'Acting',
  act: function() {
    App.refresh();
    App.Screens.play.map.engine.lock();
    this.clearMessages();
  }
};

App.Mixins.Acting.Fungus = {
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

App.Mixins.Acting.Wanderer = {
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
App.Mixins.Defending = {};

App.Mixins.Defending.Defender = {
  name:  'Defender',
  group: 'Defending',
  init:  function(template) {
    this.maxHP   = template.maxHP   || 10;
    this.hp      = template.hp      || this.maxHP;
    this.defense = template.defense || 0;
  },
  takeDamage: function(attacker, amount) {
    this.hp -= amount;
    App.sendMessage(this, "You took %d damage from %s", [amount, attacker.name]);
    if (this.hp <= 0) {
      App.sendMessage(attacker, "You killed %s", [this.name]);
      App.sendMessage(this, "You died!");
      if (this.hasMixin('Player')) {
        App.switchScreen(App.Screens.lose);
      } else {
        this.map.removeEntity(this);
      }
    }
  }
};

App.Mixins.Defending.Poisonous = {
  name:  'Poisonous',
  group: 'Defending',
  init:  function(template) {
    App.Mixins.Defending.Defender.init.call(this, template);
    this.poisonStrength = 10;
  },
  takeDamage: function(attacker, amount) {
    App.Mixins.Defending.Defender.takeDamage.call(this, attacker, amount);
    if (attacker.hasMixin("Defending")) {
      attacker.takeDamage(this, this.poisonStrength);
    }
  }
};

//------------------------------
// Attacking group:
//------------------------------
App.Mixins.Attacking = {};

App.Mixins.Attacking.Attacker = {
  name:  'Attacker',
  group: 'Attacking',
  init:   function(template) {
    this.attackPower = template.attackPower || 1;
  },
  attack: function(target) {
    if (target.hasMixin('Defending')) {
      var power  = Math.max(0, this.attackPower - target.defense);
      var damage = 1 + Math.floor(Math.random() * power);
      App.sendMessage(this, "You hit %s for %d damage", [target.name, damage]);
      target.takeDamage(this, damage);
    }
  }
};

//------------------------------
// Messaging group:
//------------------------------

App.Mixins.Messaging = {};

App.Mixins.Messaging.Receiver = {
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
App.Mixins.Seeing = {};

App.Mixins.Seeing.Sight = {
  name:  'Sight',
  group: 'Seeing',
  init: function(template) {
    this.sightRadius = template.sightRadius || 5;
  }
};

//------------------------------
// Inventory group:
//------------------------------
App.Mixins.Inventory = {};

App.Mixins.Inventory.Carrier = {
  name:  'Carrier',
  group: 'Inventory',
  init: function(template) {
    var slots  = template.inventorySlots || 10;
    this.items = new Array(slots);
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
    var count = 0;
    for (var i=0; i<this.items.length; i++) {
      if (!this.items[i]) count++;
    }
    return count;
  },
  canAddItem: function() {
    return this.numEmptySlots().length>0;
  },
  pickupItems: function(indices) {
    var items    = this.map.getItemsAt(this.x, this.y, this.z);
    var leftOver = [];
    for (var i=0; i<indices.length; i++) {
      var item = items[indices[i]];
      if (!this.addItem(item)) {
        leftOver.push(item);
      }
    }
    this.map.setItemsAt(this.x, this.y, this.z, leftOver);
    return leftOver.length==0;
  },
  dropItem: function(index) {
    var item = this.getItem(index);
    if (item) {
      if (this.map) {
        this.map.addItem(this.x, this.y, this.z, item);
      }
      this.removeItem(index);
    }
  }
};
