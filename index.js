const express =  require('express');
var bodyParser = require('body-parser');
const axios = require('axios');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.listen(3000, () => {
    console.log("Server listening on port 3000");
});

const getToken = async () => {
    try{
        let tokenUrl = "http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https%3A%2F%2Fvault.azure.net";
        let tokenData = await axios.get(tokenUrl, {headers: {'Metadata': 'true'}});
        return tokenData.data.access_token;
    }catch(err) {
        console.log(err);
        console.log("Error occurred in fetching token");
    }
};

app.get('/token', async(req, res) => {
    try{
        let result = await getToken();
        res.status(200).send(result);
    }catch(err) {
        console.log(err);
        console.log("Error occurred in token fetching end point");
        res.status(500).send(err);
    }
});

app.get('/secret/:name', async(req, res) => {
    try{
        let kvUrl = `https://block2vault.vault.azure.net/secrets/${req.params.name}?api-version=2016-10-01`;
        let token = await getToken();   
        let secretData = await axios.get(kvUrl, {headers: {'Authorization': `Bearer ${token}`}});
        res.status(200).send(secretData.data);
    }catch(err) {
        console.log(err);
        console.log("Error occurred in secret fetch endpoint");
        res.status(500).send(err);
    }
});

app.put('/secret', async(req, res) => {
    try{
        if(req.body.name && req.body.value) {
            let kvUrl = `https://block2vault.vault.azure.net/secrets/${req.body.name}?api-version=2016-10-01`;
            let token = await getToken();
            let updateSecretResult = await axios.put(kvUrl, {'value':req.body.value}, {headers: {'Authorization': `Bearer ${token}`}});
            res.status(200).send(updateSecretResult.data);
        }else {
            res.status(500).send("Secret should have a name and value");
        } 
    }catch(err) {
        console.log(err);
        console.log("Error occurred in secret update endpoint");
        res.status(500).send(err);
    }
});


app.post('/secret', async(req, res) => {
    try{
        if(req.body.name && req.body.value) {
            let kvUrl = `https://block2vault.vault.azure.net/secrets/${req.body.name}?api-version=2016-10-01`;
            let token = await getToken();   
            let createSecretResult = await axios.post(kvUrl, {'value':req.body.value}, {headers: {'Authorization': `Bearer ${token}`}});
            console.log(createSecretResult);
            console.log("Created Secret");
            res.status(200).send(createSecretResult);
        }else {
            res.status(500).send("Secret should have a name and value");
        }        
    }catch(err) {
        console.log(err);
        console.log("Error occurred in secret create endpoint");
        res.status(500).send(err);
    }
});



