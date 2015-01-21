
//------------------------------
// Moving group:
//------------------------------

App.Mixins.Walker = {
  name:  'Walker',
  group: 'Moving',
  tryMove: function(x, y, map) {
    console.log("in Walker.tryMove");
    var tile = map.getTile(x,y);
    if (tile.isWalkable) {
      this.x = x;
      this.y = y;
      return true;
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
    App.engine.lock(); 
  }
};

App.Mixins.Fungus = {
  name:  'Fungus',
  group: 'Acting',
  act: function() {}
};

