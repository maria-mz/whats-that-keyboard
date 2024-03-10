const PAGE_INSTRUCTIONS = `<strong>Each day</strong> will feature a <strong>
                           brand new layout</strong>, so you can test your
                           memory in a unique way each day. <br><br> The
                           game <strong>can only be done once</strong> per
                           day. So give it your best try!`


/**
 * @class ScoringHelpPage
 * 
 * 
 */
class ClosingHelpPage {
    constructor() {
        // The main HTML Element
        this._page;
        this._initPage();
    };

    _initPage() {
        this._page = document.createElement('div');
        this._page.className = 'help__page';

        const subtitle = document.createElement('p');
        subtitle.className = 'help__subtitle';
        subtitle.textContent = '5. Notes'

        const instrText = document.createElement('p');
        instrText.className = 'help__instr-text';
        instrText.innerHTML = PAGE_INSTRUCTIONS;

        this._page.append(subtitle, instrText);
    };

    get HTMLElement() {
        return this._page;
    };
};

export default ClosingHelpPage;
