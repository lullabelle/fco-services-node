var numeral = require('numeral'),
    pluralize = require('pluralize');
/**
 * View helpers (see http://expressjs.com/api.html#app.locals)
 */
var pluralise = function (word, count) {
  return pluralize(word, count, true);
};

var titleCase = function (word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

var formatMoney = function (num) {
  if (num % 1 === 0) {
    return num;
  } else {
    return numeral(num).format('0,0.00');
  }
};

var epdqParams = function (epdqResponse) {
  return epdqResponse.parameters();
};

var documentCount = function (params) {
  return (parseInt(params['document_count'], 10) || 0);
};

var registrationCount = function (params) {
  return (parseInt(params['registration_count'], 10) || 0);
};

var registrationsAndCertificates = function (params) {
  var phrases = [],
      regCount = registrationCount(params),
      docCount = documentCount(params);

  if (regCount > 0) {
    phrases.push(pluralise('registration', regCount));
  }
  if (docCount > 0) {
    phrases.push(pluralise('certificate', docCount));
  }
  return phrases.join(' and ');
};

var formatPageTitle = function (pageTitle) {
  var title = 'GOV.UK';
  if (typeof pageTitle !== 'undefined') {
    title = pageTitle + ' - ' + title;
  }
  return title;
};

module.exports = function (app) {
  if (typeof app === 'undefined') throw new Error('Please pass an app to this module!');
  app.locals.pluralise = pluralise;
  app.locals.titleCase = titleCase;
  app.locals.formatMoney = formatMoney;
  app.locals.epdqParams = epdqParams;
  app.locals.documentCount = documentCount;
  app.locals.registrationCount = registrationCount;
  app.locals.registrationsAndCertificates = registrationsAndCertificates;

  // govuk_template vars
  app.locals.assetPath = '/';
  app.locals.bodyClasses = '';
  app.locals.formatPageTitle = formatPageTitle;
  app.locals.govukRoot = 'https://gov.uk';
  app.locals.govukTemplateAssetPath = 'govuk_template/';
  app.locals.headerClass = '';
  app.locals.htmlLang = 'en';
};
