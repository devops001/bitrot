
App.Templates.player = {
  name: 'player',
  ch:   '@',
  fg:   'white',
  bg:   'black',
  mixins: [
    App.Mixins.Player,
    App.Mixins.Digger,
    App.Mixins.Defender,
    App.Mixins.Attacker
  ]
};

App.Templates.fungus = {
  name: 'fungus',
  ch:   'F',
  fg:   'green',
  mixins: [
    App.Mixins.Fungus,
    App.Mixins.Defender
  ]
};
