
//------------------------------
// Moving group:
//------------------------------

App.Mixins.Digger = {
  name:  'Digger',
  group: 'Moving',
  tryMove: function(x, y, map) {
    var tile = map.getTile(x,y);
    if (tile.isWalkable) {
      this.x = x;
      this.y = y;
      return true;
    } else if (tile.isDiggable) {
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

