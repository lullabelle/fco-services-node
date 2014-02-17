var pluralize = require('pluralize');
/**
 * View helpers (see http://expressjs.com/api.html#app.locals)
 */
var pluralise = function(word, count){
  return pluralize(word, count, true);
};

var titleCase = function(word){
  return word.charAt(0).toUpperCase() + word.slice(1);
};

var formatMoney = function(num){
  return num.toFixed(2);
};

var epdqParams = function(){
  return edpqResponse.parameters;
};

var postage = function(){
  return (typeof edpqParams['postage'] != 'undefined' && edpqParams['postage'] == 'yes');
};

var documentCount = function(){
  var documentCount = epdqParams['document_count'];
  return (typeof documentCount == 'undefined' ? 0 : new Number(documentCount));
};

var registrationCount = function(){
  var registrationCount = epdqParams['document_count'];
  return (typeof registrationCount == 'undefined' ? 0 : new Number(registrationCount));
};

module.exports = function(app){
  if (typeof app == 'undefined') throw new Error("You must app to this module!");
  app.locals.pluralise = pluralise;
  app.locals.titleCase = titleCase;
  app.locals.formatMoney = formatMoney;
  app.locals.epdqParams = epdqParams;
  app.locals.postage = postage;
  app.locals.documentCount = documentCount;
  app.locals.registrationCount = registrationCount;
}
