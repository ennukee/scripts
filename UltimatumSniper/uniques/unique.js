const { default: axios } = require("axios")
const fs = require('fs')
const path = require('path');
const { ultimatumUniqueQuery } = require('./util/tradequery')
const validUniquesToCheck = require('./util/data/results/validUniquesToCheck.json')
const uniquePriceData = require('./util/data/results/uniquePriceData.json')

const TRADE_BASE_URL = 'https://www.pathofexile.com/api/trade/search/Ultimatum'
const EXALT_PRICE = 130
const PROFIT_MARGIN = 0.5

const wait = (ms) => new Promise(resolve => setTimeout(() => resolve(), ms))

const writeTradesToFile = (output, cutEarly = false) => {
  if (cutEarly) {
    console.log('\x1b[31m%s\x1b[0m', '%cWARNING: OUTPUT WAS CUT EARLY BY AN ERROR IN REQUEST')
  }
  console.log('Outputting trades to file...')
  output.sort((a, b) => b["Profit made"] - a["Profit made"])

  // eslint-disable-next-line no-undef
  const filepath = path.join(__dirname, `./unique_output${cutEarly ? '_cutearly' : ''}.json`)
  fs.writeFile(filepath, JSON.stringify(output, null, 2), (error) => console.log(error))
  console.log('Saved to', filepath)
}

const main = async () => {
  const trades = []
  for (let i = 0; i < validUniquesToCheck.length; i += 1) {
    const uniqueName = validUniquesToCheck[i]
    const unique = uniquePriceData.find(uniq => uniq.name === uniqueName)

    let hashedTrades
    try {
      hashedTrades = await axios.post(
        TRADE_BASE_URL,
        ultimatumUniqueQuery(
          unique.chaosValue,
          unique.name,
          PROFIT_MARGIN
        )
      )
    } catch (result) {
      writeTradesToFile(trades, true)
      console.log('ERROR OUTPUT')
      console.log(result)
      return
    }

    await wait(15000)
    if (hashedTrades && hashedTrades.data.result.length === 0) {
      continue
    }

    const requestURLforCurrentCard = 
      `https://www.pathofexile.com/api/trade/fetch/${hashedTrades.data.result.slice(0,9).join(',')}?query=${hashedTrades.data.id}`
    console.log(requestURLforCurrentCard)

    try {
      const tradeResp = await axios.get(requestURLforCurrentCard)
      const tradeData = tradeResp.data.result
        .filter(trade => {
          // Ignore trades older than half a day
          const timestamp = trade.listing.indexed
          const timeElapsed = (new Date() - new Date(Date.parse(timestamp))) / (1000 * 3600 * 24)
          return timeElapsed < 0.5
        })
        .map(trade => {
          const {
            whisper,
            account: { name: userName, lastCharacterName },
            price: { amount, currency },
          } = trade.listing
          const item = trade.item

          const challenge = item.properties.find(field => field.name === 'Challenge').values[0][0]
          const sacrifice = item.properties.find(field => field.name === 'Requires Sacrifice: {0}').values[0][0]
          const sacrificeCost = uniquePriceData.find(uniq => uniq.name === sacrifice)?.chaosValue || -1

          
          const chaosPrice = currency === 'exalted'
            ? amount * EXALT_PRICE
            : amount

          console.log(sacrifice)
          console.log(sacrificeCost)
          console.log(chaosPrice)
          console.log(unique.chaosValue)
          
          return ({
            Challenge: challenge,
            "Unique sacrificed": {
              name: sacrifice,
              cost: sacrificeCost,
            },
            "Unique you create": {
              name: uniqueName,
              cost: unique.chaosValue
            },
            "Ultimatum Price": chaosPrice,
            "Profit made": (unique.chaosValue) - chaosPrice - sacrificeCost,
            Seller: {
              Username: userName,
              "Last Character Name": lastCharacterName
            },
            whisper,
            ...(sacrificeCost === -1 ? { WARNING: 'Sacrifice cost data was not found and IS NOT ACCURATE'} : {})
          })
        })
  
      trades.push(...tradeData)
    } catch (result) {
      writeTradesToFile(trades, true)
      console.log('ERROR OUTPUT')
      console.log(result)
      return
    }
    await wait(15000)
  }

  writeTradesToFile(trades)
}

main()