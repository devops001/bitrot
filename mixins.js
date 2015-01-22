
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
  }
};

App.Mixins.Fungus = {
  name:  'Fungus',
  group: 'Acting',
  act: function() {
  }
};

//------------------------------
// Defending group:
//------------------------------

App.Mixins.Defender = {
  name:  'Defender',
  group: 'Defending',
  init:  function() {
    this.hp = 1;
  },
  takeDamage: function(attacker, amount) {
    this.hp -= amount;
    if (this.hp <= 0) {
      console.log(attacker.name +" killed "+ this.name);
      this.map.removeEntity(this);
    }
  }
};

//------------------------------
// Attacking group:
//------------------------------

App.Mixins.Attacker = {
  name:  'Attacker',
  group: 'Attacking',
  attack: function(target) {
    if (target.hasMixin('Defending')) {
      target.takeDamage(this, 1);
    }
  }
};
