/*
 * Require and export siblings.
 */
exports.healthcheck = require('./healthcheck').healthcheck;
exports.epdq = require('./epdq');

/*
 * GET home page.
 */
exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};
