const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const port = process.env.PORT || 8080

let topScores = []

for (let i = 0; i < 10; ++i) {
    topScores.push({ name: 'AAA', score: 0 })
}

let score = {savedScore: 0}

app.listen(port, () => {
    console.log(addOne)
})

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
})

app.get('/topScores', (req, res) => {
    res.send(topScores);
    console.log('It worked! GET topScores')
})

app.post('/topScores', jsonParser, (req, res) => {
    if (!req.body) return res.sendStatus(400)
    console.log(req.body)
    topScores.unshift(req.body)
    if (topScores.length > 10) {
        topScores.pop()
    }
    console.log(topScores)
    console.log('It worked! POST topScores')
    res.send(topScores)
})

app.get('/score', (req, res) => {
    res.json(score);
    console.log('It worked! GET score')
})

app.post('/score', jsonParser, (req, res) => {
    if (!req.body) return res.sendStatus(400)
    console.log(req.body)
    score = (req.body)
    console.log(score.savedScore)
    console.log('It worked! POST score')
    res.json(score)
})

const addOne = 
`ad·di·tion

/əˈdiSH(ə)n/
noun

noun: addition; noun: addn.

1.  the action or process of adding something to something else.
    "the hotel has been extended with the addition of more rooms"
    synonyms:	adding, incorporation, inclusion, introduction
                "the soil is improved by the addition of compost"
    a person or thing added or joined, typically in order to improve something.
    plural noun: additions
    "you will find the coat a useful addition to your wardrobe"
    synonyms:	supplement, adjunct, addendum, adhesion, appendage, add-on, extra, attachment; 

2.  the process or skill of calculating the total of two or more numbers or amounts.
    "she began with simple arithmetic, addition and then subtraction"
    MATHEMATICS
    the process of combining matrices, vectors, or other quantities under specific rules to obtain their sum.`