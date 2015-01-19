

var App = {

  display:  null,

  init: function(mapWidth, mapHeight) {
    this.display = new ROT.Display({width:mapWidth, height:mapHeight});
    document.body.appendChild(this.display.getContainer());
    this.draw();
  },

  draw: function() {
    var fg, bg, colors;
    for (var i=0; i<15; i++) {
      var factor = i*20;
      var gray   = 255-factor;
      fg = ROT.Color.toRGB([gray, gray, gray]);
      bg = ROT.Color.toRGB([factor, factor, factor]);
      colors = "%c{"+ fg +"}%b{"+ bg +"}";
      this.display.drawText(2, i, colors +"hello there");
    }
  }


};

