
App.Templates.player = {
  name: 'player',
  ch:   '@',
  fg:   'white',
  bg:   'black',
  maxHP:       40,
  defense:      0,
  attackPower: 10,
  sightRadius: 50,
  mixins: [
    App.Mixins.Player,
    App.Mixins.Digger,
    App.Mixins.Defender,
    App.Mixins.Attacker,
    App.Mixins.MessageReceiver,
    App.Mixins.Sight
  ]
};

App.Templates.fungus = {
  name: 'fungus',
  ch:   'F',
  fg:   '#0f0',
  maxHP:  15,
  defense: 0,
  mixins: [
    App.Mixins.Fungus,
    App.Mixins.Defender
  ]
};

App.Templates.poisonousFungus = {
  name: 'poisonousFungus',
  ch:   'F',
  fg:   '#0f0',
  bg:   '#200',
  maxHP: 15,
  defense: 0,
  mixins: [
    App.Mixins.Fungus,
    App.Mixins.PoisonousDefender
  ]
};
