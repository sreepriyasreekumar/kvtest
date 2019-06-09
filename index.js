const express =  require('express');
var bodyParser = require('body-parser');
const axios = require('axios');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.listen(3000, () => {
    console.log("Server listening on port 3000");
});


app.get('/token', async(req, res) => {
    try{
        let result = await getToken();
        res.status(200).send(result.data);
    }catch(err) {
        console.log("Error occurred");
        console.log(err);
        res.status(500).send(err);
    }
});

app.get('/secret', async(req, res) => {
    try{
        let kvUrl = "https://block2vault.vault.azure.net/secrets/secret?api-version=2016-10-01";
        let token = (await getToken()).access_token;
        let secretData = axios.get(kvUrl, {headers: {'Authorization': `Bearer ${token}`}});
        console.log("Printing secret data");
        console.log(secretData);

    }catch(err) {
        console.log("Error occurred");
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
        console.log("Error occurred");
        console.log(err);
    }
}

