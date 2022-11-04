function secondsToHourMinuteSecondString(totalSeconds) {
    const hours = parseInt(totalSeconds / 3600);
    const hourString = hours === 0 ? '' : `${hours} hour(s)`;
    const minutes = parseInt((totalSeconds - 3600 * hours) / 60);
    const minuteString = (hours === 0 && minutes === 0) ? '' : `${minutes} minute(s)`;
    const seconds = parseInt(totalSeconds - 3600 * hours - 60 * minutes);
    const secondString = `${seconds} second(s)`;
    return `${hourString}${minuteString}${secondString}`;
}

function showNotification({ level, message, ttl }) {
    document.querySelector("#rc-widget-adapter-frame").contentWindow.postMessage({
        type: 'rc-adapter-message-request',
        requestId: Date.now().toString(),
        path: '/custom-alert-message',
        alertMessage: message,
        alertLevel: level,
        ttl
    }, '*');
}

exports.secondsToHourMinuteSecondString = secondsToHourMinuteSecondString;
exports.showNotification = showNotification;