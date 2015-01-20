
//-----------------------------
// play:
//-----------------------------

App.Screens.play = {
  map:    null,
  player: null,

  enter: function() {
    console.log("entered Screen.play");
    var mapWidth  = 500;
    var mapHeight = 500;

    // create tiles (TODO: move this to Map):
    var tiles     = [];
    for (var x=0; x<mapWidth; x++) {
      tiles.push([]);
      for (var y=0; y<mapHeight; y++) {
        tiles[x].push(App.Tile.null);
      }
    }
    var generator = new ROT.Map.Cellular(mapWidth, mapHeight);
    generator.randomize(0.5);
    var iterations = 3;   //<- more = smoother
    for (var i=0; i<iterations-1; i++) { generator.create(); }
    generator.create(function(x, y, value) { tiles[x][y] = value===1 ? App.Tiles.floor : App.Tiles.wall; });
    
    // create map:
    this.map = new App.Map(tiles); 

    // create player:
    this.player   = new App.Entity(App.Templates.player);
    var pos       = this.map.getRandFloorPos();
    this.player.x = pos.x;
    this.player.y = pos.y;
  },

  exit: function() {
    console.log("exited Screen.play");
  },

  render: function(display) {
    var startX = Math.max(0, this.player.x - (App.width/2));
    startX     = Math.min(startX, this.map.width - App.width);
    var startY = Math.max(0, this.player.y - (App.height/2));
    startY     = Math.min(startY, this.map.height - App.height);
    var stopX  = startX + App.width;
    var stopY  = startY + App.height;
    for (var x=startX; x<stopX; x++) {
      for (var y=startY; y<stopY; y++) {
        var tile = this.map.getTile(x,y);
        display.draw(x-startX, y-startY, tile.ch, tile.fg, tile.bg);
      }
    }
    display.draw(this.player.x-startX, this.player.y-startY, this.player.ch, this.player.fg, this.player.bg);
  },

  handleInput: function(keyCode) {
    if (keyCode === ROT.VK_RETURN) {
      App.switchScreen(App.Screens.win);
    } else if (keyCode === ROT.VK_ESCAPE) {
      App.switchScreen(App.Screens.lose);
    }
    if (keyCode === ROT.VK_LEFT) {
      this._move(-1, 0);
    } else if (keyCode === ROT.VK_RIGHT) {
      this._move(1, 0);
    } else if (keyCode === ROT.VK_UP) {
      this._move(0, -1);
    } else if (keyCode === ROT.VK_DOWN) {
      this._move(0, 1);
    }
  },

  _move: function(dirX, dirY) {
    var newX = Math.max(0, Math.min(this.map.width-1,  this.player.x + dirX));
    var newY = Math.max(0, Math.min(this.map.height-1, this.player.y + dirY));
    if (this.player.tryMove(newX, newY, this.map)) {
      App.refresh();
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






