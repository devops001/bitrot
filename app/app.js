
var App = {
  width:        40,
  height:       20,
  display:    null,
  screen:     null,
  Screens:      {},
  Tiles:        {},
  EntityMixins: {},
  ItemMixins:   {},
  Templates:    {},

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

  switchScreen: function(screen, properties) {
    if (this.screen != null) { this.screen.exit(); }
    this.screen = screen;
    this.screen.enter(properties);
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

  KEY_0: 48,
  KEY_1: 49,
  KEY_2: 50,
  KEY_3: 51,
  KEY_4: 52,
  KEY_5: 53,
  KEY_6: 54,
  KEY_7: 55,
  KEY_8: 56,
  KEY_9: 57,

  KEY_A: 65,
  KEY_B: 66,
  KEY_C: 67,
  KEY_D: 68,
  KEY_E: 69,
  KEY_F: 70,
  KEY_G: 71,
  KEY_H: 72,
  KEY_I: 73,
  KEY_J: 74,
  KEY_K: 75,
  KEY_L: 76,
  KEY_M: 77,
  KEY_N: 78,
  KEY_O: 79,
  KEY_P: 80,
  KEY_Q: 81,
  KEY_R: 82,
  KEY_S: 83,
  KEY_T: 84,
  KEY_U: 85,
  KEY_V: 86,
  KEY_W: 87,
  KEY_X: 88,
  KEY_Y: 89,
  KEY_Z: 90,

  KEY_a: 97,
  KEY_b: 98,
  KEY_c: 99,
  KEY_d: 100,
  KEY_e: 101,
  KEY_f: 102,
  KEY_g: 103,
  KEY_h: 104,
  KEY_i: 105,
  KEY_j: 106,
  KEY_k: 107,
  KEY_l: 108,
  KEY_m: 109,
  KEY_n: 110,
  KEY_o: 111,
  KEY_p: 112,
  KEY_q: 113,
  KEY_r: 114,
  KEY_s: 115,
  KEY_t: 116,
  KEY_u: 117,
  KEY_v: 118,
  KEY_w: 119,
  KEY_x: 120,
  KEY_y: 121,
  KEY_z: 122,
};
