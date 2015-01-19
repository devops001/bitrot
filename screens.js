
App.Screens = {};

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
// play:
//-----------------------------

App.Screens.play = {
  enter: function() {
    console.log("entered Screen.play");
  },
  exit:  function() {
    console.log("exited Screen.play");
  },
  render: function(display) {
    display.drawText(1,1, "%c{magenta}Play Screen");
    display.drawText(1,2, "press [Escape] to %c{yellow}start over");
    display.drawText(1,3, "press [Enter] to %c{green}win");
    display.drawText(1,4, "press anything else to %c{red}lose");
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






