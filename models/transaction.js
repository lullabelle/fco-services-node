var fs = require('fs');

var Transaction = function (opts) {
  var _self = this,
      attrs = ['slug', 'title', 'document_cost', 'document_types',
               'postage_cost', 'postage_options', 'registration', 'registration_cost',
               'account', 'allow_zero_document_count'];

  attrs.forEach(function (attr) {
    _self[attr] = opts[attr];
  });
};

Transaction.PARAMPLUS_KEYS = ['document_count', 'postage', 'postage_option', 'registration_count'];


Transaction.find = function (id) {
  var transaction;
  if (transaction = Transaction.transactions()[id]) {
    transaction['slug'] = id;
    return new Transaction(transaction);
  } else {
    throw new Error('Transaction not found');
  }
};

Transaction._transactions = null;

Transaction.transactions = function () {
  if (Transaction._transactions === null) {
    var jsonFile = __dirname + '/../lib/transactions.json',
        data = fs.readFileSync(jsonFile, { encoding: 'utf8' });

    Transaction._transactions = JSON.parse(data);
  }
  return Transaction._transactions;
};

module.exports = Transaction;
