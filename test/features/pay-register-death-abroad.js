var app = require('./../../app'),
    Browser = require('zombie'),
    browser = new Browser(),
    EPDQ = require('epdq'),
    http = require('http'),
    port = (process.env.PORT || 1337),
    should = require('should');

describe("Pay to register a death abroad", function(){

  beforeEach(function(done){
    browser.headers = {'Host':'pay-register-death-abroad.service.gov.uk'};
    browser.site = "http://localhost:"+port;
    this.server = http.createServer(app).listen(port);
    done();
  });

  afterEach(function(done){
    this.server.close(done);
  });

  describe("start", function(){
    it("render the transaction intro page and generate the payment form when 'Calculate total' is clicked", function(done){
      browser.visit("/start", {}, function(err){

        should.not.exist(err);

        browser.text('#content header h1').should.equal('Payment to register a death abroad');
        browser.select('#transaction_registration_count','2');
        browser.select('#transaction_document_count', '2');
        browser.select('#transaction_postage', 'Yes');

        browser.pressButton('Calculate total', function(err){

          should.not.exist(err);

          browser.text('#content .article-container .inner p:first-child').should.equal(
            'The cost for 2 registrations and 2 certificates plus postage is £350.00.');

          browser.query("form").action.should.match(/https:\/\/mdepayments\.epdq\.co\.uk/);
          browser.query("form").method.should.equal("post");

          browser.field("input[name='ORDERID']").should.exist;
          browser.field("input[name='PSPID']").should.exist;
          browser.field("input[name='SHASIGN']").should.exist;
          browser.field("input[name='AMOUNT']").should.exist;
          browser.field("input[name='CURRENCY']").should.exist;
          browser.field("input[name='LANGUAGE']").should.exist;
          browser.field("input[name='ACCEPTURL']").should.exist;

          browser.button("Pay").should.exist;

          done();
        });
      });
    });
  });
});
