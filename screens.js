
//-----------------------------
// play:
//-----------------------------

App.Screens.play = {
  map: null, 

  enter: function() {
    console.log("entered Screen.play");
    var tiles = [];
    for (var x=0; x<App.width; x++) {
      tiles.push([]);
      for (var y=0; y<App.height; y++) {
        tiles[x].push(App.Tile.null);
      }
    }
    var generator = new ROT.Map.Cellular(App.width, App.height);
    generator.randomize(0.5);
    var iterations = 3;   //<- more = smoother
    for (var i=0; i<iterations-1; i++) { generator.create(); }
    generator.create(function(x, y, value) {
      tiles[x][y] = value===1 ? App.Tiles.floor : App.Tiles.wall;
    });
    this.map = new App.Map(tiles); 
  },

  exit: function() {
    console.log("exited Screen.play");
  },

  render: function(display) {
    for (var x=0; x<this.map.width; x++) {
      for (var y=0; y<this.map.height; y++) {
        var glyph = this.map.getTile(x,y).glyph;
        display.draw(x, y, glyph.ch, glyph.fg, glyph.bg);
      }
    }
  },

  handleInput: function(keyCode) {
    if (keyCode === ROT.VK_RETURN) {
      App.switchScreen(App.Screens.win);
    } else if (keyCode === ROT.VK_ESCAPE) {
      App.switchScreen(App.Screens.start);
    } else {
      App.switchScreen(App.Screens.lose);
    }
  }
};

//-----------------------------
// start:
//-----------------------------

App.Screens.start = {
  enter: function() {
    console.log("entered Screen.start");
  },
  exit:  function() {
    console.log("exited Screen.start");
  },
  render: function(display) {
    display.drawText(1,1, "%c{yellow}Start Screen");
    display.drawText(1,2, "Press [Enter] to start");
  },
  handleInput: function(keyCode) {
    if (keyCode === ROT.VK_RETURN) {
      App.switchScreen(App.Screens.play);
    }
  }
};

//-----------------------------
// win:
//-----------------------------

App.Screens.win = {
  enter: function() {
    console.log("entered Screen.win");
  },
  exit: function() {
    console.log("exited Screen.win");
  },
  render: function(display) {
    display.drawText(1,1, "%c{green}Win Screen");
    display.drawText(1,2, "press [Enter] to play again");
  },
  handleInput: function(keyCode) {
    if (keyCode === ROT.VK_RETURN) {
      App.switchScreen(App.Screens.play); 
    }
  }
};

//-----------------------------
// lose:
//-----------------------------

App.Screens.lose = {
  enter: function() {
    console.log("entered Screen.lose");
  },
  exit: function() {
    console.log("exited Screen.lose");
  },
  render: function(display) {
    display.drawText(1,1, "%c{red}Lose Screen");
    display.drawText(1,2, "press [Enter] to play again");
  },
  handleInput: function(keyCode) {
    if (keyCode === ROT.VK_RETURN) {
      App.switchScreen(App.Screens.play); 
    }
  }
};






