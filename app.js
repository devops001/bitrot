

var App = {

  display: null,
  screen:  null,

  init: function() {
    this.display = new ROT.Display({width:80, height:24});
    document.body.appendChild(this.display.getContainer());
    this._initEventHandlers();
    this.screen = App.Screens.start;
    this.screen.enter();
    this.draw();
  },

  draw: function() {
    this.screen.render(this.display); 
  },

  switchScreen: function(screen) {
    if (this.screen != null) { this.screen.exit(); }
    this.display.clear();
    this.screen = screen;
    this.screen.enter();
    this.screen.render(this.display);
  },

  _initEventHandlers: function() {
    window.addEventListener('keydown', function(e) {
      App.screen.handleInput(e.keyCode);
    });
  }

};

