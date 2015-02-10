
var App = {
  width:     40,
  height:    20,
  display:   null,
  screen:    null,
  Screens:   {},
  Tiles:     {},
  Mixins:    {},
  Templates: {},

  init: function() {
    this.display = new ROT.Display({width:this.width, height:this.height+1});
    this.display.setOptions({width:App.width, fontSize:20, fontSytle:"bold", bg:"#fff"});
    document.body.appendChild(this.display.getContainer());
    window.onkeypress = function(e) {
      e = e || window.event;
      var code = e.which==0 ? e.keyCode : e.which;
      App.screen.handleInput(code);
    }
    this.createTiles();
    this.switchScreen(App.Screens.start);
  },

  refresh: function() {
    this.display.clear();
    this.screen.render(this.display);
  },

  createTiles: function() {
    this.Tiles.null       = new App.Tile();
    this.Tiles.wall       = new App.Tile({ch:'#', fg:'#775', isDiggable:true, blocksLight:true,  bg:'#440'});
    this.Tiles.floor      = new App.Tile({ch:'.', fg:'#553', isWalkable:true, blocksLight:false, bg:'#332'});
    this.Tiles.stairsUp   = new App.Tile({ch:'<', fg:'#fff', isWalkable:true, blocksLight:false});
    this.Tiles.stairsDown = new App.Tile({ch:'>', fg:'#fff', isWalkable:true, blocksLight:false});
  },

  switchScreen: function(screen) {
    if (this.screen != null) { this.screen.exit(); }
    this.screen = screen;
    this.screen.enter();
    this.refresh();
  },

  sendMessage: function(receiver, message, args) {
    if (receiver.hasMixin("Messaging")) {
      if (args) { message = vsprintf(message, args); }
      receiver.receiveMessage(message);
    }
  },

  sendMessageNear: function(map, x, y, z, message, args) {
    if (args) { message = vsprintf(message, args); }
    var entities = map.getEntitiesWithinRadius(x, y, z, 5);
    for (var i=0; i<entities.length; i++) {
      if (entities[i].hasMixin("Messaging")) {
        this.sendMessage(entities[i], message);
      }
    }
  },

  getPositionsAround: function(x, y) {
    var positions = [];
    for (var dx=-1; dx<2; dx++) {
      for (var dy=-1; dy<2; dy++) {
        if (dx==0 && dy==0) { continue; }
        positions.push({x:x+dx, y:y+dy});
      }
    }
    return positions.randomize();
  },

  Glyph: function(properties) {
    properties = properties    || {};
    this.ch    = properties.ch || ' ';
    this.fg    = properties.fg || 'white';
    this.bg    = properties.bg || 'black';
  },

  KEY_Enter:      13,
  KEY_Escape:     27,
  KEY_Space:      32,
  KEY_LeftArrow:  37,
  KEY_UpArrow:    38,
  KEY_RightArrow: 39,
  KEY_DownArrow:  40,
  KEY_UpStairs:   60,
  KEY_DownStairs: 62,

  KEY_a: 65,
  KEY_b: 66,
  KEY_c: 67,
  KEY_d: 68,
  KEY_e: 69,
  KEY_f: 70,
  KEY_g: 71,
  KEY_h: 72,
  KEY_i: 73,
  KEY_j: 74,
  KEY_k: 75,
  KEY_l: 76,
  KEY_m: 77,
  KEY_n: 78,
  KEY_o: 79,
  KEY_p: 80,
  KEY_q: 81,
  KEY_r: 82,
  KEY_s: 83,
  KEY_t: 84,
  KEY_u: 85,
  KEY_v: 86,
  KEY_w: 87,
  KEY_x: 88,
  KEY_y: 89,
  KEY_z: 90,

  KEY_A: 97,
  KEY_B: 98,
  KEY_C: 99,
  KEY_D: 100,
  KEY_E: 101,
  KEY_F: 102,
  KEY_G: 103,
  KEY_H: 104,
  KEY_I: 105,
  KEY_J: 106,
  KEY_K: 107,
  KEY_L: 108,
  KEY_M: 109,
  KEY_N: 110,
  KEY_O: 111,
  KEY_P: 112,
  KEY_Q: 113,
  KEY_R: 114,
  KEY_S: 115,
  KEY_T: 116,
  KEY_U: 117,
  KEY_V: 118,
  KEY_W: 119,
  KEY_X: 120,
  KEY_Y: 121,
  KEY_Z: 122,
};
