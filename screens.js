
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
    display.drawText(1,1, "%c{yellow}Data Center");
    display.drawText(1,2, "Press [Enter] to start");
  },
  handleInput: function(eventName, e) {
    if (eventName === 'keydown') { 
      if (e.keyCode === ROT.VK_RETURN) {
        App.switchScreen(App.Screens.play);
      }
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
    display.drawText(1,1, "%c{red}Data Center");
    display.drawText(1,2, "playing...");
  },
  handleInput: function(eventName, e) {
    if (eventName === 'keydown') { 
      if (e.keyCode === ROT.VK_RETURN) {
        App.switchScreen(App.Screens.start);
      }
    }
  }
};

