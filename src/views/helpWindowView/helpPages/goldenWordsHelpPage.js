const PAGE_INSTRUCTIONS = `What are Golden Words? These are intentional words that
                           <strong>help you remember the positions of some keys.
                           </strong> This may be a useful strategy... There are no
                           right answers&mdash;they are just for you. Golden Words
                           are <strong>optional</strong>.
                           <br><br>
                           You may add these words to the <strong>provided
                           list</strong>, but they must be <strong>valid</strong>.
                           Valid words are <strong>at least three letters long,
                           </strong> and <strong>found in our word bank.</strong>
                           You'll be able to see this list when making your guess,
                           but it cannot be interacted with at that time.
                           <br><br>
                           Check out the next page for some examples!`


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
