exports.config = {
  shaIn : '00000000000000000000000000000000000000000',
  shaOut : '00000000000000000000000000000000000000000',
  shaType : 'sha1',
  pspId : 'pspid',
  testMode : (process.env['TEST_MODE'] !== 'false'),
  accounts : {
    'legalisation-post' : {
      pspId : (process.env['epdq_legalisation_post_pspid'] || 'pspid'),
      shaType : 'sha1',
      shaIn : (process.env['epdq_legalisation_post_shaIn'] || '00000000000000000000000000000000000000000'),
      shaOut : (process.env['epdq_legalisation_post_shaOut'] || '00000000000000000000000000000000000000000')
    },
    'legalisation-drop-off' : {
      pspId : (process.env['epdq_legalisation_dropoff_pspid'] || 'pspid'),
      shaType : 'sha1',
      shaIn : (process.env['epdq_legalisation_dropoff_shaIn'] || '00000000000000000000000000000000000000000'),
      shaOut : (process.env['epdq_legalisation_dropoff_shaOut'] || '00000000000000000000000000000000000000000')
    },
    'birth-death-marriage' : {
      pspId : (process.env['epdq_birth_pspid'] || 'pspid'),
      shaType : 'sha1',
      shaIn : (process.env['epdq_birth_shaIn'] || '00000000000000000000000000000000000000000'),
      shaOut : (process.env['epdq_birth_shaOut'] || '00000000000000000000000000000000000000000')
    }
  }
};
