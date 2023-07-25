const path = require('path');
require("dotenv").config();

const ca = {
  data_path: path.join(__dirname, '..', 'data'),
  country: process.env.CA_COUNTRY,
  province: process.env.CA_PROVINCE,
  locality: process.env.CA_LOCALITY,
  organization: process.env.CA_ORGANIZATION,
  oraganizational_unit: process.env.CA_ORGANIZATIONAL_UNIT,
  email: process.env.CA_EMAIL_ADDRESS,
  subject_alt_name: process.env.CA_SUBJECT_ALT_NAME,
  root_cn: process.env.CA_ROOT_CN
}

const cert = {
  domain: process.env.CERT_DOMAIN,
  days_expires: process.env.CERT_EXPIRE_DAYS ? Number.parseInt(process.env.CERT_EXPIRE_DAYS) : 3650
}

export { ca, cert }