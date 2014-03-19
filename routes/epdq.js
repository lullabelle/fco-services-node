var EPDQ = require('epdq'),
    Transaction = require('./../models/transaction'),
    TransactionService = require('./../lib/transaction_service');

var journeyDescription = function (res, step) {
  return res.locals.transaction.slug + ':' + step;
};

/**
 * Cache control middleware filter.
 */
var setExpiry = function (req, res, next) {
  res.setHeader('Cache-Control', 'max-age=1800, public');
  next();
};

/**
 * EPDQ /start, /confirm and /done actions.
 *
 */
module.exports = {
  middleware : { setExpiry : setExpiry, findTransaction : TransactionService.findTransaction },
  middlewares : [ setExpiry, TransactionService.findTransaction ],

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
          transactionService = new TransactionService(res.locals.transaction),
          epdqRequest = transactionService.buildEpdqRequest(req, calculation.totalCost);

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
