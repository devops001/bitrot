
App.ItemRepository = new App.Repository("items", App.Item);

//------------------------------
// Other:
//------------------------------

// for selecting 'none' in item list screens (ex: choose weapon):
App.ItemRepository.define('none', {
  name: 'none',
  ch:   ' ',
  isRandomDrop: false
});

App.ItemRepository.define('corpse', {
  name: 'corpse',
  ch:   '%',
  fg:   '#f00',
  bg:   '#332',
  isRandomDrop: false,
  foodValue:    75,
  maxPortions:   1,
  portionsLeft:  1,
  mixins: [App.ItemMixins.Edible]
});

//------------------------------
// Weapons:
//------------------------------

App.ItemRepository.define('rock', {
  name: 'rock',
  ch:   '*',
  fg:   '#ccc',
  bg:   '#332',
  attackValue: 1,
  isWieldable: true,
  isRandomDrop: true,
  mixins: [App.ItemMixins.Equippable]
});

App.ItemRepository.define('dagger', {
  name: 'dagger',
  ch:   ')',
  fg:   '#888',
  attackValue: 5,
  isWieldable: true,
  isRandomDrop: false,
  mixins: [App.ItemMixins.Equippable]
});

App.ItemRepository.define('sword', {
  name: 'sword',
  ch:   ')',
  fg:   '#88f',
  bg:   '#332',
  attackValue: 10,
  isWieldable: true,
  isRandomDrop: false,
  mixins: [App.ItemMixins.Equippable]
});

App.ItemRepository.define('staff', {
  name: 'staff',
  ch:   ')',
  fg:   '#f7f',
  bg:   '#332',
  attackValue:  3,
  defendValue:  3,
  isWieldable:  true,
  isRandomDrop: false,
  mixins: [App.ItemMixins.Equippable]
})

//------------------------------
// Wearables:
//------------------------------

App.ItemRepository.define('bloody shirt', {
  name: 'bloody shirt',
  ch:   '[',
  fg:   '#ff3344',
  bg:   '#332',
  attackValue: 0,
  defendValue: 1,
  isWearable: true,
  isRandomDrop: true,
  mixins: [App.ItemMixins.Equippable]
});

App.ItemRepository.define('tunic', {
  name: 'tunic',
  ch:   '[',
  fg:   '#736342',
  bg:   '#332',
  defendValue:  2,
  isWearable:   true,
  isRandomDrop: false,
  mixins: [App.ItemMixins.Equippable]
});

App.ItemRepository.define('jerkin', {
  name: 'jerkin',
  ch:   '[',
  fg:   '#963896',
  bg:   '#332',
  defendValue:  4,
  isWearable:   true,
  isRandomDrop: false,
  mixins: [App.ItemMixins.Equippable]
});

App.ItemRepository.define('chainmail', {
  name: 'chainmail',
  ch:   '[',
  fg:   '#8347aa',
  bg:   '#332',
  defendValue:  8,
  isWearable:   true,
  isRandomDrop: false,
  mixins: [App.ItemMixins.Equippable]
});

App.ItemRepository.define('platemail', {
  name: 'platemail',
  ch:   '[',
  fg:   '#8347ff',
  bg:   '#332',
  defendValue:  12,
  isWearable:   true,
  isRandomDrop: false,
  mixins: [App.ItemMixins.Equippable]
});

//------------------------------
// Food:
//------------------------------

App.ItemRepository.define('apple', {
  name: 'apple',
  ch:   '*',
  fg:   '#f00',
  bg:   '#332',
  isRandomDrop: true,
  foodValue:    50,
  maxPortions:   1,
  portionsLeft:  1,
  mixins: [App.ItemMixins.Edible]
});

App.ItemRepository.define('melon', {
  name: 'melon',
  ch:   '*',
  fg:   '#0f0',
  bg:   '#332',
  isRandomDrop: true,
  foodValue:    35,
  maxPortions:   4,
  portionsLeft:  4,
  mixins: [App.ItemMixins.Edible]
});
