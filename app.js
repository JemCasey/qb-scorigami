const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs')

app.set('view engine', 'pug');
app.set('views', './src/views');
app.use(express.static(path.join(__dirname, 'public')));

function assembleIndexData() {
    let data = fs.readFileSync('./public/scorigami.json', 'utf8');
    let scores,
        scorigamiMatrix = [],
        minLossScore = 1000,
        minWinScore = 1000,
        maxLossScore = 0,
        maxWinScore = 0,
        maxInstances = 0,
        lossRowNumbers = [],
        winColumnNumbers = [];

    scores = JSON.parse(data);

    for (score of scores) {
        if (!scorigamiMatrix[score.losingScore])
            scorigamiMatrix[score.losingScore] = [];

        if (score.losingScore < minLossScore) minLossScore = score.losingScore;
        if (score.losingScore > maxLossScore) maxLossScore = score.losingScore;
        if (score.winningScore < minWinScore) minWinScore = score.winningScore;
        if (score.winningScore > maxWinScore) maxWinScore = score.winningScore;
        if (score.instances > maxInstances) maxInstances = score.instances;

        scorigamiMatrix[score.losingScore][score.winningScore] = {
            instances: score.instances,
            firstInstance: score.firstInstance,
            latestInstance: score.latestInstance
        };
    }

    for (let i = minLossScore; i <= maxLossScore; i += 5)
        lossRowNumbers.push(i);

    for (let i = minWinScore; i <= maxWinScore; i += 5)
        winColumnNumbers.push(i);

    return {
        lossRowNumbers,
        winColumnNumbers,
        maxInstances,
        scorigamiMatrix
    }
}

app.get('/', (req, res) => {
    if (!req.app.indexData) {
        req.app.indexData = assembleIndexData();
    }

    res.render('index', req.app.indexData);
});

app.listen(process.env.PORT || 3000, () => console.log("Listening on port 3000"));