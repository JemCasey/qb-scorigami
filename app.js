const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs')

app.set('view engine', 'pug');
app.set('views', './src/views');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (_,res) => {
    fs.readFile('./public/scorigami.json', 'utf8' , (err, data) => {
        let scores, 
            scorigamiMatrix = [], 
            minLossScore = 1000, 
            minWinScore = 1000, 
            maxLossScore = 0, 
            maxWinScore = 0, 
            lossRowNumbers = [], 
            winColumnNumbers = [];

        if (err) {
            res.render('error');
            return;
        }

        scores = JSON.parse(data);

        for (score of scores) {
            if (!scorigamiMatrix[score.losingScore]) 
                scorigamiMatrix[score.losingScore] = [];
            
            if (score.losingScore < minLossScore) minLossScore = score.losingScore;
            if (score.losingScore > maxLossScore) maxLossScore = score.losingScore;
            if (score.winningScore < minWinScore) minWinScore = score.winningScore;
            if (score.winningScore > maxWinScore) maxWinScore = score.winningScore;

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

        res.render('index', {
            lossRowNumbers, 
            winColumnNumbers,
            scorigamiMatrix
        });
    });
});

app.listen(3000, () => console.log("Listening on port 3000"));