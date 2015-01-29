
//-----------------------------
// play:
//-----------------------------

App.Screens.play = {
  map:       null,
  player:    null,
  subScreen: null,

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
    if (this.subScreen) {
      this.subScreen.render(display);
      return;
    }

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
          var glyph = this.map.getTile(x,y, this.player.z);
          var ch, fg, bg;
          if (visible[x+","+y]) {
            var entity = this.map.getEntityAt(x, y, this.player.z);
            var items  = this.map.getItemsAt(x, y, this.player.z);
            if (entity) {
              glyph = entity;
            } else if (items) {
              glyph = items[items.length-1];
            }
            ch = glyph.ch;
            fg = glyph.fg;
            bg = glyph.bg;
          } else {
            ch = glyph.ch;
            fg = "#222";
            bg = "#111";
          }
          display.draw(x-startX, y-startY, ch, fg, bg);
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
    if (this.subScreen) {
      this.subScreen.handleInput(code);
      return;
    }

    this.player.clearMessages();
    var shouldUnlock = true;

    switch(code) {
    case App.KEY_Enter:      App.switchScreen(App.Screens.win); break;
    case App.KEY_Escape:     App.switchScreen(App.Screens.lose); break;
    case App.KEY_DownStairs: this.move(0,0, 1); break;
    case App.KEY_UpStairs:   this.move(0,0,-1); break;
    case App.KEY_LeftArrow:  this.move(-1,0,0); break;
    case App.KEY_RightArrow: this.move( 1,0,0); break;
    case App.KEY_DownArrow:  this.move(0, 1,0); break;
    case App.KEY_UpArrow:    this.move(0,-1,0); break;
    // inventory:
    case App.KEY_I:
    case App.KEY_i:
      if (this.player.hasItems()) {
        App.Screens.inventory.setup(this.player, this.player.getItems());
        this.setSubScreen(App.Screens.inventory);
      } else {
        App.sendMessage(this.player, "You are not carrying anything");
        App.refresh();
        shouldUnlock = false;
      }
      break;
    // pickup:
    case App.KEY_G:
    case App.KEY_g:
      var items = this.map.getItemsAt(this.player.x, this.player.y, this.player.z);
      if (!items) {
        App.sendMessage(this.player, "There is nothing here to pickup");
        App.refresh();
        shouldUnlock = false;
      } else if (items.length == 1) {
        if (this.player.pickupItems([0])) {
          App.sendMessage(this.player, "You pickup %s", [items[0].describeOne()]);
        } else {
          App.sendMessage(this.player, "Your inventory is full");
        }
      } else {
        App.Screens.itemPickup.setup(this.player, items);
        this.setSubScreen(App.Screens.itemPickup);
      }
      break;
    // drop:
    case App.KEY_D:
    case App.KEY_d:
      if (!this.player.hasItems()) {
        App.sendMessage(this.player, "You don't have anything to drop");
        App.refresh();
        shouldUnlock = false;
      } else {
        App.Screens.itemDrop.setup(this.player, this.player.getItems());
        this.setSubScreen(App.Screens.itemDrop);
      }
      break;
    }

    if (shouldUnlock) {
      this.map.engine.unlock();
    }
  },

  move: function(dirX, dirY, dirZ) {
    var newX = this.player.x + dirX;
    var newY = this.player.y + dirY;
    var newZ = this.player.z + dirZ;
    this.player.tryMove(newX, newY, newZ, this.map);
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
  },

  setSubScreen: function(subScreen) {
    this.subScreen = subScreen;
    App.refresh();
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

//-----------------------------
// ItemList Generic SubScreen:
//-----------------------------

App.Screens.ItemList = function(template) {
  this.caption           = template.caption;
  this.okFunction        = template.okFunction;
  this.canSelect         = template.canSelect;
  this.canSelectMultiple = template.canSelectMultiple;
};

App.Screens.ItemList.prototype.setup = function(player, items) {
  this.player   = player;
  this.items    = items;
  this.selected = {};
};

App.Screens.ItemList.prototype.closeSubScreen = function() {
  App.Screens.play.setSubScreen(undefined);
};

App.Screens.ItemList.prototype.render = function(display) {
  display.drawText(0, 0, this.caption);
  var letters = 'abcdefghijklmnopqrstuvwxyz';
  var row     = 0;
  for (var i=0; i<this.items.length; i++) {
    if (this.items[i]) {
      var letter = letters.substring(i,i+1);
      var state  = (this.canSelectMultiple && this.selected[i]) ? '+' : '-';
      var line   = letter +' '+ state +' '+ this.items[i].describe();
      display.drawText(0, 2+row, line);
      row++;
    }
  }
};

App.Screens.ItemList.prototype.executeOkFunction = function() {
  var selected = {};
  for (var key in this.selected) {
    selected[key] = this.items[key];
  }
  this.closeSubScreen();
  if (this.okFunction(selected)) {
    this.player.map.engine.unlock();
  }
};

App.Screens.ItemList.prototype.handleInput = function(code) {
  if (code === App.KEY_Escape) {
    this.closeSubScreen();
    return;
  } else if (code === App.KEY_Enter) {
    if (!this.canSelect || Object.keys(this.selected).length==0) {
      this.closeSubScreen();
      return;
    } else {
      this.executeOkFunction();
      return;
    }
  }
  var index;
  if (code>=App.KEY_A && code<=App.KEY_Z) {
    index = code - App.KEY_A;
  } else if (code>=App.KEY_a && code<=App.KEY_z) {
    index = code - App.KEY_a;
  } else {
    console.log("DEBUG: unknown code: ", code);
    App.refresh();
  }
  if (this.items[index]) {
    if (this.canSelectMultiple) {
      if (this.selected[index]) {
        delete this.selected[index];
      } else {
        this.selected[index] = true;
      }
      App.refresh();
    } else {
      this.selected[index] = true;
      this.executeOkFunction();
    }
  }
};

//-----------------------------
// inventory subScreen:
//-----------------------------

App.Screens.inventory = new App.Screens.ItemList({
  caption: 'Inventory',
  canSelect: false,
  okFunction: function() {
    return true;
  }
});

//-----------------------------
// itemPickup subScreen:
//-----------------------------

App.Screens.itemPickup = new App.Screens.ItemList({
  caption: 'Choose the items that you wish to pickup',
  canSelect: true,
  canSelectMultiple: true,
  okFunction: function(selectedItems) {
    if (!this.player.pickupItems(Object.keys(selectedItems))) {
      App.sendMessage(this.player, "Your inventory is too full!");
    }
    return true;
  }
});

//-----------------------------
// itemDrop subScreen:
//-----------------------------

App.Screens.itemDrop = new App.Screens.ItemList({
  caption: 'Choose the item that you wish to drop',
  canSelect: true,
  canSelectMultiple: true,
  okFunction: function(selectedItems) {
    for (var key in Object.keys(selectedItems)) {
      console.log("DEBUG: key: ", key, selectedItems);
      this.player.dropItem(key);
    }
    return true;
  }
});
