import fs from 'fs';

const serviceAccount = {
  "type": "service_account",
  "project_id": "gen-lang-client-0261437563",
  "private_key_id": "c17317469f52987083930a6a31c05e4e35674109",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC3Hs7XyIEIIgRP\nh26bIyQcVWFUk/q8hFFzY5gd3xYPu/dKIuvF/hvOt8lTqkZZA0tbWvoL3xlnTW9F\nloW4Zo8jDz2j5wfAj2fL78PB/CCWjK4SEidF4xvR4G1OnO2XAiJKOiujKuPGNfev\ntni3Sb4yLAXQVmNOGACOb7fnuDb+aCssLKv34jL8WjxFGxHsayeIKr7Q2K8sUD65\nN0oSDJGCr1fYwCjzfwyV7uJdVvTmHraeZCHg7ZWkHf52Uz9AYNtQ6XHZ1Sgxe2Zn\n0GK30jM2Z8JlyZXu/zPXUPtdhk3fmNj5ai6Uhxz/NFwtxTrYFx8cnVp7RwBMr/iJ\nCEvbtFhZAgMBAAECggEAE7Z2T9ZexZBb5G/Q4VR8G6y5SJCRil+4IPLUukp8pn72\nlP2DYhIDzlIMkzweTJDFOPVnO4XtxygX1WbpyDsKJ50JZq6FMB5/7v1FlolcvLgy\nOPHJVoWnRgWh3reYAAyTwmfWsL76PCktG7ZJ8nk2x1Hj4lSaZhrBXJP8OS6khOhl\nLzVfF504C7OwlZu/DUxJtouci0WO0jW1DDM9FPCp9npa7O72lAvQe6YEgPZ6OxPF\nTyP4/eePcWqI6B0yVVKNPdwLCikL/RzZBeXDOH/48sdDfvM8TTTY6x1PSEZV4xvs\nQ33gNXRerxpjr1IiCJ3Giw7rMiHq92andsUv49xtgQKBgQDg01EtWHYYUDcQ7v3b\ylHL20Dita4QXhJI1XXzqwJcdjGfAqim1eZa1LNG3tkgFRIBsoFw9KsoZLeIwRLF\nb9CxQnk1f08n73aax+LIL+bogc2jFTdmUfyZbMeU8WUDCF67XJF5LjOzBlUuIPta\nGzPsH3FRtdnzglVrrNY0aoHViQKBgQDQgxMTCMlWCioyzPCXc5X3BfLIcXOgAvJn\Lc4i592UHSKOXu58dGEMWE+Ye6lwwU0jIE8cHfztAz0CVIuJN7FrGlR6+fZf1IyA\nVwAa+Zjei4SqyqXhXS1YDMO77ZPFEr5UWovdcqRmZiCTVemBtotYHar0YF1MUPQV\nItuY6PeIUQKBgQDXm5BkDkvi8Tp98NRfbd2XxMKrKFSvuaeLVbryXXO8PFVGCwS2\SrfJL+Zl9tz/GXXVTt03+EwURtKEQbTAx4S6Geen2FmPEOULdtoT5WxqWeFdnsEs\TUAT2vBj9ERM7j/7KsEQF7DY5R/XRyYFucTHkzfXhrBoCPvmcTBTwDiXEQKBgQCL\nOSnQSMqeT3UzrFFs3rmgUfF00wPgMHeIWzZLakQx9G4xX8Ofh9mQ85pZ9yAA8KC/\ntn/8By3tV38yAh+VRIGLQO5tml9eRz51JyIj4MqotcGkhGDUJHH1W7iJz60eJlC9\nZCQFfdm1obVYi0G54ZgTAuQ1/e3t2hPP1RGJfOxisQKBgCfUE0cYP9L0ZGSDB3X4\n2Q1ytsd9wG2RznVJ+DgWdkNJee4zjNe4MsQBND0t78hfQ+c7mcAGWxrGhc4iKLov\nN6wB3L+JLdYWIM0yh69I8p7GdvK0Y5USN1IVACRdLPH/cHM/jMONrCTI3wz9VJxj\nDmBfpOyt7y3+Aiy0LoyV1Hvw\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@gen-lang-client-0261437563.iam.gserviceaccount.com",
  "client_id": "101627112659929414064",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40gen-lang-client-0261437563.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

fs.writeFileSync('serviceAccountKey.json', JSON.stringify(serviceAccount, null, 2));
console.log('Successfully generated serviceAccountKey.json');
