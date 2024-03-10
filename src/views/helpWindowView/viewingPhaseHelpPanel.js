import Keyboard from "../keyboard.js";
import { getKeyLayout } from "../../utils.js";


const PANEL_INSTRUCTIONS = `This is the <strong>first part of the game</strong>
                            &mdash;where you see the layout.<br><br><strong>To
                            help with memorizing</strong>, you're encouraged to
                            think of <strong>words</strong> whose placement of
                            letters on the keyboard make it easy for you to
                            remember. We'll refer to these intentional words
                            as <strong>Golden Words</strong>. <br><br><strong>
                            To track these words</strong>, you can add them to
                            the <strong>provided list</strong>. You'll be able
                            to see this list in the Testing phase. <br><br>
                            <strong>Examples of Golden Words</strong>, for a
                            particular layout:`

const EXAMPLE_POISE_EXPLANATION = `Can help place 5 keys. <strong>P</strong>,
                                   <strong>O</strong>, <strong>I</strong> are
                                   in sequence in the corner. <strong>S</strong>,
                                   <strong>E</strong> are close together at the
                                   other end.`;

const EXAMPLE_PLUM_EXPLANATION = `Can help place 4 keys. <strong>P</strong>,
                                  <strong>L</strong>, <strong>M</strong> are in
                                  sequence diagonally. <strong>U</strong> is next
                                  to <strong>I</strong> (which can be determined
                                  from <strong>POISE</strong>, for example).`;

const EXAMPLE_TREE_EXPLANATION = `Can help place 3 keys. Working backwards from
                                  <strong>E</strong> (which can be determined from
                                  <strong>POISE</strong>, for example), <strong>R
                                  </strong> is next to <strong>T</strong>.`;

const WORD_TO_EXPLANATION = {
    'POISE': EXAMPLE_POISE_EXPLANATION,
    'PLUM': EXAMPLE_PLUM_EXPLANATION,
    'TREE': EXAMPLE_TREE_EXPLANATION
};

const DEFAULT_SELECTED_EXAMPLE_WORD = 'POISE'

const EXAMPLE_KEYBOARD_LAYOUT = getKeyLayout('POIUYTREWQLKJHGFDSAMNBVCXZ'.split(''));


/**
 * @class ViewingPhaseHelpPanel
 * 
 * 
 */
class ViewingPhaseHelpPanel {
    constructor() {
        this._keyboard;
        this._exampleWordExplanation;
        this._currSelectedExampleWord = null;

        // The main HTML Element
        this._panel;
        this._initPanel();
    };

    _initPanel() {
        this._panel = document.createElement('div');
        this._panel.className = 'help__panel';

        const subtitle = document.createElement('p');
        subtitle.className = 'help__subtitle';
        subtitle.textContent = '2. Viewing phase';

        const instrText = document.createElement('p');
        instrText.className = 'help__instr-text';
        instrText.innerHTML = PANEL_INSTRUCTIONS;

        const examplesContainer = this._createExamplesContainer();

        this._panel.append(subtitle, instrText, examplesContainer);
    };

    _createExamplesContainer() {
        const examplesContainer = document.createElement('div');
        examplesContainer.className = 'help__keyboard__container';
        
        // Used to get for example keyboard
        this._keyboard = new Keyboard(EXAMPLE_KEYBOARD_LAYOUT);

        this._keyboard.highlightWord(DEFAULT_SELECTED_EXAMPLE_WORD);

        // Make the keyboard look a bit smaller
        this._keyboard.HTMLElement.style.scale = '0.8';

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
        const exampleWordPLUM = this._createExampleWord('PLUM');
        const exampleWordTREE = this._createExampleWord('TREE');

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
        return this._panel;
    };

};

export default ViewingPhaseHelpPanel;
