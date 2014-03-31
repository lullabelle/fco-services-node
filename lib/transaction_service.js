var crypto = require('crypto'),
    EPDQ = require('epdq'),
    fs = require('fs'),
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

var _overseasData = null;

var overseasData = function () {
  if (_overseasData === null) {
    var jsonFile = __dirname + '/overseas_payments.json',
        data = fs.readFileSync(jsonFile, { encoding: 'utf8' });

    _overseasData = JSON.parse(data);
  }
  return _overseasData;
};

var overseasCountries = function () {
  return overseasData()['overseas_payments_countries'];
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
  return new EPDQ.Request({
    account: this.getAccount(req.body['transaction']['country']),
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
      overseasCountries().indexOf(country) > -1) {
    return 'overseas';
  } else {
    return this.transaction.account;
  }
};

TransactionService.prototype.calculateTotal = function (values) {
  return new TransactionCalculator(this.transaction).calculate(values);
};
module.exports = TransactionService;
