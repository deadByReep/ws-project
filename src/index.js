var endpoint;
var key;
var authSecret;

navigator.serviceWorker.register('service-worker.js')
.then(function(registration) {
  // Используем PushManager, чтобы получить подписку пользователя из пуш-сервиса. 
  return registration.pushManager.getSubscription()
  .then(function(subscription) {
    // Если подписка уже существует возвращаем ее.
    if (subscription) {
      return subscription;
    }
    // В противном случае, подписываем пользователя.
    // userVisibleOnly - это флаг указывающий, что возвращенная push-подписка 
    // будет использоваться только для сообщений, 
    // эффект которых будет виден для пользователя.
    return registration.pushManager.subscribe({ userVisibleOnly: true });
  });
}).then(function(subscription) {
  // Получаем public key для пользователя.
  var rawKey = subscription.getKey ? subscription.getKey('p256dh') : '';
  key = rawKey
      ? btoa(String.fromCharCode.apply(null, new Uint8Array(rawKey)))
      : '';
  var rawAuthSecret = subscription.getKey ? subscription.getKey('auth') : '';
  authSecret = rawAuthSecret
      ? btoa(String.fromCharCode.apply(null, new Uint8Array(rawAuthSecret)))
      : '';

  endpoint = subscription.endpoint;

  // Отправляем детали о подписке на сервер используя Fetch API
  fetch('./register', {
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      endpoint: subscription.endpoint,
      key,
      authSecret,
    }),
  });
});
