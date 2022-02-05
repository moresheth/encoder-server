require('dotenv').config()

const compression                           = require('compression');
const express                               = require("express");
const bodyParser                            = require("body-parser");
const routes                                = require("./routes/");
const methodOverride                        = require('method-override');
const app                                   = express();

const startWebServer = () => {

// Support gzip
  app.use( compression() );
  app.set('trust proxy', 1) // trust first proxy

  app.use( bodyParser.urlencoded({ extended: true, limit: '1mb' }) );

  // Lets you use HTTP verbs such as PUT or DELETE in
  // places where the client doesn't support it.
  app.use( methodOverride( 'X-HTTP-Method' ) );          // Microsoft
  app.use( methodOverride( 'X-HTTP-Method-Override' ) ); // Google/GData
  app.use( methodOverride( 'X-Method-Override' ) );      // IBM
  app.use( methodOverride( '_method' ) );
  app.use( methodOverride( function ( req ) {
      if ( req.body && typeof req.body === 'object' && '_method' in req.body ) {
          // look in urlencoded POST bodies and delete it
          var method = req.body._method;
          delete req.body._method;
          return method;
      }
  }) );

  app.use( bodyParser.json({
    verify: (req, res, buf) => {
      req.rawBody = buf
    }
  }) );
  app.use(routes)

  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`Listening on port:${port}`);
  });

}
startWebServer();
