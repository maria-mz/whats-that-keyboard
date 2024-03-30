import PageNavigator from "../components/pageNavigator.js";

import OverviewHelpPage from "./helpPages/overviewHelpPage.js";
import StructureHelpPage from "./helpPages/structureHelpPage.js";
import GoldenWordsHelpPage from "./helpPages/goldenWordsHelpPage.js";
import GoldenWordExamplesHelpPage from "./helpPages/goldenWordExamplesHelpPage.js";
import ScoringHelpPage from "./helpPages/scoringHelpPage.js";

import { publishEvent } from "../../eventBus.js";


const DEFAULT_PAGE_NUMBER = 1


/**
 * @class HelpWindowView
 * 
 * 
 */
class HelpWindowView {
    constructor() {
        this._initPages();
        this._initMainContent();
        this._initWindow();

        this._windowOverlay = document.createElement('div');
        this._windowOverlay.className = 'popup-overlay';
    };

    _initPages() {
        this._overviewPage = new OverviewHelpPage();
        this._structurePage = new StructureHelpPage();
        this._goldenWordsPage = new GoldenWordsHelpPage();
        this._goldenWordExamplesPage = new GoldenWordExamplesHelpPage();
        this._scoringPage = new ScoringHelpPage();

        this._currentPage = null;
    };

    _initMainContent() {
        this._helpContent = document.createElement('div');
        this._helpContent.className = 'help__content';

        const pageToCallback = {
            1: () => { this._switchPage(this._overviewPage.HTMLElement); },
            2: () => { this._switchPage(this._structurePage.HTMLElement); },
            3: () => { this._switchPage(this._goldenWordsPage.HTMLElement); },
            4: () => { this._switchPage(this._goldenWordExamplesPage.HTMLElement); },
            5: () => { this._switchPage(this._scoringPage.HTMLElement); }
        };

        this._navigator = new PageNavigator(1, 1, 5, pageToCallback);

        // Update navigator styles a bit so it fits well in the window
        this._navigator.HTMLElement.style.marginRight = '2em';
        this._navigator.HTMLElement.style.marginBottom = '2em';

        this._helpContent.append(this._navigator.HTMLElement);
    };

    _initWindow() {
        const windowHeader = this._createWindowHeader();

        // The main HTML Element
        this._helpWindow = document.createElement('section');
        this._helpWindow.className = 'help__window';
        this._helpWindow.append(windowHeader, this._helpContent);
    };

    _createWindowHeader() {
        const title = this._createWindowTitle();
        const exitIcon = this._createExitIcon();
        this._setupExitIconEvent(exitIcon);

        const windowHeader = document.createElement('div');
        windowHeader.className = 'help__header'
        windowHeader.append(title, exitIcon);

        return windowHeader;
    };

    _createWindowTitle() {
        const windowTitle = document.createElement('p');
        windowTitle.className = 'help__header__title';
        windowTitle.textContent = 'How to Play';

        return windowTitle;
    };

    _createExitIcon() {
        const exitIcon = document.createElement('i');
        exitIcon.classList.add('fa-solid', 'fa-xmark', 'help__exit-icon');

        return exitIcon;
    };

    _setupExitIconEvent(exitIcon) {
        exitIcon.addEventListener('click', () => {
            publishEvent('helpWindowExitClicked');
        });
    };

    _switchPage(newPage) {
        if (this._currentPage) {
            this._currentPage.remove();
        };
        this._helpContent.insertBefore(newPage, this._helpContent.firstChild);
        this._currentPage = newPage;
    };

    displayWindow() {
        this._helpWindow.classList.add('window-slide-up-anim');
        document.body.append(this._windowOverlay);
        document.body.append(this._helpWindow);
    };

    removeWindow() {
        this._helpWindow.classList.remove('window-slide-up-anim');
        this._windowOverlay.remove();
        this._helpWindow.remove();
    };

    resetPageView() {
        this._navigator.updatePageNumberView(DEFAULT_PAGE_NUMBER);
    };
};

export default HelpWindowView;
