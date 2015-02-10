
App.ItemRepository = new App.Repository("items", App.Item);

App.ItemRepository.define('rock', {
  name: 'rock',
  ch:   '*',
  fg:   '#fff'
});

App.ItemRepository.define('apple', {
  name: 'apple',
  ch:   '%',
  fg:   '#f00',
  foodValue: 50,
  maxPortions:  1,
  portionsLeft: 1,
  mixins: [App.ItemMixins.Edible]
});

App.ItemRepository.define('melon', {
  name: 'melon',
  ch:   '%',
  fg:   '#0f0',
  foodValue: 35,
  maxPortions:  4,
  portionsLeft: 4,
  mixins: [App.ItemMixins.Edible]
});
