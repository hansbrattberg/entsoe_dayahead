import axios from 'axios'
import convert from 'xml-js'
import moment from 'moment'

// https://transparency.entsoe.eu/content/static_content/Static%20content/web%20api/Guide.html
const priceAreaCode = {}
priceAreaCode['SE1'] = '10Y1001A1001A44P'
priceAreaCode['SE2'] = '10Y1001A1001A45N'
priceAreaCode['SE3'] = '10Y1001A1001A46L'
priceAreaCode['SE4'] = '10Y1001A1001A47J'

const documentType = 'A44'   // Price Document

const securityToken = '2db036cb-892a-41da-b854-30fe5bf08553'   // send an email to transparency@entsoe.eu with headline "Restful API access" to get a token
const in_Domain = priceAreaCode['SE3']
const out_Domain = in_Domain

const x = moment().startOf('day')
const periodStart = now.utc().format('YYYYMMDD2300')  // 23 winter time, works also for summer when the result will be from 22
const periodEnd = now.utc().add(1, 'day').format('YYYYMMDD2300')

const params =
    'securityToken=' + securityToken +
    '&' + 'documentType=' + documentType +
    '&' + 'in_Domain=' + in_Domain +
    '&' + 'out_Domain=' + out_Domain +
    '&' + 'periodStart=' + periodStart +
    '&' + 'periodEnd=' + periodEnd

const url = 'https://transparency.entsoe.eu/api?' + params
console.log(url)

axios.get(url)
    .then(res => {
        console.log('Status Code:', res.status)

        const json = convert.xml2json(res.data, {compact: true, spaces: 4})
        console.log(JSON.parse(json).Publication_MarketDocument.TimeSeries.Period.timeInterval)

        for (let i = 0; i < 24; i++) {
            console.log(JSON.parse(json).Publication_MarketDocument.TimeSeries.Period.Point[i])
        }
    })
    .catch(err => {
        console.log('Message: ', err.message);
    });