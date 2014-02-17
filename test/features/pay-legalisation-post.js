var app = require('./../../app'),
    browser,
    Browser = require('zombie'),
    EPDQ = require('epdq'),
    http = require('http'),
    port = (process.env.PORT || 1337),
    should = require('should');

Browser.dns.localhost('pay-legalisation-post.test.gov.uk');

describe("Pay to legalise a document by post", function(){

  beforeEach(function(done){
    browser = new Browser();
    browser.site = "http://pay-legalisation-post.test.gov.uk:"+port;
    done();
  });

  describe("start", function(){
    it("render the transaction intro page and generate the payment form when 'Calculate total' is clicked", function(done){
      browser.visit("/start", {}, function(err){

        should.not.exist(err);

        browser.text('#content header h1').should.equal('Pay to legalise documents by post');
        browser.fill('#transaction_document_count', '1');
        browser.choose('#transaction_postage_option_uk');

        browser.pressButton('Calculate total', function(err){

          should.not.exist(err);

          browser.text('#content .article-container .inner p:first-child').should.equal(
            'It costs £36.00 for 1 document plus Tracked courier service to the UK or British Forces Post Office postage.');

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
