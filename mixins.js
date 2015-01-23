
//------------------------------
// Moving group:
//------------------------------

App.Mixins.Walker = {
  name:  'Walker',
  group: 'Moving',
  tryMove: function(x, y, map) {
    if (map.isOpen(x,y)) {
      this.x = x;
      this.y = y;
      return true;
    } else {
      var target = map.getEntityAt(x,y);
      if (target && target.hasMixin('Defending') && this.hasMixin('Attacking')) {
        this.attack(target);
        return true;
      }
    }
    return false;
  }
};

App.Mixins.Digger = {
  name:  'Digger',
  group: 'Moving',
  tryMove: function(x, y, map) {
    if (App.Mixins.Walker.tryMove.call(this, x, y, map)) {
      return true;
    } else if (map.getTile(x,y).isDiggable) {
      map.dig(x, y);
      return true;
    }
    return false;
  }
};

//------------------------------
// Acting group:
//------------------------------

App.Mixins.Player = {
  name:  'Player',
  group: 'Acting',
  act: function() {
    App.refresh();
    App.Screens.play.map.engine.lock();
    this.clearMessages();
  }
};

App.Mixins.Fungus = {
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
        if (this.map.isOpen(this.x+dx, this.y+dy)) {
          var spawn = new App.Entity(App.Templates.fungus);
          spawn.x = this.x+dx;
          spawn.y = this.y+dy;
          this.map.addEntity(spawn);
          this.spawnsLeft--;
          App.sendMessageNear(this.map, this.x, this.y, "The fungus is spreading!");
        }
      }
    }
  }
};

//------------------------------
// Defending group:
//------------------------------

App.Mixins.Defender = {
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
      if (this.name == "player") {
        App.switchScreen(App.Screens.lose);
      } else {
        this.map.removeEntity(this);
      }
    }
  }
};

App.Mixins.PoisonousDefender = {
  name:  'PoisonousDefender',
  group: 'Defending',
  init:  function(template) {
    App.Mixins.Defender.init.call(this, template);
    this.poisonStrength = 10;
  },
  takeDamage: function(attacker, amount) {
    App.Mixins.Defender.takeDamage.call(this, attacker, amount);
    if (attacker.hasMixin("Defending") && !attacker.hasMixin("PoisonousDefender")) {
      attacker.takeDamage(this, this.poisonStrength);
    }
  }
};

//------------------------------
// Attacking group:
//------------------------------

App.Mixins.Attacker = {
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
// MessageReceiving group:
//------------------------------

App.Mixins.MessageReceiver = {
  name:  'MessageReceiver',
  group: 'MessageReceiving',
  init:  function(template) {
    this.messages = [];
  },
  receiveMessage: function(message) {
    this.messages.push(message);
  },
  clearMessages: function() {
    this.messages = [];
  }
}
