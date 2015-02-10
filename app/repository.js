
App.Repository = function(name, constructor) {
  this.name        = name;
  this.constructor = constructor;
  this.templates   = {};
};

App.Repository.prototype.define = function(name, template) {
  this.templates[name] = template;
};

App.Repository.prototype.create = function(name) {
  var template = this.templates[name];
  if (!template) {
    throw new Error("No template named '"+ name +"' in "+ this.name +" repository");
  }
  return new this.constructor(template);
};

App.Repository.prototype.createRandom = function() {
  return this.create(Object.keys(this.templates).random());
};
