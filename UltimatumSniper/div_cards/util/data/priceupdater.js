const { default: axios } = require("axios")
const fs = require('fs')

const DIV_CARD_POENINJA_ENDPOINT = 'https://poe.ninja/api/data/itemoverview?league=Ultimatum&type=DivinationCard'

const main = async () => {
  const resp = await axios.get(DIV_CARD_POENINJA_ENDPOINT)
  const remapped = resp.data.lines.map(({ id, name, stackSize, chaosValue, exaltValue}) => ({
    id, name, stackSize, chaosValue, exaltValue
  }))
  fs.writeFile('./results/divPriceData.json', JSON.stringify(remapped, null, 2), (error) => console.log(error))
}

main()