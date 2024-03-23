const sendToastError = (res, message) => {
  return res.status(400).json({
    success: false,
    message: message,
  });
};
module.exports = sendToastError;
