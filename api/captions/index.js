const jwt = require('jsonwebtoken');

module.exports = async function (context, req) {
    const captions = req.body;

    try {
        jwt.verify(captions.token, process.env.JwtSigningKey);
    } catch {
        context.res = {
            status: 401
        };
        return;
    }

    const languageCaptions = Object.keys(captions.languages).map(captionLanguage => ({
        language: captionLanguage,
        offset: captions.offset,
        text: captions.languages[captionLanguage]
    }));

    const signalRMessages = languageCaptions.map(lc => ({
        target: 'newCaption',
        groupName: lc.language,
        arguments: [ lc ]
    }));

    return signalRMessages;
};