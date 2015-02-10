
App.Templates.player = {
  name:           'player',
  ch:             '@',
  fg:             '#fff',
  bg:             '#000',
  maxHP:          40,
  defense:         0,
  attackPower:    10,
  sightRadius:    10,
  inventorySlots: 22,
  mixins: [
    App.EntityMixins.Acting.Player,      App.EntityMixins.Moving.Digger,
    App.EntityMixins.Defending.Defender, App.EntityMixins.Attacking.Attacker,
    App.EntityMixins.Messaging.Receiver, App.EntityMixins.Seeing.Sight,
    App.EntityMixins.Inventory.Carrier
  ]
};
