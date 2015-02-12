
App.EntityRepository = new App.Repository('entities', App.Entity);

App.EntityRepository.define('fungus', {
  name:    'fungus',
  ch:      'F',
  fg:      '#0f0',
  bg:      '#332',
  isRandomDrop: true,
  maxHP:   15,
  defense: 0,
  mixins: [
    App.EntityMixins.Acting.Fungus,
    App.EntityMixins.Defending.Defender
  ]
});

App.EntityRepository.define("poisonousFungus", {
  name:    'poisonousFungus',
  ch:      'F',
  fg:      '#cf0',
  bg:      '#332',
  isRandomDrop: true,
  maxHP:   15,
  defense: 0,
  mixins: [
    App.EntityMixins.Acting.Fungus,
    App.EntityMixins.Defending.Poisonous
  ]
});

App.EntityRepository.define("bat", {
  name:       'bat',
  ch:         'b',
  fg:         '#faa',
  bg:         '#332',
  isRandomDrop: true,
  maxHP:       5,
  attackPower: 5,
  defense:     5,
  mixins: [
    App.EntityMixins.Acting.Wanderer,
    App.EntityMixins.Moving.Walker,
    App.EntityMixins.Defending.Defender,
    App.EntityMixins.Attacking.Attacker,
    App.EntityMixins.CorpseDropping.CorpseDropper
  ]
});

App.EntityRepository.define("newt", {
  name:        'newt',
  ch:          'n',
  fg:          '#faf',
  bg:          '#332',
  isRandomDrop: true,
  maxHP:       5,
  attackPower: 4,
  defense:     6,
  mixins: [
    App.EntityMixins.Acting.Wanderer,
    App.EntityMixins.Moving.Walker,
    App.EntityMixins.Defending.Defender,
    App.EntityMixins.Attacking.Attacker,
    App.EntityMixins.CorpseDropping.CorpseDropper
  ]
});

App.EntityRepository.define("poisonousMole", {
  name:       'poisonousMole',
  ch:         'm',
  fg:         '#afa',
  bg:         '#332',
  isRandomDrop: true,
  maxHP:       10,
  attackPower: 5,
  defense:     1,
  mixins: [
    App.EntityMixins.Acting.Wanderer,
    App.EntityMixins.Moving.Digger,
    App.EntityMixins.Defending.Poisonous,
    App.EntityMixins.Attacking.Attacker,
    App.EntityMixins.CorpseDropping.CorpseDropper
  ]
});
