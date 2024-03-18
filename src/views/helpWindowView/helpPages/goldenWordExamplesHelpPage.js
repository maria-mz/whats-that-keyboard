import Keyboard from "../../mainComponents/keyboard.js";
import { getKeyLayout } from "../../../utils.js";


const PAGE_INSTRUCTIONS = `Some examples of Golden Words, for a particular layout:`

const EXAMPLE_POISE_EXPLANATION = `The word, <strong>poise</strong>, could help
                                   place <strong>5 keys.</strong> The first
                                   three letters are next to each other starting
                                   at the corner, and the rest are close at the
                                   other end.
                                   <br><br>`;

const EXAMPLE_READ_EXPLANATION = `The word, <strong>read</strong>, could help
                                  place <strong>4 keys.</strong> The letters are
                                  close to each other at one end. See that other
                                  words may help determine others. We could've
                                  located <strong>E</strong> from <strong>poise
                                  </strong>, for example.`;

const EXAMPLE_SUN_EXPLANATION = `The word, <strong>sun</strong>, could help
                                 place <strong>3 keys.</strong> However, this
                                 may not be the best Golden Word. Each key is
                                 far away from each other, which may make it
                                 hard to remember.`;

const WORD_TO_EXPLANATION = {
    'POISE': EXAMPLE_POISE_EXPLANATION,
    'READ': EXAMPLE_READ_EXPLANATION,
    'SUN': EXAMPLE_SUN_EXPLANATION
};

const DEFAULT_SELECTED_EXAMPLE_WORD = 'POISE'

const EXAMPLE_KEYBOARD_LAYOUT = getKeyLayout('POIUYTREWQLKJHGFDSAMNBVCXZ'.split(''));


/**
 * @class ViewingPhaseHelpPage
 * 
 * 
 */
class GoldenWordExamplesHelpPage {
    constructor() {
        this._keyboard;
        this._exampleWordExplanation;
        this._currSelectedExampleWord = null;

        // The main HTML Element
        this._page;
        this._initPage();
    };

    _initPage() {
        this._page = document.createElement('div');
        this._page.className = 'help__page';

        const subtitle = document.createElement('p');
        subtitle.className = 'help__subtitle';
        subtitle.textContent = 'Golden Words: Examples';

        const instrText = document.createElement('p');
        instrText.className = 'help__instr-text';
        instrText.innerHTML = PAGE_INSTRUCTIONS;

        const examplesContainer = this._createExamplesContainer();

        this._page.append(subtitle, instrText, examplesContainer);
    };

    _createExamplesContainer() {
        const examplesContainer = document.createElement('div');
        examplesContainer.className = 'help__keyboard__container';

        // Used to get for example keyboard
        this._keyboard = new Keyboard(EXAMPLE_KEYBOARD_LAYOUT);

        this._keyboard.highlightWord(DEFAULT_SELECTED_EXAMPLE_WORD);

        // Adjust keyboard styles to fit well in the window
        this._keyboard.HTMLElement.style.scale = '0.95';
        this._keyboard.HTMLElement.style.marginTop = '1.5em';
        this._keyboard.HTMLElement.style.marginBottom = '1em';

        const exampleWordsContainer = this._createExampleWordsContainer();

        this._exampleWordExplanation = document.createElement('p');
        this._exampleWordExplanation.className = 'help__instr-text';
        this._updateExampleWordExplanation(DEFAULT_SELECTED_EXAMPLE_WORD);

        examplesContainer.append(
            exampleWordsContainer,
            this._exampleWordExplanation,
            this._keyboard.HTMLElement
        );

        return examplesContainer;
    };

    _createExampleWordsContainer() {
        const exampleWordsContainer = document.createElement('div');
        exampleWordsContainer.className = 'help__eg-words__container';

        const exampleWordPOISE = this._createExampleWord('POISE');
        const exampleWordPLUM = this._createExampleWord('READ');
        const exampleWordTREE = this._createExampleWord('SUN');

        this._setupExampleWordEvent(exampleWordPOISE);
        this._setupExampleWordEvent(exampleWordPLUM);
        this._setupExampleWordEvent(exampleWordTREE);

        this._selectExampleWord(exampleWordPOISE);

        exampleWordsContainer.append(exampleWordPOISE, exampleWordPLUM, exampleWordTREE);

        return exampleWordsContainer;
    };

    _createExampleWord(word) {
        const exampleWord = document.createElement('p');
        exampleWord.className = 'help__eg-word';
        exampleWord.textContent = word;

        return exampleWord;
    };

    _setupExampleWordEvent(exampleWord) {
        exampleWord.addEventListener('click', () => {
            this._keyboard.unHighlightWord(
                this._currSelectedExampleWord.textContent
            );

            this._deselectExampleWord(this._currSelectedExampleWord);
            this._selectExampleWord(exampleWord);
            this._updateExampleWordExplanation(exampleWord.textContent);

            this._keyboard.highlightWord(exampleWord.textContent);
        })
    };

    _selectExampleWord(exampleWord) {
        exampleWord.classList.add('help__eg-word-selected');
        this._currSelectedExampleWord = exampleWord;
    };

    _deselectExampleWord(exampleWord) {
        exampleWord.classList.remove('help__eg-word-selected');
        this._currSelectedExampleWord = null;
    };

    _createExampleExplanation(explanation) {
        const exampleExplanation = document.createElement('p');
        exampleExplanation.className = 'help__instr-text';
        exampleExplanation.innerHTML = explanation;

        return exampleExplanation;
    };

    _updateExampleWordExplanation(word) {
        this._exampleWordExplanation.innerHTML = WORD_TO_EXPLANATION[word];
    };

    get HTMLElement() {
        return this._page;
    };

};

export default GoldenWordExamplesHelpPage;
