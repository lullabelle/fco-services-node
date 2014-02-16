var app = require('./../../app'),
    should = require('should'),
    Transaction = require('./../../models/transaction');

describe("Transaction", function(){
  describe("find", function(){
    it("should return the configured transaction if it exists ", function(){
      var trans = Transaction.find('pay-register-death-abroad');
      trans.slug.should.equal('pay-register-death-abroad');
      trans.title.should.equal('Payment to register a death abroad');
      trans.document_cost.should.equal(65);
      trans.postage_cost.should.equal(10);
      trans.registration.should.be.ok;
      trans.account.should.equal('birth-death-marriage');
    });
  });
});
