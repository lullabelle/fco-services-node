var crypto = require('crypto'),
    EPDQ = require('epdq'),
    Transaction = require('./../models/transaction');

// Load overidden EPDQ config.
EPDQ.config = require('./../config/epdq.js').config;

var journeyDescription = function (res, step) {
  return res.locals.transaction.slug + ':' + step;
};

// Middleware filter.
var findTransaction = function (req, res, next) {
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
var setExpiry = function (req, res, next) {
  res.setHeader('Cache-Control', 'max-age=1800, public');
  next();
};

var secureRandom = function (len) {
  return crypto.randomBytes(len).toString('hex');
};

var websiteRoot = function (req) {
  var port = req.app.settings.port,
      rootUrl = req.protocol + '://' + req.host;

  if (port !== 80) {
    rootUrl += ':' + req.app.settings.port;
  }
  return rootUrl;
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

var buildEpdqRequest = function (req, transaction, totalCost) {
  return new EPDQ.Request({
    account: transaction.account,
    orderid: secureRandom(15),
    amount: Math.round(totalCost * 100),
    currency: 'GBP',
    language: 'en_GB',
    accepturl: transactionDoneUrl(req),
    paramplus: paramplusValue(req.body),
    tp: epdqTemplateUrl()
  });
};


/**
 * EPDQ /start, /confirm and /done actions.
 *
 */
module.exports = {
  middleware : { setExpiry : setExpiry, findTransaction : findTransaction },
  middlewares : [ setExpiry, findTransaction ],

  rootRedirect : function (req, res) {
    res.redirect('https://www.gov.uk/' + res.locals.transaction.slug);
  },

  start : function (req, res) {
    res.render('start', {
      transaction : res.locals.transaction,
      journeyDescription : journeyDescription(res, 'start')
    });
  },

  confirm : function (req, res) {
    try {
      var calculation = res.locals.transaction.calculateTotal(req.body['transaction']),
          epdqRequest = buildEpdqRequest(req, res.locals.transaction, calculation.totalCost);
      res.render('confirm', {
        calculation: calculation,
        epdqRequest: epdqRequest,
        transaction: res.locals.transaction,
        journeyDescription: journeyDescription(res, 'confirm')
      });
    } catch (err) {
      res.render('start', { errors: err.message, journeyDescription: journeyDescription(res, 'invalid_form') });
    }
  },

  done : function (req, res) {
    var epdqResponse = new EPDQ.Response(req.query, res.locals.transaction.account, Transaction.PARAMPLUS_KEYS);
    if (epdqResponse.isValidShasign()) {
      res.render('done', { epdqResponse: epdqResponse, journeyDescription: journeyDescription(res, 'done') });
    } else {
      res.render('payment_error', { journeyDescription: journeyDescription(res, 'payment_error') });
    }
  }
};
