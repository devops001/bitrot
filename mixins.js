
//------------------------------
// Moveable:
//------------------------------

App.Mixins.Moveable = {
  name: 'Moveable',
  tryMove: function(x, y, map) {
    var tile = map.getTile(x,y);
    if (tile.isWalkable) {
      this.x = x;
      this.y = y;
    } else if (tile.isDiggable) {
      map.dig(x, y);
      return true;
    }
    return false;
  }
};

