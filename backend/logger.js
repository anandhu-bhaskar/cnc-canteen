const winston = require("winston");
// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
  })
);

// Create logger instance
const logger = winston.createLogger({
  level: "info",
  format: logFormat,
  transports: [
    new winston.transports.Console(), // Output logs to console
    new winston.transports.File({ filename: "logs/error.log", level: "error" }), // Output error logs to a file
    new winston.transports.File({ filename: "logs/combined.log" }), // Output all logs to a file
  ],
});

module.exports = logger;
