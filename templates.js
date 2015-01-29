
App.Templates.player = {
  name:        'player',
  ch:          '@',
  fg:          '#fff',
  bg:          '#000',
  maxHP:       40,
  defense:      0,
  attackPower: 10,
  sightRadius: 50,
  mixins: [
    App.Mixins.Acting.Player,      App.Mixins.Moving.Digger,
    App.Mixins.Defending.Defender, App.Mixins.Attacking.Attacker,
    App.Mixins.Messaging.Receiver, App.Mixins.Seeing.Sight
  ]
};
