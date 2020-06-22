module.exports = async function (context, req, connectionInfo, meeting) {
    const meetingPassword = context.bindingData.meetingPassword.toString();
    if (meeting.meetingPassword !== meetingPassword) {
        context.res = {
            status: 401
        };
        return;
    }

    context.res.body = connectionInfo;
};