const URL = "wss://echo.websocket.org";

const btnGeo = document.querySelector('.main__geolocation');
const clearChat = document.querySelector('.main__clearChat')
const chatContent =  document.querySelector('.main__chat__content');
const userMessages = 'main__user__messages'
const serverMessages = 'main__server__messages'
const input = document.querySelector('.main__chat__form__input');
const btnSendMessage = document.querySelector('.main__btn__send');

/*открыли соединение*/
let websocket = new WebSocket(URL);
websocket.onopen = function(evt) {
    console.log("CONNECTED");
};

//Выводит сообщения
function writeToScreen(message, who) {
    let element = `
        <p class='main__messages ${who}'>
            ${message}
        </p>
    `;
    chatContent.innerHTML += element;
    chatContent.scrollTop = chatContent.scrollHeight;
}
websocket.onmessage = function(evt) {
    writeToScreen(`Сервер: ${evt.data}`, serverMessages);
};
websocket.onerror = function(evt) {
    writeToScreen(`Сервер: ${evt.data}`, serverMessages);
};

/*гео-локация*/
btnGeo.addEventListener('click', () => {
    if (!navigator.geolocation) {
        console.log('Geolocation не поддерживается вашим браузером');
    } else {
        navigator.geolocation.getCurrentPosition(success, error);
    }
});

/*не получили гео-локацию*/
const error = () => {
    let textError = 'Невозможно получить ваше местоположение';
    writeToScreen(textError, serverMessages);
};

/*получили гео-локацию*/
const success = (position) => {
    let latitude  = position.coords.latitude;
    let longitude = position.coords.longitude;
    let geoLink = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
    writeToScreen('Где я', userMessages)
    writeToScreen(`<a  href='${geoLink}' target='_blank'>Ваше местоположение</a>`, serverMessages);
};

/*очистить чат*/
clearChat.addEventListener('click', () => {
    chatContent.innerHTML = " ";
});

//отправка сообщения
btnSendMessage.addEventListener('click', () => {
    let message = input.value;
    if (message !== "") {
        websocket.send(message);
        writeToScreen(`Вы: ${message}`, userMessages);
    } else {
        writeToScreen('Сервер: введите сообщение!', serverMessages)
    }
    input.value = ''
});



