

var App = {

  //---------------------------
  // public:
  //---------------------------

  display:  null,

  init: function(mapWidth, mapHeight) {
    this.display = new ROT.Display({width:mapWidth, height:mapHeight});
    document.body.appendChild(this.display.getContainer());
  }


};

