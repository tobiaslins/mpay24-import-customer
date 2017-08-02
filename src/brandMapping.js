import creditCardType from 'credit-card-type'

const brands = {
  visa: 'VISA',
  'master-card': 'MASTERCARD',
  'american-express': 'AMEX',
  'diners-club': 'DINERS',
  discover: 'DINERS',
  jcb: 'JCB'
}

const getBrand = identifier => brands[creditCardType(identifier)[0].type]

export default getBrand
