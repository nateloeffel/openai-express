const express = require('express')
const axios = require('axios')
const OpenAI = require('openai')
const dotenv = require('dotenv').config()

const PORT = process.env.PORT || 3000;

const descriptionSystemPrompt = "You are a bot designed to parse JSON files into conversational text for auditory output. Use the notion of clock headings to describe objects (12:00 becomes 0 degrees, 3:00 becomes 90 degrees, and so on). Write a series of 2-3 sentences that summarizes the heading of the given objects in a conversational sense. Respond only with directions. For example: USER PROMPT: Interpret the following with relation to the system prompt.[{name: 'water_bottle', heading: '270'},{name: 'computer1', heading: '315'},{name: 'computer2', heading: '330'},{name: 'bathroom', heading: '90'},{name: 'exit_sign', heading: '0'}]"

// GPT System Prompt
const tagSystemPrompt = "Your task is to take user input, and associate with a specific tag that best fits from the list of tags I give you. Do not deviate from the list, and if no matching tags are found, just respond with the error tag which is specified (#error). You must only respond with the tag and nothing else. A tag must be formatted to begin with a hashtag character which precedes the keyword. If the user gives an example of an object that is not the exact object, you must still give the relevant tags. For instance if someone says they are looking for the red door, you should give them the tag of #door. \nAVAILABLE KEYWORDS: keys\ndoor\nwindow\ntrash_can\nlight_bulb\nphone\nmarker\ncharger\nbicycle\ncar\nmotorbike\naeroplane\nbus\ntrain\ntruck\nboat\ntraffic_light\nfire_hydrant\nstop_sign\nparking_meter\nbench\nbackpack\numbrella\nhandbag\ntie\nsuitcase\nfrisbee\nskis\nsnowboard\nsports_ball\nkite\nbaseball_bat\nbaseball_glove\nskateboard\nsurfboard\ntennis_racket\nbottle\nwine_glass\ncup\nfork\nknife\nspoon\nbowl\nbanana\napple\nsandwich\norange\nbroccoli\ncarrot\nhot_dog\npizza\ndonut\ncake\nchair\nsofa\npottedplant\nbed\ndiningtable\ntoilet\ntvmonitor\nlaptop\nmouse\nremote\nkeyboard\ncell_phone\nmicrowave\noven\ntoaster\nsink\nrefrigerator\nbook\nclock\nvase\nscissors\nteddy_bear\nhair_drier\ntoothbrush\nerror"

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



app.post('/describe', async (req, res) => {
    
    const items = req.body // array

    const description = await getDescription(items)

    return res.json({ description })

})

// Start server
app.listen(PORT, () =>{
    console.log(`App is running on ${PORT}`)
})

// Assign speech to text string with a tag to be used programmatically
const getTag = async ( text ) => {
    const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: tagSystemPrompt }, { role: "user", content: text }],
        model: "gpt-4o",
      });
      return completion.choices[0].message.content
}

const getDescription = async ( items ) => {
    const message = `${items}`
    const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: descriptionSystemPrompt }, { role: "user", content: message }],
        model: "gpt-4o",
      });
      return completion.choices[0].message.content
}