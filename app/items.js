
App.ItemRepository = new App.Repository("items", App.Item);

App.ItemRepository.define('apple', {
  name: 'apple',
  ch:   '%',
  fg:   '#f00'
});

App.ItemRepository.define('rock', {
  name: 'rock',
  ch:   '*',
  fg:   '#fff'
});
