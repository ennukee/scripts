const ultimatumUniqueQuery = (price, outputUnique, profitMargin = 0.5) => ({
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
              max: price * (1 - profitMargin), // ! <- MAX-PRICE IN CHAOS HERE
            },
          },
        },
        ultimatum_filters: {
          filters: {
            ultimatum_output: {
              option: outputUnique // ! <- UNIQUE NAME HERE
            }
          }
        }
      },
    },
    sort: { price: 'asc' }
  })

module.exports = {
    ultimatumUniqueQuery
}