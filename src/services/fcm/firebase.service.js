const admin = require('firebase-admin');
const serviceAccount = require('../../../firebase.json');
const config = require('../../app.config');
const { NOTIFICATION_ACTION_TYPE } = require('../../constants/const');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const sendNotification = async (deviceToken, content, actionId, actionType, countNotification) => {
  if (!deviceToken) {
    return;
  }
  let message = {};
  if (typeof countNotification === 'undefined') {
    message = {
      token: deviceToken,
      notification: {
        title: config.fcm.sender_name,
        body: content,
      },
      data: {
        id: actionId,
        type: actionType,
      },
    };
  } else {
    message = {
      token: deviceToken,
      notification: {
        title: config.fcm.sender_name,
        body: content,
      },
      data: {
        id: actionId,
        type: actionType,
        countNotification: countNotification?.toString(),
      },
    };
  }
  admin
    .messaging()
    .send(message)
    .then(response => {
      console.log('Notification sent successfully:', response);
    })
    .catch(error => {
      console.error('Error sending notification:', error);
    });
};

const sendNotificationReply = async (deviceToken, content, actionId, actionType, commentId, replyId) => {
  if (!deviceToken) {
    return;
  }
  const message = {
    token: deviceToken,
    notification: {
      title: config.fcm.sender_name,
      body: content,
    },
    data: {
      id: actionId.toString(),
      type: actionType,
      commentId:commentId.toString(),
      replyId:replyId.toString(),
    },
  };
  admin
    .messaging()
    .send(message)
    .then(response => {
      console.log('Notification sent successfully:', response);
    })
    .catch(error => {
      console.error('Error sending notification:', error);
    });
};
const sendMultiNotification = async (deviceTokens, content, actionId, actionType) => {
  const message = {
    data: {
      id: actionId,
      type: actionType,
    },
    notification: {
      title: config.fcm.sender_name,
      body: content,
    },
    tokens: deviceTokens,
  };
  admin
    .messaging()
    .sendMulticast(message)
    .then(response => {
      console.log('Notification sent successfully:', response);
    })
    .catch(error => {
      console.error('Error sending notification:', error);
    });
};

module.exports = { sendNotification, sendMultiNotification, sendNotificationReply };
