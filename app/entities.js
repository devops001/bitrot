
App.EntityRepository = new App.Repository('entities', App.Entity);

App.EntityRepository.define('fungus', {
  name:    'fungus',
  ch:      'F',
  fg:      '#0f0',
  maxHP:   15,
  defense: 0,
  mixins: [ App.Mixins.Acting.Fungus, App.Mixins.Defending.Defender ]
});

App.EntityRepository.define("poisonousFungus", {
  name:    'poisonousFungus',
  ch:      'F',
  fg:      '#0f0',
  bg:      '#200',
  maxHP:   15,
  defense: 0,
  mixins: [ App.Mixins.Acting.Fungus, App.Mixins.Defending.Poisonous ]
});

App.EntityRepository.define("bat", {
  name:       'bat',
  ch:         'b',
  fg:         '#faa',
  maxHP:       5,
  attackPower: 5,
  defense:     5,
  mixins: [
    App.Mixins.Acting.Wanderer, App.Mixins.Moving.Walker,
    App.Mixins.Defending.Defender, App.Mixins.Attacking.Attacker
  ]
});

App.EntityRepository.define("newt", {
  name:        'newt',
  ch:          'n',
  fg:          '#faf',
  maxHP:       5,
  attackPower: 4,
  defense:     6,
  mixins: [
    App.Mixins.Acting.Wanderer, App.Mixins.Moving.Walker,
    App.Mixins.Defending.Defender, App.Mixins.Attacking.Attacker
  ]
});

App.EntityRepository.define("poisonousMole", {
  name:       'poisonousMole',
  ch:         'm',
  fg:         '#afa',
  maxHP:       10,
  attackPower: 5,
  defense:     1,
  mixins: [
    App.Mixins.Acting.Wanderer, App.Mixins.Moving.Digger,
    App.Mixins.Defending.Poisonous, App.Mixins.Attacking.Attacker
  ]
});
