# FCO-Services

## A port of FCO-Services to Express/NodeJS

This app contains transaction start and done pages for the FCO payment transactions. These wrap around the existing Barclaycard EPDQ service.

## Routing

This application uses subdomain based routing to route to the individual transactions.  The start page for the transactions can be found at `<slug>.*/start` (e.g. with development config below they're at `<slug>.service.dev.gov.uk/start`).  The available slugs can be found in `lib/transactions.json`.

## Development configuration

  1. Edit ```/etc/hosts``` and add the following entries:
    ```
      127.0.0.1   pay-legalisation-drop-off.service.dev.gov.uk
      127.0.0.1   pay-legalisation-post.service.dev.gov.uk
      127.0.0.1   pay-register-birth-abroad.service.dev.gov.uk
      127.0.0.1   pay-register-death-abroad.service.dev.gov.uk
      127.0.0.1   pay-foreign-marriage-certificates.service.dev.gov.uk
    ```
  2. Export/Start the app with the appropriate environment variables to configure ePDQ transactions. These are:
      ```epdq_birth_pspid``` - the pre-shared merchant key for ePDQ (birth-death-marriage) transactions.
      ```epdq_birth_shaIn``` - the inbound sha for ePDQ requests.
      ```epdq_birth_shaOut``` - the outbound sha from ePDQ responses.

      There are corresponding configuration variables for [legalisation drop off](https://github.com/alphagov/fco-services-node/blob/master/config/epdq.js#L15) and [legalisation by post](https://github.com/alphagov/fco-services-node/blob/master/config/epdq.js#L9) services, see [the alphagov-deployment config](https://github.gds/gds/alphagov-deployment/blob/master/fco-services/initializers_by_organisation/preview/epdq.rb) for values.

      ```$ epdq_legalisation_post_pspid=foo epdq_legalisation_post_shaIn=bar epdq_legalisation_post_shaOut=baz node app.js```

      [http://pay-register-birth-abroad.service.dev.gov.uk:1337/start](http://pay-register-birth-abroad.service.dev.gov.uk:1337/start)

## Tests

```$ npm test```
