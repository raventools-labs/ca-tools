# CA Tools

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file
```env
CA_URL=ca.raventools.labs
CA_COUNTRY=ES
CA_PROVINCE=Madrid
CA_LOCALITY=Madrid
CA_SUBJECT_ALT_NAME=raventools.labs
CA_ORGANIZATION=Raventools Labs
CA_ORGANIZATIONAL_UNIT=raventoolslabs.com
CA_EMAIL_ADDRESS=
CA_ROOT_CN=Raventools Labs CA
```

## Installation

```bash
  npm install
  npm run init
```
    
## Usage/Examples

```javascript
  CERT_DOMAIN=subdomain.raventools.labs npm run new-cert

```

