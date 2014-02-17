var app = require('./../../app'),
    browser,
    Browser = require('zombie'),
    port = (process.env.PORT || 1337),
    should = require('should');

Browser.dns.localhost('pay-foreign-marriage-certificates.test.gov.uk');

describe("Payment for certificates to get married abroad", function(){

  beforeEach(function(done){
    browser = new Browser();
    browser.site = "http://pay-foreign-marriage-certificates.test.gov.uk:"+port;
    done();
  });

  describe("start", function(){
    it("render the transaction intro page and generate the payment form when 'Calculate total' is clicked", function(done){
      browser.visit("/start", {}, function(err){

        should.not.exist(err);

        browser.text('#content header h1').should.equal('Payment for certificates to get married abroad');

        browser.choose('#transaction_document_type_certificate-of-no-impediment');
        browser.select('#transaction_document_count', '2');
        browser.select('#transaction_postage', 'Yes');

        browser.pressButton('Calculate total', function(err){

          should.not.exist(err);

          browser.text('#content .article-container .inner p:first-child').should.equal(
            'The cost of 2 certificates of no impediment plus postage is £140.00.');

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
