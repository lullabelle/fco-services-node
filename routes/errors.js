/*jshint unused:false */
module.exports = {
  error404 : function (req, res, next) {
    res.status(404);

    if (req.accepts('html')) {
      res.render('404', {
        journeyDescription: null,
        transaction : { title : 'Page not found 404' }
      });
    }
  },

  error500 : function (error, req, res, next) {
    var msg = 'Sorry, we are experiencing technical difficulties (500 error)';

    res.status(500);

    if (req.accepts('html')) {
      res.render('500', {
        journeyDescription: null,
        transaction : { title : msg }
      });
    }
  }
};
