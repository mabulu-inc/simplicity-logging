const logLevels = ['error', 'warn', 'info', 'debug'];
const logLevel =
  logLevels.indexOf(process.env.LOG_LEVEL) > -1
    ? process.env.LOG_LEVEL
    : logLevels[0];
for (let i = logLevels.indexOf(logLevel) + 1; i < logLevels.length; i += 1) {
  console[logLevels[i]] = () => {};
}
