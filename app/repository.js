
App.Repository = function(name, constructor) {
  this.name            = name;
  this.constructor     = constructor;
  this.templates       = {};
  this.randomTemplates = {};
};

App.Repository.prototype.define = function(name, template) {
  this.templates[name] = template;
  if (template.isRandomDrop) {
    this.randomTemplates[name] = template;
  }
};

App.Repository.prototype.create = function(name, overridingProperties) {
  if (!this.templates[name]) {
    throw new Error("No template named '"+ name +"' in the "+ this.name +" repository");
  }
  var template = Object.create(this.templates[name]);
  if (overridingProperties) {
    for (var key in overridingProperties) {
      template[key] = overridingProperties[key];
    }
  }
  return new this.constructor(template);
};

App.Repository.prototype.createRandom = function() {
  return this.create(Object.keys(this.randomTemplates).random());
};
