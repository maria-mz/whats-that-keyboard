const PAGE_INSTRUCTIONS = `You'll simply be scored on the <strong>number of
                           keys guessed correctly</strong>. The highest score
                           possible is 26 / 26. <br><br> You can see your
                           scores and all-time stats under <strong>Statistics
                           </strong> (<span style="font-style: italic">Coming
                           soon...</span>).`


/**
 * @class ScoringHelpPage
 * 
 * 
 */
class ScoringHelpPage {
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
        subtitle.textContent = '4. Scoring'

        const instrText = document.createElement('p');
        instrText.className = 'help__instr-text';
        instrText.innerHTML = PAGE_INSTRUCTIONS;

        this._page.append(subtitle, instrText);
    };

    get HTMLElement() {
        return this._page;
    };
};

export default ScoringHelpPage;
