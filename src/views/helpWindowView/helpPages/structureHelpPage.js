const PAGE_INSTRUCTIONS = `There are <strong>two parts</strong> to this game.
                           <br><br>
                           <strong>1. Memorize</strong><br>The keyboard is
                           shown to you. You're encouraged to type with it
                           to practice your memory. This is also when you
                           would add your <strong>Golden Words...</strong>
                           <br><br>
                           <strong>2. Guess</strong><br>The keys are removed,
                           and you'll need to piece together the keyboard
                           from memory. Drag and drop the keys into place.`


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
