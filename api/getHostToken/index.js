const jwt = require('jsonwebtoken');

module.exports = async function (context, req, meeting) {
    const body = req.body;
    if (!meeting || meeting.hostKey !== body.hostKey) {
        context.res = {
            status: 401
        };
        return;
    }

    const token = jwt.sign({
        meetingId: meeting.meetingId
    }, process.env.JwtSigningKey, {
        expiresIn: '1d'
    });

    context.res.json({
       token,
       meeting
    });
};