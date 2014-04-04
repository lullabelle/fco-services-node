var EPDQ = require('epdq'),
    should = require('should'),
    TransactionService = require('./../../lib/transaction_service');

var epdqRequest;

describe("TransactionService", function () {
  describe("getAccount", function () {
    it("should return the overseas account for some countries", function () {
      new TransactionService({account:'birth-death-marriage'}).getAccount('spain').should.equal('overseas');
    });
    it("should return the default account where no country is supplied", function () {
      new TransactionService({account:'birth-death-marriage'}).getAccount().should.equal('birth-death-marriage');
    });
    it("should return the default account for an irrelevant country", function () {
      new TransactionService({account:'birth-death-marriage'}).getAccount('scotland').should.equal('birth-death-marriage');
    });
    it("should return the default account for an irrelevant service", function () {
      new TransactionService({account:'legalisation-post'}).getAccount('spain').should.equal('legalisation-post');
    });
  });
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

      EPDQ.config.accounts['overseas'] = { pspId : 'foo' };

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
    it("should build a request with the correct account", function () {
      epdqRequest.account.pspId.should.equal('foo');
    });
  });
});
