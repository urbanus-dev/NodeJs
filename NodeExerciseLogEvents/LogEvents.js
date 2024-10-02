const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { format } = require('date-fns');

async function LogEvents(message) {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    const logItem = `${uuidv4()} ${dateTime} ${message}\n`;

    try {
        await fs.promises.mkdir('Logs');
    } catch (error) {
        if (error.code !== 'EEXIST') {
            throw error;
        }
    }

    await fs.promises.appendFile('Logs/eventLogs.txt', logItem);
}

module.exports = LogEvents;
