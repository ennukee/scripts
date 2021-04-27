const { default: axios } = require("axios")
const fs = require('fs')
const path = require('path');
const { ultimatumDivQuery } = require('./util/tradequery')
const validDivCardsToCheck = require('./util/data/results/validDivCardsToCheck.json')
const divPriceData = require('./util/data/results/divPriceData.json')

const TRADE_BASE_URL = 'https://www.pathofexile.com/api/trade/search/Ultimatum'
const EXALT_PRICE = 130
const PROFIT_MARGIN = 0.5

const wait = (ms) => new Promise(resolve => setTimeout(() => resolve(), ms))

const writeTradesToFile = (output, cutEarly = false) => {
  if (cutEarly) {
    console.log('WARNING: OUTPUT WAS CUT EARLY BY AN ERROR IN REQUEST')
  }
  output.sort((a, b) => b.profit - a.profit)

  // eslint-disable-next-line no-undef
  const filepath = path.join(__dirname, `./div_output${cutEarly ? '_cutearly' : ''}.json`)
  fs.writeFile(filepath, JSON.stringify(output, null, 2), (error) => console.log(error))
    
}

const main = async () => {
  const trades = []
  for (let i = 0; i < validDivCardsToCheck.length; i += 1) {
    const cardName = validDivCardsToCheck[i]
    const card = divPriceData.find(div => div.name === cardName)
    const ultimatumStackSize = Math.ceil(card.stackSize / 2)

    let hashedTrades
    try {
      hashedTrades = await axios.post(
        TRADE_BASE_URL,
        ultimatumDivQuery(
          card.chaosValue,
          ultimatumStackSize,
          card.name,
          PROFIT_MARGIN
        )
      )
    } catch (result) {
      writeTradesToFile(trades, true)
      console.log(result)

      await wait(5000)
      throw new Error()
    }

    await wait(20000)
    if (hashedTrades && hashedTrades.data.result.length === 0) {
      console.log(`No profitable snipes for card ${cardName}`)
      continue
    }

    const requestURLforCurrentCard = 
      `https://www.pathofexile.com/api/trade/fetch/${hashedTrades.data.result.join(',')}?query=${hashedTrades.data.id}`
    console.log(requestURLforCurrentCard)

    try {
      const tradeResp = await axios.get(requestURLforCurrentCard)
      const tradeData = tradeResp.data.result
        .filter(trade => {
          // Ignore trades older than half a day
          const timestamp = trade.listing.indexed
          const timeElapsed = (new Date() - new Date(Date.parse(timestamp))) / (1000 * 3600 * 24)
          console.log(`Trade found, listed at ${timestamp}, days elapsed: ${timeElapsed}`)
          return timeElapsed < 0.5
        })
        .map(trade => {
          const {
            whisper,
            account: { name: userName, lastCharacterName },
            price: { amount, currency },
          } = trade.listing
    
          const chaosPrice = currency === 'exalted'
            ? amount * EXALT_PRICE
            : amount
    
          return ({
            userName,
            lastCharacterName,
            price: chaosPrice,
            profit: (card.chaosValue * ultimatumStackSize) - chaosPrice,
            card: {
              cardName,
              valuePerCard: card.chaosValue,
              countConsumedForUltimatum: ultimatumStackSize,
            },
            whisper
          })
        })
  
      trades.push(...tradeData)
    } catch (result) {
      writeTradesToFile(trades, true)
      console.log(result)

      await wait(2000)
      throw new Error()
    }
    await wait(20000)
  }

  writeTradesToFile(trades)

  // console.log(resp)
}

main()