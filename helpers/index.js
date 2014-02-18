var partials = require('express-partials'),
    pluralize = require('pluralize');
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

var epdqParams = function(epdqResponse){
  return epdqResponse.parameters();
};

var postage = function(params){
  return (typeof params['postage'] != 'undefined' && params['postage'] == 'yes');
};

var documentCount = function(params){
  var documentCount = parseInt(params['document_count'],10);
  return (typeof documentCount == 'undefined' ? 0 : new Number(documentCount));
};

var registrationCount = function(params){
  var registrationCount = parseInt(params['document_count'],10);
  return (typeof registrationCount == 'undefined' ? 0 : new Number(registrationCount));
};

var pageTitle = function(){
  return transaction.title + " - GOV.UK";
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

  // govuk_template vars
  app.locals.topOfPage = "";
  app.locals.pageTitle = pageTitle;
  app.locals.assetPath = "/";
  app.locals.bodyClasses = "mainstream";
  app.locals.headerClass = "";
  app.locals.insideHeader = "";
  app.locals.propositionHeader = "";
  app.locals.afterHeader = "";
  app.locals.cookieMessage = "";
  app.locals.bodyEnd = "";
  app.locals.govukRoot = "https://www.gov.uk";
}
