
var App = {
  width:     40,
  height:    20,
  display:   null,
  screen:    null,
  Screens:   {},
  Tiles:     {},
  Mixins:    {},
  Templates: {},

  init: function() {
    this.display = new ROT.Display({width:this.width, height:this.height+1});
    this.display.setOptions({width:App.width, fontSize:28, fontSytle:"bold", bg:"#fff"});
    document.body.appendChild(this.display.getContainer());
    window.onkeypress = function(e) {
      e = e || window.event;
      var code = e.which==0 ? e.keyCode : e.which;
      App.screen.handleInput(code);
    }
    this.createTiles();
    this.switchScreen(App.Screens.start);
  },

  refresh: function() {
    this.display.clear();
    this.screen.render(this.display);
  },

  createTiles: function() {
    this.Tiles.null       = new App.Tile();
    this.Tiles.wall       = new App.Tile({ch:'#', fg:'#444', isDiggable:true, blocksLight:true});
    this.Tiles.floor      = new App.Tile({ch:'.', fg:'#222', isWalkable:true, blocksLight:false});
    this.Tiles.stairsUp   = new App.Tile({ch:'<', fg:'#fff', isWalkable:true, blocksLight:false});
    this.Tiles.stairsDown = new App.Tile({ch:'>', fg:'#fff', isWalkable:true, blocksLight:false});
  },

  switchScreen: function(screen) {
    if (this.screen != null) { this.screen.exit(); }
    this.screen = screen;
    this.screen.enter();
    this.refresh();
  },

  sendMessage: function(receiver, message, args) {
    if (receiver.hasMixin("MessageReceiving")) {
      if (args) { message = vsprintf(message, args); }
      receiver.receiveMessage(message);
    }
  },

  sendMessageNear: function(map, x, y, z, message, args) {
    if (args) { message = vsprintf(message, args); }
    var entities = map.getEntitiesWithinRadius(x, y, z, 5);
    for (var i=0; i<entities.length; i++) {
      if (entities[i].hasMixin("MessageReceiving")) {
        this.sendMessage(entities[i], message);
      }
    }
  },

  getPositionsAround: function(x, y) {
    var positions = [];
    for (var dx=-1; dx<2; dx++) {
      for (var dy=-1; dy<2; dy++) {
        if (dx==0 && dy==0) { continue; }
        positions.push({x:x+dx, y:y+dy});
      }
    }
    return positions.randomize();
  },

  Glyph: function(properties) {
    properties = properties    || {};
    this.ch    = properties.ch || ' ';
    this.fg    = properties.fg || 'white';
    this.bg    = properties.bg || 'black';
  },

  KEY_UpArrow:    38,
  KEY_DownArrow:  40,
  KEY_LeftArrow:  37,
  KEY_RightArrow: 39,
  KEY_UpStairs:   60,
  KEY_DownStairs: 62,
  KEY_Space:      32,
  KEY_Enter:      13,
  KEY_Escape:     27

};
