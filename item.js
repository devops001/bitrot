
App.Item = function(properties) {
  properties = properties || {};
  App.Glyph.call(this, properties);
  this.name = properties.name || '';
};

//------------------------------
// Repository:
//------------------------------

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
