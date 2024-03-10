const PAGE_INSTRUCTIONS = `<strong>Welcome to the game!</strong><br><br>
                           You'll be shown an illustrated keyboard with a
                           <strong>randomized layout.</strong> Unlike the
                           typical QWERTY layout you may be used to seeing.
                           <br><br> Your objective: <strong>memorize</strong>
                           the entire layout&mdash;<strong>all the keys.</strong>`


/**
 * @class ObjectiveHelpPage
 * 
 * 
 */
class ObjectiveHelpPage {
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
        subtitle.textContent = '1. Objective'

        const instrText = document.createElement('p');
        instrText.className = 'help__instr-text';
        instrText.innerHTML = PAGE_INSTRUCTIONS;

        this._page.append(subtitle, instrText);
    };

    get HTMLElement() {
        return this._page;
    };

};

export default ObjectiveHelpPage;
