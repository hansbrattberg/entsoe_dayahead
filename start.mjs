import axios from 'axios'
import convert from 'xml-js'
import moment from 'moment'


// TODO
// verify the date according to time zones and summer/winder
// more price areas
// split function and return array of days with prices for each hour

function get_day_ahead_prices_including_today(securityToken, price_area) {
    const priceAreaCode = {}
    priceAreaCode['SE1'] = '10Y1001A1001A44P'
    priceAreaCode['SE2'] = '10Y1001A1001A45N'
    priceAreaCode['SE3'] = '10Y1001A1001A46L'
    priceAreaCode['SE4'] = '10Y1001A1001A47J'
    const documentType = 'A44'   // Price Document

    const in_Domain = priceAreaCode[price_area]
    const out_Domain = in_Domain

    const today = moment().startOf('day')
    const periodStart = today.utc().format('YYYYMMDD2300')  // 23 winter time, works also for summer when the result will be from 22
    const periodEnd = today.utc().add(1, 'day').format('YYYYMMDD2300')

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

            let time_series = JSON.parse(json).Publication_MarketDocument.TimeSeries
            let multiple_days_in_result = time_series instanceof Array
            if (multiple_days_in_result) {
                for (let k = 0; k < time_series.length; k++) {
                    print_one_day_of_price_data(time_series[k])
                }
            } else {
                print_one_day_of_price_data(time_series)
            }
        })
        .catch(err => {
            console.log('Message: ', err.message)
        });
}

function print_one_day_of_price_data(time_series) {
    console.log(time_series.Period.timeInterval)
    for (let i = 0; i < 24; i++) {
        console.log(time_series.Period.Point[i])
    }
}

if (process.argv[2] === undefined) {
    console.log("Please provide a securityToken as the first parameter, that you get from entsoe!")
} else {
    const securityToken = process.argv[2]
    get_day_ahead_prices_including_today(securityToken, 'SE3')
}
