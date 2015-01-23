
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
    window.addEventListener('keydown', function(e) { App.screen.handleInput(e.keyCode); });
    this.createTiles();
    this.switchScreen(App.Screens.start);
  },

  refresh: function() {
    this.display.clear();
    this.screen.render(this.display);
  },

  createTiles: function() {
    this.Tiles.null       = new App.Tile();
    this.Tiles.floor      = new App.Tile({ch:'.', fg:'#222', isWalkable:true});
    this.Tiles.wall       = new App.Tile({ch:'#', fg:'#444', isDiggable:true});
    this.Tiles.stairsUp   = new App.Tile({ch:'<', fg:'#fff', isWalkable:true});
    this.Tiles.stairsDown = new App.Tile({ch:'>', fg:'#fff', isWalkable:true});
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

  sendMessageNear: function(map, x, y, message, args) {
    if (args) { message = vsprintf(message, args); }
    var entities = map.getEntitiesWithinRadius(x, y, 5);
    for (var i=0; i<entities.length; i++) {
      if (entities[i].hasMixin("MessageReceiving")) {
        this.sendMessage(entities[i], message);
      }
    }
  },

  Glyph: function(properties) {
    properties = properties    || {};
    this.ch    = properties.ch || ' ';
    this.fg    = properties.fg || 'white';
    this.bg    = properties.bg || 'black';
  }

};
