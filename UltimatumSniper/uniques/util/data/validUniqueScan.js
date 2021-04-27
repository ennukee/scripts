const { default: axios } = require("axios")
const { ultimatumUniqueQuery } = require('../tradequery')
const fs = require('fs')
const path = require('path');
const divPriceData = require('./results/uniquePriceData.json')

const TRADE_BASE_URL = 'https://www.pathofexile.com/api/trade/search/Ultimatum'

const main = async () => {
    const worthwhileUniques = divPriceData.filter(unique => unique.chaosValue > 70 && unique.chaosValue < 400)
    const uniquesWithUltimates = []
    for(let i = 0; i < worthwhileUniques.length; i += 1) {
        const unique = worthwhileUniques[i]
        console.log(`Checking unique ${unique.name} (value ${unique.chaosValue}c${unique.exaltValue ? ` / ${unique.exaltValue}ex` : ''})`)
        const resp = await axios.post(TRADE_BASE_URL, ultimatumUniqueQuery(unique.chaosValue, unique.name, -2000))
        if (resp.data.total > 0) {
            uniquesWithUltimates.push(unique.name)
        }
        await new Promise(resolve => setTimeout(() => resolve(), 15000))
    }

    // eslint-disable-next-line no-undef
    const filepath = path.join(__dirname, 'results', 'validUniquesToCheck.json')
    fs.writeFile(filepath, JSON.stringify(uniquesWithUltimates, null, 2), (error) => console.log(error))
}
  
main()