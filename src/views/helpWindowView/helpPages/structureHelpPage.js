const PAGE_INSTRUCTIONS = `There are <strong>two parts</strong> to this game.
                           <br><br>
                           <strong>1. Memorize</strong>. The entire keyboard is
                           shown for you to memorize. You're encouraged to type
                           with it to practice your memory. This is also when
                           you would add your <strong>Golden Words</strong>.
                           <br><br>
                           <strong>2. Guess</strong>. The keys are removed,
                           and you'll need to piece together the entire
                           keyboard from memory. You only have <strong>one
                           guess</strong>!`


/**
 * @class StructureHelpPage
 * 
 * 
 */
class StructureHelpPage {
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
        subtitle.textContent = 'Structure'

        const instrText = document.createElement('p');
        instrText.className = 'help__instr-text';
        instrText.innerHTML = PAGE_INSTRUCTIONS;

        this._page.append(subtitle, instrText);
    };

    get HTMLElement() {
        return this._page;
    };

};

export default StructureHelpPage;
