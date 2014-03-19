var crypto = require('crypto'),
    EPDQ = require('epdq'),
    Transaction = require('./../models/transaction');

// Load overidden EPDQ config.
EPDQ.config = require('./../config/epdq.js').config;

var TransactionService = function (transaction) {
  this.transaction = transaction;
};

var OVERSEAS_ACCOUNT_COUNTRIES = ['american-samoa', 'belgium', 'france', 'french-polynesia',
      'french-guadeloupe', 'french-guiana', 'germany', 'greece', 'italy', 'liechtenstein', 'luxembourg',
      'martinique', 'mayotte', 'monaco', 'netherlands', 'portugal', 'reunion', 'spain',
      'st-pierre-and-miquelon', 'switzerland', 'wallis-and-futuna'];

var secureRandom = function (len) {
  return crypto.randomBytes(len).toString('hex');
};

var websiteRoot = function (req) {
  return req.protocol + '://' + req.host;
};

var transactionDoneUrl = function (req) {
  return websiteRoot(req) + '/done';
};
var epdqTemplateUrl = function () {
  return 'https://assets.digital.cabinet-office.gov.uk/templates/barclays_epdq.html';
};

var paramplusValue = function (params) {
  var vals = [];
  Transaction.PARAMPLUS_KEYS.forEach(function (key) {
    if (typeof params['transaction'][key] !== 'undefined') {
      vals.push(key + '=' + params['transaction'][key]);
    }
  });
  return vals.join('&');
};


/**
 * Middleware filter to find a transaction based on the subdomain
 */
TransactionService.findTransaction = function (req, res, next) {
  try {
    var name = null;
    if (req.subdomains.length) {
      name = req.subdomains[req.subdomains.length - 1];
    }
    res.locals.transaction = Transaction.find(name);
  } catch (err) {
    res.status(404);
    res.send('404 error');
    return;
  }
  next();
};

TransactionService.prototype.buildEpdqRequest = function (req, totalCost) {
  console.log(this.getAccount(req.body['transaction']['country_slug']));
  return new EPDQ.Request({
    account: this.getAccount(req.body['transaction']['country_slug']),
    orderid: secureRandom(15),
    amount: Math.round(totalCost * 100),
    currency: 'GBP',
    language: 'en_GB',
    accepturl: transactionDoneUrl(req),
    paramplus: paramplusValue(req.body),
    tp: epdqTemplateUrl()
  });
};

TransactionService.prototype.getAccount = function (country) {
  if (typeof country !== 'undefined' &&
      this.transaction.account === 'birth-death-marriage' &&
      OVERSEAS_ACCOUNT_COUNTRIES.indexOf(country) > -1) {
    return 'overseas';
  } else {
    return this.transaction.account;
  }
};

module.exports = TransactionService;
