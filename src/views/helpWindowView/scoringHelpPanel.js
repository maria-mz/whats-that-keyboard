const PANEL_INSTRUCTIONS = `You'll simply be scored on the <strong>number of
                            keys guessed correctly</strong>. The highest score
                            possible is 26 / 26. <br><br> You can see your
                            scores and all-time stats under <strong>Statistics
                            </strong> (<span style="font-style: italic">Coming
                            soon...</span>).`


/**
 * @class ScoringHelpPanel
 * 
 * 
 */
class ScoringHelpPanel {
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
        subtitle.textContent = '4. Scoring'

        const instrText = document.createElement('p');
        instrText.className = 'help__instr-text';
        instrText.innerHTML = PANEL_INSTRUCTIONS;

        this._panel.append(subtitle, instrText);
    };

    get HTMLElement() {
        return this._panel;
    };
};

export default ScoringHelpPanel;
