const PANEL_INSTRUCTIONS = `<strong>Each day</strong> will feature a <strong>
                            brand new layout</strong>, so you can test your
                            memory in a unique way each day. <br><br> The
                            game <strong>can only be done once</strong> per
                            day. So give it your best try!`


/**
 * @class ScoringHelpPanel
 * 
 * 
 */
class ClosingHelpPanel {
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
        subtitle.textContent = '5. Notes'

        const instrText = document.createElement('p');
        instrText.className = 'help__instr-text';
        instrText.innerHTML = PANEL_INSTRUCTIONS;

        this._panel.append(subtitle, instrText);
    };

    get HTMLElement() {
        return this._panel;
    };
};

export default ClosingHelpPanel;
