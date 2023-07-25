import * as fs from 'fs';
import * as path from 'path';
import * as bip39 from 'bip39';
import { cmd } from '../lib/cmd';
import * as Config from '../config';

const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

const init = async() => {

  const dataDir = path.join(Config.ca.data_path);

  if(!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

  if (!fs.existsSync(path.join(dataDir, 'certs'))) {

    ['certs', 'csr', 'crl', 'newcerts', 'private'].forEach((directory) => {
      fs.mkdirSync(path.join(dataDir, directory));
    });

    fs.chmodSync(path.join(dataDir, 'private'), 0o700);

    fs.openSync(path.join(dataDir, 'index.txt'), 'w');
    fs.openSync(path.join(dataDir, 'index.txt.attr'), 'w');
    await writeFileAsync(path.join(dataDir, 'serial'), '1000');

    let opensslFile:any = (await readFileAsync(path.join(__dirname, '..', '..', 'template', 'openssl.conf'))).toString('utf8');

    opensslFile = opensslFile.replace(new RegExp("##DATADIR##", 'g'), dataDir);
    opensslFile = opensslFile.replace(new RegExp("##COUNTRYNAME##", 'g'), Config.ca.country);
    opensslFile = opensslFile.replace(new RegExp("##PROVINCENAME##", 'g'), Config.ca.province);
    opensslFile = opensslFile.replace(new RegExp("##LOCALITYNAME##", 'g'), Config.ca.locality);
    opensslFile = opensslFile.replace(new RegExp("##ORGANIZATIONNAME##", 'g'), Config.ca.organization);
    opensslFile = opensslFile.replace(new RegExp("##ORGANIZATIONALUNITNAME##", 'g'), Config.ca.oraganizational_unit);
    opensslFile = opensslFile.replace(new RegExp("##EMAILNAME##", 'g'), Config.ca.email);
    opensslFile = opensslFile.replace(new RegExp("##SUBJECTALTNAME##", 'g'), Config.ca.subject_alt_name);

    await writeFileAsync(path.join(dataDir, 'openssl.conf'), Buffer.from(opensslFile));

    process.env.SAN=`DNS:*.${Config.ca.subject_alt_name}`;

    const password = bip39.generateMnemonic();

    await writeFileAsync(path.join(dataDir, '.password'), password);

    await cmd(`openssl genrsa -aes256 -out ${dataDir}/private/ca.key.pem -passout pass:"${password}" 4096`);

    fs.chmodSync(path.join(dataDir, 'private', 'ca.key.pem'), 0o400);

    await cmd(`openssl req -config ${dataDir}/openssl.conf -key ${dataDir}/private/ca.key.pem -new -x509 -days 7300 -sha256 -extensions v3_ca -out ${dataDir}/certs/ca.cert.pem -passin pass:"${password}" -subj "/CN=${Config.ca.root_cn}/C=${Config.ca.country}/ST=${Config.ca.province}/L=${Config.ca.locality}/O=${Config.ca.organization}/OU=${Config.ca.oraganizational_unit}/" -batch`);
  
    fs.chmodSync(path.join(dataDir, 'certs', 'ca.cert.pem'), 0o400);

    console.log(await cmd(`openssl x509 -noout -text -in ${dataDir}/certs/ca.cert.pem`));
  }
  
}

init();