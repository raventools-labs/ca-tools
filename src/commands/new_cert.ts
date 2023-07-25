import * as fs from 'fs';
import * as path from 'path';
import * as bip39 from 'bip39';
import { cmd } from '../lib/cmd';
import * as Config from '../config';

const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);

const init = async() => {

  const dataDir = path.join(Config.ca.data_path);

  if(Config.cert.domain) {

    const URL = Config.cert.domain;

    await cmd(`openssl genrsa -out ${dataDir}/private/${URL}.key.pem 2048`);
  
    process.env.SAN=`DNS:*.${URL},DNS:${URL}`;
  
    await cmd(`openssl req -config ${dataDir}/openssl.conf -key ${dataDir}/private/${URL}.key.pem -new -sha256 -out ${dataDir}/csr/${URL}.csr.pem -subj "/CN=*.${URL}/C=${Config.ca.country}/ST=${Config.ca.province}/L=${Config.ca.locality}/O=${Config.ca.organization}/OU=${Config.ca.oraganizational_unit}/" -batch`);

    const password:any = (await readFileAsync(path.join(dataDir, '.password'))).toString('utf8');
  
    await cmd(`openssl ca -config ${dataDir}/openssl.conf -extensions v3_req -days ${Config.cert.days_expires} -notext -md sha256 -in  ${dataDir}/csr/${URL}.csr.pem -out ${dataDir}/certs/${URL}.cert.pem -passin pass:"${password}" -batch`);

    console.log(await cmd(`openssl x509 -noout -text -in ${dataDir}/certs/${URL}.cert.pem`));

  } else{
    console.log('Wrong format: CERT_DOMAIN=${domain} npm run new-cert');
  }
}

init();