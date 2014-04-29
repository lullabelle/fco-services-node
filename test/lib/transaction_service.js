var EPDQ = require('epdq'),
    should = require('should'),
    TransactionService = require('./../../lib/transaction_service');

var epdqRequest;

describe("TransactionService", function () {
  describe("buildEpdqRequest", function () {
    before(function () {
      var req = {
        protocol : 'http',
        host : 'test.dev.gov.uk',
        body : { 'transaction' : {
            'country' : 'spain',
            'document_count' : '2',
            'postage' : 'yes'
        } }
      };

      epdqRequest = new TransactionService({account:'birth-death-marriage'}).buildEpdqRequest(req, 35);
    });
    it("should construct the correct accepturl", function () {
      epdqRequest.parameters.accepturl.should.equal('http://test.dev.gov.uk/done');
    });
    it("should populate the correct amount", function () {
      epdqRequest.parameters.amount.should.equal(3500);
    });
    it("should construct the paramplus value", function () {
      epdqRequest.parameters.paramplus.should.equal('document_count=2&postage=yes');
    });
    it("should populate the payment template url", function () {
      epdqRequest.parameters.tp.should.equal('https://assets.digital.cabinet-office.gov.uk/templates/barclays_epdq.html');
    });
  });
});
