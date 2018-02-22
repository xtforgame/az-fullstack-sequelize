// https://gist.github.com/gauravtiwari/2ae9f44aee281c759fe5a66d5c2721a2#file-window-auth-popup-es6-js

const popup = (_url) => {
  const windowArea = {
    width: Math.floor(window.outerWidth * 0.8),
    height: Math.floor(window.outerHeight * 0.5),
  };

  if (windowArea.width < 1000) { windowArea.width = 1000; }
  if (windowArea.height < 630) { windowArea.height = 630; }
  windowArea.left = Math.floor(window.screenX + ((window.outerWidth - windowArea.width) / 2));
  windowArea.top = Math.floor(window.screenY + ((window.outerHeight - windowArea.height) / 8));

  const sep = (_url.indexOf('?') !== -1) ? '&' : '?';
  const url = `${_url}${sep}`;
  const windowOpts = `toolbar=0,scrollbars=1,status=1,resizable=1,location=1,menuBar=0,
    width=${windowArea.width},height=${windowArea.height},
    left=${windowArea.left},top=${windowArea.top}`;

  const authWindow = window.open(url, 'producthuntPopup', windowOpts);
  // Create IE + others compatible event handler
  const addListenerMethod = window.addEventListener ? 'addEventListener' : 'attachEvent';
  const removeListenerMethod = window.addEventListener ? 'removeEventListener' : 'detachEvent';
  const eventAdder = window[addListenerMethod];
  const eventRemover = window[removeListenerMethod];
  const messageEvent = addListenerMethod === 'attachEvent' ? 'onmessage' : 'message';

  // Listen to message from child window
  const authPromise = new Promise((resolve, reject) => {
    let isFulfilled = false;
    let handler = null;
    let fulfill = (data, isFailed) => {
      isFulfilled || (isFailed ? reject(data) : resolve(data));
      isFulfilled = true;
      eventRemover(messageEvent, handler);
      if (!authWindow.closed) {
        authWindow.close();
      }
    }

    handler = (e) => {
      // if (e.origin !== window.SITE_DOMAIN) {
      //   console.log('e.origin, window.SITE_DOMAIN :', e.origin, window.SITE_DOMAIN);
      //   authWindow.close();
      //   reject('Not allowed');
      // }

      if (e.data.auth) {
        console.log('e.data.auth :', e.data.auth);
        let json = e.data.auth;
        if(typeof e.data.auth === 'string'){
          json = JSON.parse(e.data.auth);
        }
        fulfill(json);
      } else {
        fulfill('Unauthorised', true);
      }
    };

    eventAdder(messageEvent, handler, false);

    // authWindow.onbeforeunload = () => {
    //   fulfill('Unauthorised', true);
    // }

    let oauthInterval = window.setInterval(() => {
      if (authWindow.closed) {
        window.clearInterval(oauthInterval);
        fulfill('Unauthorised', true);
      }
    }, 1000);
  });



  return authPromise;
};

export default popup;

// // On Server view after response
// window.opener.postMessage(
//   { auth: { token: access_token } },
//   window.opener.location
// );

// window.opener.postMessage(
//   { error: 'Login failed' },
//   window.opener.location
// );
