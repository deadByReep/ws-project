var webPush = require('web-push');

// Про GCM_API_KEY вы можете подробнее узнать из
// https://developers.google.com/cloud-messaging/
webPush.setGCMAPIKey(process.env.AAAA8q0wFaw:APA91bGNaST50Bfp4anHbFBDsEiVk2X8y5b61oH0_Cv6RFWq_5b7Xj2vARHYifmKK7-55hKv2irL6x6bLfZ9mSG5vjyzrDC-ArMJFJQTUshuM_NMj5yOMT8_9dbzdph1oIa8Ph_-L3ty || null);
// В данном примере мы будем рассматривать только route'ы в express.js
module.exports = function(app, route) {
  app.post(route + 'register', function(req, res) {
    res.sendStatus(201);
  });

  app.post(route + 'sendNotification', function(req, res) {
    setTimeout(function() {
      // Для отправки сообщения с payload, подписка должна иметь ключи 'auth' и 'p256dh'.
      webPush.sendNotification({
        endpoint: req.body.endpoint,
        TTL: req.body.ttl,
        keys: {
          p256dh: req.body.key,
          auth: req.body.authSecret
        }
      }, req.body.payload)
      .then(function() {
        res.sendStatus(201);
      })
      .catch(function(error) {
        res.sendStatus(500);
        console.log(error);
      });
    }, req.query.delay * 1000);
  });
};