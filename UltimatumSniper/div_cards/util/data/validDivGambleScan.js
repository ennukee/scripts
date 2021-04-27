/**
 * This file is to do a very brief scan over all valid div cards and see which ones of them have Ultimatum div card gambles
 * 
 * Implements a fairly lengthy delay between queries to prevent rate limiting oneself
 */

const { default: axios } = require("axios")
const { ultimatumDivQuery } = require('../tradequery')
const fs = require('fs')
const divPriceData = require('./results/divPriceData.json')

const TRADE_BASE_URL = 'https://www.pathofexile.com/api/trade/search/Ultimatum'

const main = async () => {
    const worthwhileCards = divPriceData.filter(card => (card.chaosValue * card.stackSize / 2) > 100 && card.chaosValue < 1000)
    const cardsWithUltimatums = []
    for(let i = 0; i < worthwhileCards.length; i += 1) {
        const card = worthwhileCards[i]
        console.log(`Checking card ${card.name} (1/${card.stackSize}) (value ${card.chaosValue}c${card.exaltValue ? ` / ${card.exaltValue}ex` : ''})`)
        const resp = await axios.post(TRADE_BASE_URL, ultimatumDivQuery(card.chaosValue, 2000, card.name))
        console.log(resp)
        if (resp.data.total > 0) {
            cardsWithUltimatums.push(card.name)
        }
        await new Promise(resolve => setTimeout(() => resolve(), 3000))
    }

    fs.writeFile('./results/validDivCardsToCheck.json', JSON.stringify(cardsWithUltimatums, null, 2), (error) => console.log(error))
}
  
  main()