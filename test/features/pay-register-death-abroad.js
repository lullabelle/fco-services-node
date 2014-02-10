var app = require('./../../app'),
    Browser = require('zombie'),
    browser = new Browser(),
    EPDQ = require('epdq'),
    http = require('http'),
    port = (process.env.PORT || 1337),
    request = require('request'),
    requestOptions = { headers: { 'host' : 'pay-register-death-abroad.service.gov.uk' } },
    should = require('should');

describe("Pay to register a death abroad", function(){
  beforeEach(function(done){
    EPDQ.config.pspId = 'woo';
    EPDQ.config.shaIn = 'moo';
    browser.headers = {'Host':'pay-register-death-abroad.service.gov.uk'};
    browser.site = "http://localhost:"+port;
    this.server = http.createServer(app).listen(port);
    done();
  });
  afterEach(function(done){
    this.server.close(done);
  });
  describe("start", function(){
    it("render the transaction intro page", function(done){
      browser.visit("/start", {}, function(err){
        should.not.exist(err);
        browser.text('#content header h1').should.equal('Payment to register a death abroad');
        browser.select('#transaction_registration_count','2');
        browser.select('#transaction_document_count', '2');
        browser.select('#transaction_postage', 'Yes');
        browser.pressButton('Calculate total', function(err){
          should.not.exist(err);
          browser.text('#content .article-container .inner p:first-child').should.equal(
            'The cost for 2 registrations and 2 certificates plus postage is £350.');
          done();
        });
      });
    });
  });
});
