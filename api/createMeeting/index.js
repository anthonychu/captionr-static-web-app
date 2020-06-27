const { v4: uuidv4 } = require('uuid');

module.exports = async function (context, req) {
    // number between 100000000000-999999999999
    const meetingId = (100000000000 + Math.floor(Math.random() * 900000000000)).toString();
    const hostKey = uuidv4();
    // number between 1000-9999
    const meetingPassword = (1000 + Math.floor(Math.random() * 9000)).toString()

    // function should return an error if meeting id exists
    context.bindings.newMeeting = {
        PartitionKey: '1',
        RowKey: meetingId,
        meetingId,
        hostKey,
        meetingPassword
    };
    context.res = {
        status: 201,
        headers: {
            "Content-type": "application/json"
        },
        body: context.bindings.newMeeting
    };
};