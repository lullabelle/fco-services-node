var app = require('./../../app'),
    request = require('supertest'),
    should = require('should');

describe("GET /", function(){
  it("should respond successfully", function(done){
    request(app)
      .get("/")
      .set("host", "pay-register-birth-abroad.test.gov.uk")
      .expect(302)
      .end(function(err, res){
        should.not.exist(err);
        res.text.should.equal("Moved Temporarily. Redirecting to https://www.gov.uk/pay-register-birth-abroad");
        done();
      });
  });
});
