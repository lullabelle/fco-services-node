var crypto = require('crypto'),
    EPDQ = require('epdq'),
    Transaction = require('./../models/transaction'),
    TransactionCalculator = require('./transaction_calculator');

// Load overidden EPDQ config.
EPDQ.config = require('./../config/epdq.js').config;

var TransactionService = function (transaction) {
  this.transaction = transaction;
};

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
    if (req.subdomains.length > 1) {
      name = req.subdomains[1];
    }
    res.locals.transaction = Transaction.find(name);
    res.locals.pageTitle = res.locals.transaction.title;
  } catch (err) {
    res.status(404);
    res.locals.pageTitle = 'Page not found 404';
    res.locals.journeyDescription = 'page_not_found_404';
    res.render('404');
    return;
  }
  next();
};

TransactionService.prototype.buildEpdqRequest = function (req, totalCost) {
  return new EPDQ.Request({
    account: this.transaction.account,
    orderid: secureRandom(15),
    amount: Math.round(totalCost * 100),
    currency: 'GBP',
    language: 'en_GB',
    accepturl: transactionDoneUrl(req),
    paramplus: paramplusValue(req.body),
    tp: epdqTemplateUrl()
  });
};

TransactionService.prototype.calculateTotal = function (values) {
  return new TransactionCalculator(this.transaction).calculate(values);
};
module.exports = TransactionService;
