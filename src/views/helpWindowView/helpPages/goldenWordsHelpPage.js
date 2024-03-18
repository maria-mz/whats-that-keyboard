const PAGE_INSTRUCTIONS = `Golden Words are special words that <strong>help
                           you remember the positions of some keys.</strong>
                           This may be a useful strategy, to make sense of
                           the randomness of letters. <strong>There are no
                           right answers</strong>&mdash;they are just for you.
                           Golden Words are <strong>optional</strong>.
                           <br><br>
                           <strong>To track these words</strong>, you may add
                           them to the <strong>provided list</strong>. You'll
                           be able to see your list when making your guess,
                           but it cannot be interacted with at that time.`


/**
 * @class GoldenWordsHelpPage
 * 
 * 
 */
class GoldenWordsHelpPage {
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
        subtitle.textContent = 'Golden Words'

        const instrText = document.createElement('p');
        instrText.className = 'help__instr-text';
        instrText.innerHTML = PAGE_INSTRUCTIONS;

        this._page.append(subtitle, instrText);
    };

    get HTMLElement() {
        return this._page;
    };

};

export default GoldenWordsHelpPage;
