
//-----------------------------
// play:
//-----------------------------

App.Screens.play = {
  map:    null,
  player: null,

  enter: function() {
    console.log("entered Screen.play");
    App.display.setOptions({fontSize:28, fontSytle:"bold", bg:"#000"});
    var mapDepth  = 3;
    var mapWidth  = 50;
    var mapHeight = 50;
    var tiles     = new App.Builder(mapWidth, mapHeight, mapDepth).tiles;
    this.player   = new App.Entity(App.Templates.player);
    this.map      = new App.Map(tiles, this.player);
    this.map.engine.start();
  },

  exit: function() {
    console.log("exited Screen.play");
  },

  render: function(display) {
    // tiles:
    var startX = Math.max(0, this.player.x - (App.width/2));
    startX     = Math.min(startX, this.map.width - App.width);
    var startY = Math.max(0, this.player.y - (App.height/2));
    startY     = Math.min(startY, this.map.height - App.height);
    var stopX  = startX + App.width;
    var stopY  = startY + App.height;
    for (var x=startX; x<stopX; x++) {
      for (var y=startY; y<stopY; y++) {
        var tile = this.map.getTile(x,y, this.player.z);
        display.draw(x-startX, y-startY, tile.ch, tile.fg, tile.bg);
      }
    }

    // entities: (draw in reverse order to draw player last/on top):
    for (var i=this.map.entities.length-1; i>-1; i--) {
      var e = this.map.entities[i];
      if (e.z==this.player.z && e.x>=startX && e.x<stopX && e.y>=startY && e.y<stopY) {
        display.draw(e.x-startX, e.y-startY, e.ch, e.fg, e.bg);
      }
    }

    // messages:
    var msgY = 0;
    for (var i=0; i<this.player.messages.length; i++) {
      msgY += display.drawText(0, msgY, '%c{white}%b{black}' + this.player.messages[i]);
    }

    // stats:
    var stats = '%c{white}%b{black}';
    stats += vsprintf('HP: %d/%d ', [this.player.hp, this.player.maxHP]);
    display.drawText(0, App.height, stats);
  },

  handleInput: function(code) {
    switch(code) {
    case App.KEY_Enter:      App.switchScreen(App.Screens.win); break;
    case App.KEY_Escape:     App.switchScreen(App.Screens.lose); break;
    case App.KEY_DownStairs: this.move(0,0, 1); break;
    case App.KEY_UpStairs:   this.move(0,0,-1); break;
    case App.KEY_LeftArrow:  this.move(-1,0,0); break;
    case App.KEY_RightArrow: this.move( 1,0,0); break;
    case App.KEY_DownArrow:  this.move(0, 1,0); break;
    case App.KEY_UpArrow:    this.move(0,-1,0); break;
    }
  },

  move: function(dirX, dirY, dirZ) {
    var newX = this.player.x + dirX;
    var newY = this.player.y + dirY;
    var newZ = this.player.z + dirZ;
    this.player.tryMove(newX, newY, newZ, this.map);
    this.map.engine.unlock();
  }
};

//-----------------------------
// start:
//-----------------------------

App.Screens.start = {
  enter: function() {
    console.log("entered Screen.start");
    App.display.setOptions({width:App.width, fontSize:28, fontSytle:"bold", bg:"#00a"});
  },
  exit:  function() {
    console.log("exited Screen.start");
  },
  render: function(display) {
    display.drawText(1,1, "%c{yellow}Start Screen");
    display.drawText(1,2, "Press [Enter] to start");
  },
  handleInput: function(key) {
    if (key === App.KEY_Enter) {
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
    App.display.setOptions({width:App.width, fontSize:28, fontSytle:"bold", bg:"#0a0"});
  },
  exit: function() {
    console.log("exited Screen.win");
  },
  render: function(display) {
    display.drawText(1,1, "%c{green}Win Screen");
    display.drawText(1,2, "press [Enter] to play again");
  },
  handleInput: function(key) {
    if (key === App.KEY_Enter) {
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
    App.display.setOptions({width:App.width, fontSize:28, fontSytle:"bold", bg:"#a00"});
  },
  exit: function() {
    console.log("exited Screen.lose");
  },
  render: function(display) {
    display.drawText(1,1, "%c{red}Lose Screen");
    display.drawText(1,2, "press [Enter] to play again");
  },
  handleInput: function(key) {
    if (key === App.KEY_Enter) {
      App.switchScreen(App.Screens.play);
    }
  }
};
