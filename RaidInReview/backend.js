const express = require('express')
const app = express()
const port = 3000
const { getToken } = require('./main')

app.get('/:server/:realm/:guildName', async (req, res) => {
    const { server, realm, guildName } = req.params
    const response = await getToken(server, realm, guildName)
    res.send(response)
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})