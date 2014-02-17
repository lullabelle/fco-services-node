var app = require('./../../app'),
    fs = require('fs'),
    should = require('should'),
    sinon = require('sinon'),
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
    it("should only load the transactions data once",function(){
      var spy = sinon.spy(fs, 'readFileSync');
      Transaction._transactions = null;
      Transaction.transactions();
      Transaction.transactions();
      spy.calledOnce.should.be.ok;
    });
  });
});
