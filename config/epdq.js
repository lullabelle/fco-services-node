exports.config = function () {
  return {
    shaIn : '00000000000000000000000000000000000000000',
    shaOut : '00000000000000000000000000000000000000000',
    shaType : 'sha1',
    pspId : 'pspid',
    testMode : true,
    accounts : {
      'legalisation-post' : {
        pspId : (process.env["epdq_legalisation_post_pspid"] || 'pspid'),
        shaType : 'sha1',
        shaIn : (process.env["epdq_legalisation_post_shaIn"] || "00000000000000000000000000000000000000000"),
        shaOut : (process.env["epdq_legalisation_post_shaOut"] || "00000000000000000000000000000000000000000"),
        testMode : true
      },
      'legalisation-drop-off' : {
        pspId : (process.env["epdq_legalisation_dropoff_pspid"] || 'pspid'),
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
  }
};
