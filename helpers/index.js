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

var epdqParams = function(epdqResponse){
  return epdqResponse.parameters();
};

var documentCount = function(params){
  return (parseInt(params['document_count'], 10) || 0);
};

var registrationCount = function(params){
  return (parseInt(params['registration_count'], 10) || 0);
};

var registrationsAndCertificates = function(params){
  var phrases = [],
      regCount = registrationCount(params),
      docCount = documentCount(params);

  if (regCount > 0){
    phrases.push(pluralise("registration", regCount));
  }
  if (docCount > 0){
    phrases.push(pluralise("certificate", docCount));
  }
  return phrases.join(" and ");
};

var pageTitle = function(){
  return transaction.title + " - GOV.UK";
};

module.exports = function(app){
  if (typeof app == 'undefined') throw new Error("Please pass an app to this module!");
  app.locals.pluralise = pluralise;
  app.locals.titleCase = titleCase;
  app.locals.formatMoney = formatMoney;
  app.locals.epdqParams = epdqParams;
  app.locals.documentCount = documentCount;
  app.locals.registrationCount = registrationCount;
  app.locals.registrationsAndCertificates = registrationsAndCertificates;

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
