import program from 'commander'
import mpay24 from 'mpay24-node'
import { h, render, Component, Text } from 'ink'
import parse from 'csv-parse'
import fs from 'fs'
import path from 'path'
import getBrand from './brandMapping'

let cmdValue = ''

program
  .version('0.1.0')
  .option('-m, --merchantid <merchantid>', 'Merchantid')
  .option('-p, --password <password>', 'SOAP Password')
  .option('-t, --test', 'Testmode')
  .arguments('<cmd>')
  .action(function(cmd) {
    cmdValue = cmd
  })

program.parse(process.argv)

if (program.merchantid === undefined) {
  console.error('Please provide a the merchantid')
  process.exit(1)
}

if (program.merchantid === undefined) {
  console.error('Please provide a the merchantid')
  process.exit(1)
}

if (typeof cmdValue === 'undefined') {
  console.error('Please provide a csv file')
  process.exit(1)
}

const env = program.test ? 'TEST' : 'LIVE'

console.log(`Importing csv: ${cmdValue}`)
console.log(`Importing profile to merchant ${program.merchantid}`)
console.log(`Connecting to ${env} environment`)

const main = async () => {
  await mpay24.init(program.merchantid, program.password, env)
  try {
    await mpay24.listProfiles()
  } catch (err) {
    console.error('Could not connect to mpay24. Please check your soap data')
    process.exit(1)
  }
  const parser = parse({ delimiter: ';', columns: true }, (err, data) => {
    render(<Import accounts={data} />)
  })
  fs.createReadStream(path.join(__dirname, '../' + cmdValue)).pipe(parser)
}

main()

class Import extends Component {
  constructor(props) {
    super(props)
    this.state = {
      numberOfImports: props.accounts.length,
      successCount: 0,
      updatedCount: 0,
      errorCount: 0
    }
  }

  render() {
    const {
      successCount,
      updatedCount,
      errorCount,
      numberOfImports,
      currentCustomer
    } = this.state
    return (
      <Text>
        <div>
          Creating profile {successCount + updatedCount + errorCount}/{numberOfImports}
        </div>
        <div>
          Created: <Text green>{successCount}</Text>
        </div>
        <div>
          Updated: <Text yellow>{updatedCount}</Text>
        </div>
        <div>
          Errors: <Text red>{errorCount}</Text>
        </div>
      </Text>
    )
  }
  async insertCustomer({ customerid, identifier, expiry }) {
    return await mpay24.createCustomer({
      pType: 'CC',
      paymentData: {
        brand: getBrand(identifier),
        identifier,
        expiry
      },
      customerID: customerid
    })
  }
  async startUpload() {
    for (var i = 0; i < this.state.numberOfImports; i++) {
      const r = await this.insertCustomer(this.props.accounts[i])

      if (r.returnCode === 'PROFILE_UPDATED') {
        this.setState({ updatedCount: this.state.updatedCount + 1 })
      } else if (r.status === 'OK') {
        this.setState({ successCount: this.state.successCount + 1 })
      } else {
        this.setState({ errorCount: this.state.errorCount + 1 })
      }
    }

    setTimeout(() => process.exit(0), 500)
  }
  componentDidMount() {
    this.startUpload()
  }
}
