const functions      = require('firebase-functions');
const admin          = require("firebase-admin");

const serviceAccount = {
    "type": "service_account",
    "project_id": "clan-chat-test",
    "private_key_id": "e0ac1786c71e921cb99dc3c8858696812446292b",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC4fM8H/gztnLDx\nKy6GNXXAnhr52aD1lcKVPWpILkaqxOu7pYuvwVDF0x9wxmFOhz40/GG3l+KRqSUv\nruEgf6x3fwi/QiIYyQSmYGTCjO01PR7f3RhbmRNEWHCkyuYz/pE2EJJv5Grvo4KC\n5v5q5Fv/ylZ8eNPgv3004MDccMGJA17xG1PjuS4jzrOWYodZzEUoRXs+TmrUZ0cj\nvPpE7fGr7U8vgHnTwP+SCKlMH6JxQpu592cabM07mWMZmzOYNIxme+rW84nl/T5z\nbWI4mnEvYpTUtU7UjIoam8+VTZKVVSsfYuPVorOVo/WWfv/vtOPy69TrxxCe+jLz\nZ7Uk7ZuNAgMBAAECggEAC29vDMWGSx8sh5Jf5KFBLoKOVQDUnYxeHo6LPTSjHDgv\nDXdOMIN4zH5Q41Zkly/CXxnqu6zONi2oGKvMGA3Z5KFK60H/543kPCTa8gU2uddT\nR9iGRz02iMS7nLdX7A6iNRnzXbyolTiLIS6MxBbqDfGeiUIbDgIIkoPA6JkTofio\nuixJ0PD8pkOQrWQYWsdvgkNwJdVeU/jZYT4y0LEW/p7tXmu2RnRrYLRj1ek468MQ\neDnDs+t8vM8RzNCUjsMQlc7MXCnkzWNiP7uumN9FoIPoDBecW438RsK7h3mmw1mx\n9v7Wrn8LBDKmiNTJ2WzvmelS6cvR5vGskKWSFo2qYQKBgQDs0aglkFlK/MzoNtxT\nZFgdBYJAkepxmHe+FPO6LgSHdTjOk4cUw5QiqkKe+iAnzQ59DLGy+nPO+C83tpBW\nZvE/QDF3SAAdnfUK1JzShpwJAsyuLYdsITZq4GIrO+Yl090SlNUogBrswKs/nD97\nRe/I51YeB/P1VO9ngyx5+uiz7QKBgQDHbhTLZwiBYMAp34/siM5Vv8tRJ3dTeNUn\nyB7v54b7mgM61z0cxQMztOJphgA+8omXQv3FicEV0FqMsien94OHEoKXSu/lYvoP\nmPVP7qBl4yp/GMLx7M3afUr4QxV0CMs202KBUcxPML+h3BrEQHpxH5kg5YLvAGY8\nLOcJz+7SIQKBgQCK8mgpwgviB3liNe4Hr7RTMsw9fl+DzuVSzZBDCIT3xTtTWRPE\nhwv/Ws5D4JXFRHbfv/bzACe6o7twgNknGLcrWUqspb4LooYHmL96dihO0SmueGAg\nfUwkYQq4OyjJwQjQwipe3OrvRgw0AkTs2xfZVIIelKP6qZ7dqQULfL/T8QKBgG+F\nN0unCjKPD+ZahfkXZ4q7/c4b67ZZ05izZ9lv9yOrNDMrOZlk8i1v8UxhCrIonphf\nddmI9thj8r7KwTJETuCxkSVZWl1Dw+IE/uj73+YZ6iG4jwsKCPMtLUc2/EAuyrSV\n8Hewbje6Yu74Tl+ATvgDW3Xx4g4UgxcTZP8vr7UBAoGBAKUR2cBekKxdF3qp9UxC\nEexzdwO93nHWjTpoi28Iofd2pZqCoAMmgk7Xrt5noMoBs5YYkOv1XD9GxcCjaOLI\nq1lGgTJzy3QxGxbnxtFNOjLw7CK5xlVfJlftVu7W3KoOTPNyUbEEJbiTbgeq91WS\nY6NZINfb+/aKI62bqGHSQFW+\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-l2zcf@clan-chat-test.iam.gserviceaccount.com",
    "client_id": "109883090649473391109",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-l2zcf%40clan-chat-test.iam.gserviceaccount.com"
  }

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://clan-chat-test.firebaseio.com"
});

const db = admin.database();

exports.execute = functions.https.onRequest((request, response) => {

    let body     = request.body;
    let playerId = body.PlayerId;  
    let titleId  = body.TitleId;
    let funcName = body.FunctionName;
    let args     = body;

    let serverRef = db.ref(titleId);

    serverRef
    .child("server_runtime")
    .child('current')
    .child('source')
    .once( 'value', snap => { 
 
      let cloudScript = requireFromString(snap.val());

      try {
        
        cloudScript.Init(titleId, playerId, db, response, () => {

          let handlers = cloudScript.Commands;
          if (funcName in handlers){
            handlers[funcName](args);
          }
          else {
            response.status(404).send("handler not found");
          }
        });
        
      }
      catch(e){
        console.log(e);
        response.send(e.stack);
      }
      
    });
});

exports.deploy = functions.https.onRequest((request, response) => {

    let body    = request.body;
    let source  = body.source;
    let titleId = body.titleId;

    let server = db.ref(titleId);
    
    try { 
      requireFromString(source);
    }
    catch (e){
      response.send(e.stack);
      return;
    }
    
    server
    .child("server_runtime")
    .child('current')
    .child('source')
    .set(source);

    response.send({Success : true});
});

function requireFromString(src) {

  let Module = require("module");
  let m = new Module();
  m.paths = module.paths;
  m._compile(src, "main.js");   // compile code again
  return m.exports;
}

