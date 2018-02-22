let btn1 = document.createElement('button');
let text1 = document.createTextNode('Login');
btn1.appendChild(text1);
btn1.onclick = () => {
  window.opener.postMessage(
    { auth: { token: 'access_token' } },
    window.opener.location
  );
}

let btn2 = document.createElement('button');
let text2 = document.createTextNode('cancel');
btn2.appendChild(text2);
btn2.onclick = () => {
  window.opener.postMessage(
    { error: 'Login failed' },
    window.opener.location
  );
}

let element = document.getElementById('page_main');
element.appendChild(btn1);
element.appendChild(btn2);
