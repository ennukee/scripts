const { default: axios } = require("axios")
const fs = require('fs')
const path = require('path');
const { ultimatumCurrencyQuery } = require('./util/tradequery')
const { currencies } = require('./util/currencies')

const TRADE_BASE_URL = 'https://www.pathofexile.com/api/trade/search/Ultimatum'
const EXALT_PRICE = 130
const PROFIT_MARGIN = 0.3
const CURRENCY = currencies.DivineOrb
const CURRENCY_VALUE = 13
const MIN_CURRENCY_SAC = 2 // 0 = 1/2/4/8, 1 = 2/4/8, 2 = 4/8, 3 = 8

const wait = (ms) => new Promise(resolve => setTimeout(() => resolve(), ms))

const writeTradesToFile = (output, cutEarly = false) => {
  if (cutEarly) {
    console.log('\x1b[31m%s\x1b[0m', 'WARNING: OUTPUT WAS CUT EARLY BY AN ERROR IN REQUEST')
  }
  console.log('Outputting trades to file...')
  output.sort((a, b) => b.profit - a.profit)

  // eslint-disable-next-line no-undef
  const filepath = path.join(__dirname, `./${CURRENCY}_output${cutEarly ? '_cutearly' : ''}.json`)
  fs.writeFile(filepath, JSON.stringify(output, null, 2), (error) => console.log(error))
  console.log('Saved to', filepath)
}

const main = async () => {
  const trades = []

  let hashedTrades
  try {
    hashedTrades = await axios.post(
      TRADE_BASE_URL,
      ultimatumCurrencyQuery(
        CURRENCY_VALUE,
        CURRENCY,
        MIN_CURRENCY_SAC,
        PROFIT_MARGIN
      )
    )
  } catch (result) {
    writeTradesToFile(trades, true)
    console.log('ERROR OUTPUT')
    console.log(result)
    return
  }

  await wait(10000)
  if (hashedTrades && hashedTrades.data.result.length === 0) {
    console.log('\x1b[31m%s\x1b[0m', 'No trades found for provided bounds')
  }

  const pages = Math.ceil(hashedTrades.data.result.length / 10)
  for (let i = 0; i < pages; i++) {
    console.log(`Page ${i + 1} of ${pages}`)
    const page = hashedTrades.data.result.slice(i*10, (i+1)*10)
    const pageRequestURL = 
      `https://www.pathofexile.com/api/trade/fetch/${page.join(',')}?query=${hashedTrades.data.id}`

    try {
      const tradeResp = await axios.get(pageRequestURL)
      const tradeData = tradeResp.data.result
        .filter(trade => {
          const sacMultiplier = trade.item.properties[2].values[1][0] // "x2", "x4", "x8"
          if (!sacMultiplier) return false
          return ["x1", "x2", "x4", "x8"].slice(MIN_CURRENCY_SAC).includes(sacMultiplier)
        })
        .map(trade => {
          const {
            whisper,
            account: { name: userName, lastCharacterName },
            price: { amount, currency },
          } = trade.listing
          const multiplier = trade.item.properties[2].values[1][0]

          const chaosPrice = currency === 'exalted'
            ? amount * EXALT_PRICE
            : amount
          
          const profit = (+multiplier[1]) * CURRENCY_VALUE - chaosPrice
          const challenge = trade.item.properties.find(field => field.name === 'Challenge').values[0][0]
          
          return ({
            challenge,
            multiplier,
            profit,
            seller: {
              userName,
              lastCharacterName,
            },
            whisper,
          })
        })
      
        trades.push(...tradeData)
    } catch (result) {
      writeTradesToFile(trades, true)
      console.log('ERROR OUTPUT')
      console.log(result)
      return
    }

    await wait(10000)
  }

  writeTradesToFile(trades)
}

main()
  