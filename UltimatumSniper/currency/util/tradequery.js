const ultimatumCurrencyQuery = (price, currencyName, currencyStack, profitMargin = 0.5) => ({
    query: {
      status: 'onlineleague',
      type: 'Inscribed Ultimatum',
      stats: [{
        type: 'not',
        filters: [{
          id: 'ultimatum.umod_15668', // * Limited Flasks
        }],
      }],
      filters: {
        trade_filters: {
          filters: {
            price: {
              min: price,
              max: Math.floor(price * Math.pow(2, currencyStack) * (1 - profitMargin)),
            },
          },
        },
        ultimatum_filters: {
          filters: {
            ultimatum_input: {
              option: currencyName // ! <- CURRENCY NAME HERE
            }
          }
        }
      },
    },
    sort: { price: 'asc' }
  })

module.exports = {
  ultimatumCurrencyQuery
}