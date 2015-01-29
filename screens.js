
//-----------------------------
// play:
//-----------------------------

App.Screens.play = {
  map:    null,
  player: null,

  enter: function() {
    console.log("entered Screen.play");
    App.display.setOptions({fontSize:14, fontSytle:"bold", bg:"#000"});
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
    var visible = this.getVisiblePositions();

    // tiles:
    var startX  = Math.max(0, this.player.x - (App.width/2));
    startX      = Math.min(startX, this.map.width - App.width);
    var startY  = Math.max(0, this.player.y - (App.height/2));
    startY      = Math.min(startY, this.map.height - App.height);
    var stopX   = startX + App.width;
    var stopY   = startY + App.height;
    for (var x=startX; x<stopX; x++) {
      for (var y=startY; y<stopY; y++) {
        if (this.map.isExplored(x,y,this.player.z)) {
          var tile = this.map.getTile(x,y, this.player.z);
          var fg, bg;
          if (visible[x+","+y]) {
            fg = tile.fg;
            bg = tile.bg;
          } else {
            fg = "#222";
            bg = "#111";
          }
          display.draw(x-startX, y-startY, tile.ch, fg, bg);
        }
      }
    }

    // entities:
    for (var key in this.map.entities) {
      var e = this.map.entities[key];
      if (e.z==this.player.z && e.x>=startX && e.x<stopX && e.y>=startY && e.y<stopY) {
        if (visible[e.x+","+e.y]) {
          display.draw(e.x-startX, e.y-startY, e.ch, e.fg, e.bg);
        }
      }
    }

    // messages:
    var msgY = 0;
    for (var i=0; i<this.player.messages.length; i++) {
      msgY += display.drawText(0, msgY, '%c{gray}%b{black}' + this.player.messages[i]);
    }

    // stats:
    var health = '%c{gray}%b{black}';
    health += vsprintf('hp: %d/%d ', [this.player.hp, this.player.maxHP]);
    display.drawText(0, App.height, health);

    var level = '%c{gray}%b{black}';
    level += vsprintf('Level: %d', [this.player.z+1]);
    display.drawText(App.width-10, App.height, level);
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
  },

  getVisiblePositions: function() {
    // TODO: stop using strings as keys to be faster
    var player    = this.player;
    var map       = this.map;
    var positions = {};
    var cb = function(x,y,radius,visibility) {
      positions[x+","+y]=true;
      map.setExplored(x,y,player.z, true);
    };
    this.map.fov[player.z].compute(player.x,player.y,player.sightRadius,cb);
    return positions;
  }
};

//-----------------------------
// start:
//-----------------------------

App.Screens.start = {
  enter: function() {
    console.log("entered Screen.start");
    App.display.setOptions({width:App.width, fontSytle:"bold", bg:"#00a"});
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
    App.display.setOptions({width:App.width, fontSize:14, fontSytle:"bold", bg:"#0a0"});
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
    App.display.setOptions({width:App.width, fontSize:14, fontSytle:"bold", bg:"#a00"});
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
