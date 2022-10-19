const express = require('express');
const bodyParser = require('body-parser')
const { UserModel } = require('./models/userModel');
const cors = require('cors')
const axios = require('axios');
const oauth = require('./lib/oauth');
const jwt = require('./lib/jwt');
const { addCallLog, addMessageLog, getCallLog } = require('./core/log');

const app = express();
app.use(bodyParser.json())

app.use(cors({
    origin: ['chrome-extension://adlfdhlnnkokmmonfnapacebcldipebm'],
    methods: ['GET', 'PUT', 'POST']
}));
app.get('/oauth-callback', async function (req, res) {
    const oauthClient = oauth.getOAuthApp();
    try {
        const platform = req.query.state.split('platform=')[1];
        const { accessToken, refreshToken, expires } = await oauthClient.code.getToken(req.query.callbackUri);
        const userInfoResponse = await axios.get('https://api.pipedrive.com/v1/users/me', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });;
        const userInfo = userInfoResponse.data.data;
        await UserModel.create({
            id: userInfo.id,
            name: userInfo.name,
            companyId: userInfo.company_id,
            companyName: userInfo.company_name,
            companyDomain: userInfo.company_domain,
            platform: platform,
            accessToken,
            refreshToken,
            tokenExpiry: expires,
            rcUserNumber: req.query.rcUserNumber
        });
        const jwtToken = jwt.generateJwt({
            id: userInfo.id,
            rcUserNumber: req.query.rcUserNumber,
            platform: platform
        });
        res.status(200).send(jwtToken);
    }
    catch (e) {
        console.log(e);
    }
    res.status(400).send();
})
app.post('/unAuthorize', async function (req, res) {
    try {
        const jwtToken = req.query.jwtToken;
        if (jwtToken) {
            const unAuthData = jwt.decodeJwt(jwtToken);
            await UserModel.destroy({
                where: {
                    id: unAuthData.id
                }
            });
            res.status(200).send();
        }
    }
    catch (e) {
        console.log(e);
    }
    res.status(400).send();
})
app.get('/callLog', async function (req, res) {
    try {
        const jwtToken = req.query.jwtToken;
        if (jwtToken) {
            const { platform } = jwt.decodeJwt(jwtToken);
            const { successful, message, logId } = await getCallLog(platform, req.query.sessionId);
            res.status(200).send({ successful, message, logId });
        }
    }
    catch (e) {
        console.log(e);
        res.status(400).send();
    }
});
app.post('/callLog', async function (req, res) {
    try {
        const jwtToken = req.query.jwtToken;
        if (jwtToken) {
            const { id: userId, platform } = jwt.decodeJwt(jwtToken);
            const { successful, message, logId } = await addCallLog(platform, userId, req.body);
            res.status(200).send({ successful, message, logId });
        }
    }
    catch (e) {
        console.log(e);
        res.status(400).send();
    }
});
app.post('/messageLog', async function (req, res) {
    try {
        const jwtToken = req.query.jwtToken;
        if (jwtToken) {
            const { id: userId, platform } = jwt.decodeJwt(jwtToken);
            const { successful, logIds } = await addMessageLog(platform, userId, req.body);
            res.status(200).send({ successful, logIds });
        }
    }
    catch (e) {
        console.log(e);
    }
    res.status(400).send();
});

exports.server = app;