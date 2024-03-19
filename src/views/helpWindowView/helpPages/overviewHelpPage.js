const PAGE_INSTRUCTIONS = `You'll be shown an illustrated keyboard with a
                           <strong>randomized layout.</strong> Unlike the
                           typical QWERTY layout you may be used to seeing.
                           <br><br>
                           Your challenge is to <strong>memorize</strong> the
                           entire layout&mdash;<strong>all the keys.</strong>
                           <br><br>
                           Each day will feature a brand new layout, so you
                           can hopefully test your memory in a unique way.
                           The game is designed to be completed
                           <strong>once.</strong> So give it your best try!`


/**
 * @class OverviewHelpPage
 * 
 * 
 */
class OverviewHelpPage {
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
        subtitle.textContent = 'Overview'

        const instrText = document.createElement('p');
        instrText.className = 'help__instr-text';
        instrText.innerHTML = PAGE_INSTRUCTIONS;

        this._page.append(subtitle, instrText);
    };

    get HTMLElement() {
        return this._page;
    };

};

export default OverviewHelpPage;
