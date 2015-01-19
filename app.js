
var App = {

  width:   80,
  height:  24,
  display: null,
  screen:  null,
  Screens: {},
  Tiles:   {},

  init: function() {
    this.display = new ROT.Display({width:this.width, height:this.height});
    document.body.appendChild(this.display.getContainer());
    window.addEventListener('keydown', function(e) { App.screen.handleInput(e.keyCode); });
    this.createTiles();
    this.switchScreen(App.Screens.start);
  },

  createTiles: function() {
    this.Tiles.null  = new App.Tile(new App.Glyph());
    this.Tiles.floor = new App.Tile(new App.Glyph('.'));
    this.Tiles.wall  = new App.Tile(new App.Glyph('#', 'goldenrod'));
  },

  switchScreen: function(screen) {
    if (this.screen != null) { this.screen.exit(); }
    this.display.clear();
    this.screen = screen;
    this.screen.enter();
    this.screen.render(this.display);
  },

  Glyph: function(ch, fg, bg) {
    this.ch = ch || ' ';
    this.fg = fg || 'white';
    this.bg = bg || 'black';
  },

  Tile: function(glyph) {
    this.glyph = glyph;
  }

};

