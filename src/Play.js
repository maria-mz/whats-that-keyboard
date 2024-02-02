import TextSpace from './components/TextSpace.js';
import Keyboard from './components/Keyboard.js';

const gameInputElmt = document.getElementById("gameInput")

const textSpace = new TextSpace()
document.getElementById('gameArea').appendChild(textSpace.getTextSpaceElmt())

const keyboard = new Keyboard(textSpace)
gameInputElmt.appendChild(keyboard.getKeyboardElmt())

document.addEventListener('keydown', keyboard.keydownEventHandler.bind(keyboard))
document.addEventListener('keyup', keyboard.keyupEventHandler.bind(keyboard))

const button = document.createElement('div');
button.textContent = 'Test me!';
button.classList.add('btn');
button.id = 'testMeBtn'
gameInputElmt.appendChild(button);
