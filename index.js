const express = require('express')
const axios = require('axios')
const OpenAI = require('openai')
const dotenv = require('dotenv').config()

const PORT = process.env.PORT || 3000;

// GPT System Prompt
const systemPrompt = "Your task is to take user input, and associate with a specific tag that best fits from the list of tags I give you. Do not deviate from the list, and if no matching tags are found, just respond with the error tag which is specified (#error). You must only respond with the tag and nothing else. A tag must be formatted to begin with a hashtag character which precedes the keyword. If the user gives an example of an object that is not the exact object, you must still give the relevant tags. For instance if someone says they are looking for the red door, you should give them the tag of #door. \nAVAILABLE KEYWORDS: keys\ndoor\nwindow\ntrash_can\nlight_bulb\nphone\nmarker\ncharger\nbicycle\ncar\nmotorbike\naeroplane\nbus\ntrain\ntruck\nboat\ntraffic_light\nfire_hydrant\nstop_sign\nparking_meter\nbench\nbackpack\numbrella\nhandbag\ntie\nsuitcase\nfrisbee\nskis\nsnowboard\nsports_ball\nkite\nbaseball_bat\nbaseball_glove\nskateboard\nsurfboard\ntennis_racket\nbottle\nwine_glass\ncup\nfork\nknife\nspoon\nbowl\nbanana\napple\nsandwich\norange\nbroccoli\ncarrot\nhot_dog\npizza\ndonut\ncake\nchair\nsofa\npottedplant\nbed\ndiningtable\ntoilet\ntvmonitor\nlaptop\nmouse\nremote\nkeyboard\ncell_phone\nmicrowave\noven\ntoaster\nsink\nrefrigerator\nbook\nclock\nvase\nscissors\nteddy_bear\nhair_drier\ntoothbrush\nerror"

// Create express app with JSON middleware
const app = express()
app.use(express.json())

// Create OpenAI client
const openai = new OpenAI();

app.get('/', (req, res) => {
    return res.sendStatus(200)
})

app.post('/tag', async (req, res) => {
    const { text } = req.body
    const tag = await getTag(text)

    return res.json({ tag })

})


// Start server
app.listen(PORT, () =>{
    console.log(`App is running on ${PORT}`)
})

// Assign speech to text string with a tag to be used programmatically
const getTag = async ( text ) => {
    const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: systemPrompt }, { role: "user", content: text }],
        model: "gpt-4o",
      });
      return completion.choices[0].message.content
}
