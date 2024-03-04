const PANEL_INSTRUCTIONS = `This is the <strong>second</strong>, and last,
                            <strong>part of the game</strong>&mdash;where
                            you put your memory to the test! The keys will
                            be removed, and you'll need to piece together
                            the entire keyboard from memory. <br><br><strong>
                            To make a guess for a key</strong>, drag and drop
                            the key into place on the keyboard.<br><br>
                            <strong>To remove a guess for a key</strong>,
                            click on the key and it will return to its original
                            spot.<br><br>`


/**
 * @class TestingPhaseHelpPanel
 * 
 * 
 */
class TestingPhaseHelpPanel {
    constructor() {
        // The main HTML Element
        this._panel;
        this._initPanel();
    };

    _initPanel() {
        this._panel = document.createElement('div');
        this._panel.className = 'help__panel';

        const subtitle = document.createElement('p');
        subtitle.className = 'help__subtitle';
        subtitle.textContent = '3. Testing phase'

        const instrText = document.createElement('p');
        instrText.className = 'help__instr-text';
        instrText.innerHTML = PANEL_INSTRUCTIONS;

        this._panel.append(subtitle, instrText);
    };

    get HTMLElement() {
        return this._panel;
    };
};

export default TestingPhaseHelpPanel;
