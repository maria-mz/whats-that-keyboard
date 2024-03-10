import PageNavigator from "../mainComponents/pageNavigator.js";
import ObjectiveHelpPage from "./helpPages/objectiveHelpPage.js";
import ViewingPhaseHelpPage from "./helpPages/viewingPhaseHelpPage.js";
import TestingPhaseHelpPage from "./helpPages/testingPhaseHelpPage.js";
import ScoringHelpPage from "./helpPages/scoringHelpPage.js";
import ClosingHelpPage from "./helpPages/closingHelpPage.js";

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
        this._overviewPage = new ObjectiveHelpPage();
        this._viewingPhasePage = new ViewingPhaseHelpPage();
        this._testingPhasePage = new TestingPhaseHelpPage();
        this._scoringPage = new ScoringHelpPage();
        this._closingPage = new ClosingHelpPage();

        this._currentPage = null;
    };

    _initMainContent() {
        this._helpContent = document.createElement('div');
        this._helpContent.className = 'help__content';

        const pageToCallback = {
            1: () => { this._switchPage(this._overviewPage.HTMLElement); },
            2: () => { this._switchPage(this._viewingPhasePage.HTMLElement); },
            3: () => { this._switchPage(this._testingPhasePage.HTMLElement); },
            4: () => { this._switchPage(this._scoringPage.HTMLElement); },
            5: () => { this._switchPage(this._closingPage.HTMLElement); },
        };

        this._navigator = new PageNavigator(1, 1, 5, pageToCallback);

        // Update navigator styles a bit so it fits well in the window
        this._navigator.HTMLElement.style.marginRight = '2em';
        this._navigator.HTMLElement.style.marginBottom = '2em';

        this._helpContent.append(this._navigator.HTMLElement);
    };

    _initWindow() {
        const header = this._createWindowHeader();

        // The main HTML Element
        this._helpWindow = document.createElement('section');
        this._helpWindow.className = 'help__window';
        this._helpWindow.append(header, this._helpContent);;
    }

    _createWindowHeader() {
        const title = this._createWindowTitle();
        const exitIcon = this._createExitIcon();
        this._setupExitIconEvent(exitIcon);

        const header = document.createElement('div');
        header.className = 'help__header'
        header.append(title, exitIcon);

        return header;
    };

    _createWindowTitle() {
        const title = document.createElement('p');
        title.className = 'help__header__title';
        title.textContent = 'How to Play';

        return title;
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
        document.body.append(this._windowOverlay);
        document.body.append(this._helpWindow);
    };

    removeWindow() {
        this._windowOverlay.remove();
        this._helpWindow.remove();
    };

    resetPageView() {
        this._navigator.updatePageNumberView(DEFAULT_PAGE_NUMBER);
    };
};

export default HelpWindowView;
