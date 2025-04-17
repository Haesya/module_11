const wsUri = "wss://echo-ws-service.herokuapp.com";

const input = document.querySelector('.input');
const btnMess = document.querySelector('.main__btn__mess');
const btnGeo = document.querySelector('.main__btn__geo');
const userMessages = document.querySelector('.chat__user__messages');
const serverMessages = document.querySelector('.chat__server__messages');
const wrapperChat =  document.querySelector('.main__chat__content');

//Выводит сообщения
function writeToScreen(message, position='flex-end') {
    let element = `
        <p class='messages' style='align-self: ${position}'>
            ${message}
        </p>
    `;
    userMessages.innerHTML += element;
    wrapperChat.scrollTop = wrapperChat.scrollHeight;
}

//Объект соединения
let websocket = new WebSocket(wsUri);
websocket.onopen = function(evt) {
    console.log("CONNECTED");
};
websocket.onmessage = function(evt) {
    writeToScreen(`ответ сервера: ${evt.data}`, 'flex-start');
};
websocket.onerror = function(evt) {
    writeToScreen(`server: ${evt.data}`, 'flex-start');
};

//отправка сообщения
btnMess.addEventListener('click', () => {
    let message = input.value;
    websocket.send(message);
    writeToScreen(`Вы: ${message}`);
    input.value = ''

});


//гео-локация
// Функция сообщения об ошибке
const error = () => {
    let textErr0r = 'Невозможно получить ваше местоположение';
    writeToScreen(textErr0r);
};

// Функция, срабатывающая при успешном получении геолокации
const success = (position) => {
    let latitude  = position.coords.latitude;
    let longitude = position.coords.longitude;
    let geoLink = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
    writeToScreen(`<a  href='${geoLink}' target='_blank'>Ваша гео-локация</a>`);
};

btnGeo.addEventListener('click', () => {
    if (!navigator.geolocation) {
        console.log('Geolocation не поддерживается вашим браузером');
    } else {
        navigator.geolocation.getCurrentPosition(success, error);
    }
});

//удаляем сообщения
serverMessages.addEventListener('click', () => {
    userMessages.innerHTML = " ";
});