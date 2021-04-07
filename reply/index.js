const express = require('express')
const parser = require('body-parser')
const alexa = require('alexa-bot-api')

const server = express()
const ai = new alexa()

server.use(parser.urlencoded({ extended: false }));
server.use(parser.json());

// port
const port = process.env.PORT || 3000

server.post("/reply", async (req, res) => {
	const data = req.body
	if(!Object.keys(data).includes("question")) {
		return res.status(400).send("Question not found")
	}
	const reply = await ai.getReply(data.question);
	return res.json({out : reply})
})

server.listen(port, () => {
    console.log(`App started at port ${port}`)
})