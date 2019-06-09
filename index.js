const express =  require('express');
var bodyParser = require('body-parser');
const axios = require('axios');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.listen(3000, () => {
    console.log("Server listening on port 3000");
});



app.get('/testMe', async(req, res) => {
    try{
        let result = await getToken();
        console.log(result);
        res.status(200).send(result);

    }catch(err) {
        console.log(err);
        res.status(500).send(err);
    }
});


const getToken = async () => {
    try{
        let tokenUrl = "http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https%3A%2F%2Fvault.azure.net";
        let tokenData = await axios.get(tokenUrl, {headers: {'Metadata': 'true'}});
        return tokenData;

    }catch(err) {
        console.log(err);
    }
}

