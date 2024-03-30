const PAGE_INSTRUCTIONS = `<strong>What's that keyboard!</strong> It's unlike the typical
                           QWERTY layout you may be used to seeing. Go ahead, try typing...
                           <br><br>
                           Your challenge: <strong>memorize</strong> the
                           entire layout&mdash;<strong>all the keys.</strong>
                           <br><br>
                           This is a daily game, and therefore can only be completed
                           <strong>once</strong> per day. So give it your best try!`


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
