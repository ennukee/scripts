const { default: axios } = require("axios")
const fs = require('fs')
require('dotenv').config()

/*

*/
const CODES = [
  'k8cXNg2jhGQfzTFq', // vodka first rekill
  'QTxjdKLBwRp98k3P', // incarnate first rekill
  'kVGzZX1n7rfhaPQt', // random guild (Zanity) prog fast kill
  't4gL86kNh1wfHvm9', // random guild (CN guild) prog fast kill
  '81N6nkrqvzTfgyJR', // random guild (Scarlet X) prog fast kill
  'RahzHyxcK216mn47', // random guild (Nimue) prog fast kill
];
const BASE_URL = 'https://www.warcraftlogs.com/api/v2/client';

const SPELL_IDS = [
  '190319', // combust
  '194223', // celestial alignment
  '205180', // darkglare
  '323764', // convoke
  '328231', // wild spirits
]
const SPELL_CAST_LIMIT = 12 // to check only P1 casts

const debug = true

const outputGQLErrors = (out) => {
  if (out[0] && out[0].errors) {
    console.log(out[0].errors)
    console.log(out[0].errors[0].locations)
    return true
  }
}

const getFightData = (token, code) => {
  console.log('Token acquired', token)
  const headers = {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  };
  // 2407 Danny, 2417 SLG
  const fightsGQL = `{
    reportData {
      report(code: "${code}") {
        code
        fights(
          killType: Kills,
          encounterID: 2417
        ) {
          startTime
          endTime
        }
      }
    }
  }`
  axios.post(BASE_URL, {
    data: {
      query: fightsGQL
    }
  }, headers).then(
    (resp) => {
      SPELL_IDS.forEach(id => getSpellData(resp.data, headers, id, code))
    },
  );
}

const getSpellData = (data, headers, spellId, code) => {
  if (debug && outputGQLErrors(data)) return
  const { startTime, endTime } = data[0].data.reportData.report.fights[0];
  const spellsGQL = `{
    reportData {
      report(code: "${code}") {
        code
        guild {
          name
        }
        masterData {
          actors {
            id,
            name
          }
        }
        events(
          dataType: Casts,
          abilityID: ${spellId},
          startTime: ${startTime},
          endTime: ${endTime}
        ) {
          data
        }
      }
    }
  }`
  axios.post(BASE_URL, {
    data: {
      query: spellsGQL
    }
  }, headers).then(
    (resp) => handleDataOutput(resp.data, startTime, spellId, code),
    (err) => console.log(err),
  );
}

const handleDataOutput = (spellData, start, spellId, code) => {
  if (debug && outputGQLErrors(spellData)) return;
  const data = spellData[0].data.reportData.report;
  const castList = data.events.data;
  const actorList = data.masterData.actors;
  const guildName = data.guild ? data.guild.name : 'N/A (check log)';
  const output = {}
  castList.forEach(cast => {
    const unitName = `http://www.warcraftlogs.com/reports/${code}\t${guildName}\t${actorList.filter(unit => unit.id === cast.sourceID)[0].name}`
    if (!output[unitName]) {
      output[unitName] = []
    } else if (output[unitName].length >= SPELL_CAST_LIMIT) {
      return
    }
    const relativeCast = Math.floor((cast.timestamp - start) / 1000)
    const castMinutes = Math.floor(relativeCast / 60)
    const castSeconds = relativeCast % 60
    output[unitName].push(`${castMinutes}:${castSeconds < 10 ? '0' : ''}${castSeconds}`)
  });
  Object.entries(output).forEach(([key, value]) => {
    fs.appendFile(`./${spellId}_timings.txt`, [key, ...value].join('\t') + '\n', (err) => {
      if (err) throw err;
    })
  })
  
}

const getToken = () => {
  return axios.post(`https://www.warcraftlogs.com/oauth/token`, {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    grant_type: 'client_credentials',
  }).then(
    (resp) => {
      CODES.forEach(code => getFightData(resp.data.access_token, code))
    },
    (err) => console.log(err),
  );
};
  
  getToken();