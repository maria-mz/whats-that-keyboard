const PANEL_INSTRUCTIONS = `<strong>Welcome to the game!</strong><br><br>
                            You'll be shown an illustrated keyboard with a
                            <strong>randomized layout.</strong> Unlike the
                            typical QWERTY layout you may be used to seeing.
                            <br><br> Your objective: <strong>memorize</strong>
                            the entire layout&mdash;<strong>all the keys.</strong>`


/**
 * @class ObjectiveHelpPanel
 * 
 * 
 */
class ObjectiveHelpPanel {
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
        subtitle.textContent = '1. Objective'

        const instrText = document.createElement('p');
        instrText.className = 'help__instr-text';
        instrText.innerHTML = PANEL_INSTRUCTIONS;

        this._panel.append(subtitle, instrText);
    };

    get HTMLElement() {
        return this._panel;
    };

};

export default ObjectiveHelpPanel;
