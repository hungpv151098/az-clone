const axios = require('axios');

exports.botSendMessage = async ({ botToken, chatId, message }) => {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const request = {
    chat_id: chatId,
    text: message,
  };

  try {
    const { data: resp } = await axios.post(url, request);

    return resp;
  } catch (e) {
    console.error('telegram bot message error');
    console.error(e);
    return null;
  }
};
