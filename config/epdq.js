exports.config = {
  shaIn : (process.env["epdq_shaIn"] || "00000000000000000000000000000000000000000"),
  shaOut : (process.env["epdq_shaOut"] || "00000000000000000000000000000000000000000"),
  shaType : 'sha1',
  pspId : (process.env["epdq_pspid"] || 'pspid'),
  testMode : true,
  accounts : {
    'legalisation-post' : {
      pspId : (process.env["epdq_legalisation_pspid"] || 'pspid'),
      shaType : 'sha1',
      shaIn : (process.env["epdq_legalisation_post_shaIn"] || "00000000000000000000000000000000000000000"),
      shaOut : (process.env["epdq_legalisation_post_shaOut"] || "00000000000000000000000000000000000000000"),
      testMode : true
    },
    'legalisation-drop-off' : {
      pspId : (process.env["epdq_pspid"] || 'pspid'),
      shaType : 'sha1',
      shaIn : (process.env["epdq_legalisation_dropoff_shaIn"] || "00000000000000000000000000000000000000000"),
      shaOut : (process.env["epdq_legalisation_dropoff_shaOut"] || "00000000000000000000000000000000000000000"),
      testMode : true
    },
    'birth-death-marriage' : {
      pspId : (process.env["epdq_birth_pspid"] || 'pspid'),
      shaType : 'sha1',
      shaIn : (process.env["epdq_birth_shaIn"] || "00000000000000000000000000000000000000000"),
      shaOut : (process.env["epdq_birth_shaOut"] || "00000000000000000000000000000000000000000"),
      testMode : true
    }
  }
};
