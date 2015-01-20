
//-----------------------------
// play:
//-----------------------------

App.Screens.play = {
  map:     null,
  centerX: 0,
  centerY: 0, 

  enter: function() {
    console.log("entered Screen.play");
    var mapWidth  = 500;
    var mapHeight = 500;
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
    generator.create(function(x, y, value) {
      tiles[x][y] = value===1 ? App.Tiles.floor : App.Tiles.wall;
    });
    this.map = new App.Map(tiles); 
  },

  exit: function() {
    console.log("exited Screen.play");
  },

  render: function(display) {
    var topLeftX = Math.max(0, this.centerX-(App.width/2));
    topLeftX     = Math.min(topLeftX, this.map.width-App.width);
    var topLeftY = Math.max(0, this.centerY-(App.height/2));
    topLeftY     = Math.min(topLeftY, this.map.height-App.height);

    var stopX = topLeftX + App.width;
    var stopY = topLeftY + App.height;

    for (var x=topLeftX; x<stopX; x++) {
      for (var y=topLeftY; y<stopY; y++) {
        var tile = this.map.getTile(x,y);
        display.draw(x-topLeftX, y-topLeftY, tile.ch, tile.fg, tile.bg);
      }
    }
    display.draw(this.centerX-topLeftX, this.centerY-topLeftY, '@', 'white', 'black');
  },

  handleInput: function(keyCode) {
    if (keyCode === ROT.VK_RETURN) {
      App.switchScreen(App.Screens.win);
    } else if (keyCode === ROT.VK_ESCAPE) {
      App.switchScreen(App.Screens.lose);
    }
    if (keyCode === ROT.VK_LEFT) {
      return this._move(-1, 0);
    } else if (keyCode === ROT.VK_RIGHT) {
      return this._move(1, 0);
    } else if (keyCode === ROT.VK_UP) {
      return this._move(0, -1);
    } else if (keyCode === ROT.VK_DOWN) {
      return this._move(0, 1);
    }
    return false;
  },

  _move: function(dirX, dirY) {
    this.centerX = Math.max(0, Math.min(this.map.width-1,  this.centerX+dirX));
    this.centerY = Math.max(0, Math.min(this.map.height-1, this.centerY+dirY));
    return true;
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
    return false;
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
    return false;
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
    return false;
  }
};






