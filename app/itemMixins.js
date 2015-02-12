
//------------------------------
// Edible:
//------------------------------

App.ItemMixins.Edible = {
  name: 'Edible',
  init: function(template) {
    this.foodValue    = template.foodValue    || '5';
    this.maxPortions  = template.maxPortions  || 1;
    this.portionsLeft = template.portionsLeft || this.maxPortions;
  },
  eat: function(entity) {
    if (entity.hasMixin('Eating')) {
      if (this.portionsLeft > 0) {
        entity.modifyFullness(this.foodValue);
        this.portionsLeft--;
      }
    }
  },
  describe: function() {
    if (this.portionsLeft != this.maxPortions) {
      return 'partly eaten '+ App.Item.prototype.describe.call(this);
    } else {
      return App.Item.prototype.describe.call(this);
    }
  }
};

//------------------------------
// Equippable:
//------------------------------

App.ItemMixins.Equippable = {
  name: 'Equippable',
  init: function(template) {
    this.attackValue = template.attackValue || 0;
    this.defendValue = template.defendValue || 0;
    this.isWieldable = template.isWieldable || false;
    this.isWearable  = template.isWearable  || false;
  }
};
