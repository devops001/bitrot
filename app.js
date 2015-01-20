
var App = {
  width:     80,
  height:    24,
  display:   null,
  screen:    null,
  Screens:   {},
  Tiles:     {},
  Mixins:    {},
  Templates: {},

  init: function() {
    this.display = new ROT.Display({width:this.width, height:this.height});
    document.body.appendChild(this.display.getContainer());
    window.addEventListener('keydown', function(e) { 
      if (App.screen.handleInput(e.keyCode)) {
        App.display.clear();
        App.screen.render(App.display);
      }
    });
    this.createTiles();
    this.switchScreen(App.Screens.start);
  },

  createTiles: function() {
    this.Tiles.null  = new App.Tile();
    this.Tiles.floor = new App.Tile({ch:'.', isWalkable:true});
    this.Tiles.wall  = new App.Tile({ch:'#', fg:'goldenrod', isDiggable:true});
  },

  switchScreen: function(screen) {
    if (this.screen != null) { this.screen.exit(); }
    this.display.clear();
    this.screen = screen;
    this.screen.enter();
    this.screen.render(this.display);
  },

  Glyph: function(properties) {
    properties = properties    || {};
    this.ch    = properties.ch || ' ';
    this.fg    = properties.fg || 'white';
    this.bg    = properties.bg || 'black';
  }

};

