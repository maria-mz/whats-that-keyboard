import TextSpace from './components/TextSpace.js';
import Keyboard from './components/Keyboard.js';


const textSpace = new TextSpace()
document.getElementById('gameArea').appendChild(textSpace.getTextSpaceElmt())

const keyboard = new Keyboard(textSpace)
document.getElementById('gameInput').appendChild(keyboard.getKeyboardElmt())

document.addEventListener('keydown', keyboard.keydownEventHandler.bind(keyboard))
document.addEventListener('keyup', keyboard.keyupEventHandler.bind(keyboard))
