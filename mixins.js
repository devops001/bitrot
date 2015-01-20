
//------------------------------
// Moveable group:
//------------------------------

App.Mixins.Moveable = {
  name:  'Moveable',
  group: 'Moveable',
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

