
App.Templates.player = {
  name: 'player',
  ch:   '@',
  fg:   'white',
  bg:   'black',
  maxHP:       40,
  defense:      0,
  attackPower: 10,
  sightRadius: 8,
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
  fg:   'green',
  maxHP:  15,
  defense: 0,
  mixins: [
    App.Mixins.Fungus,
    App.Mixins.Defender
  ]
};

App.Templates.poisonousFungus = {
  name: 'poisonousFungus',
  ch:   'P',
  fg:   'red',
  maxHP: 15,
  defense: 0,
  mixins: [
    App.Mixins.Fungus,
    App.Mixins.PoisonousDefender
  ]
};
