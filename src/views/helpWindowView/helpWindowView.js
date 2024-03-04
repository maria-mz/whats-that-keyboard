import PageNavigator from "../pageNavigator.js";
import ObjectiveHelpPanel from "./objectiveHelpPanel.js";
import ViewingPhaseHelpPanel from "./viewingPhaseHelpPanel.js";
import TestingPhaseHelpPanel from "./testingPhaseHelpPanel.js";
import ScoringHelpPanel from "./scoringHelpPanel.js";
import ClosingHelpPanel from "./closingHelpPanel.js";

import { publishEvent } from "../../eventBus.js";


const DEFAULT_PAGE_NUMBER = 1


/**
 * @class HelpWindowView
 * 
 * 
 */
class HelpWindowView {
    constructor() {
        this._initPanels();
        this._initMainContent();
        this._initWindow();

        this._windowOverlay = document.createElement('div');
        this._windowOverlay.className = 'popup-overlay';
    };

    _initPanels() {
        this._overviewPanel = new ObjectiveHelpPanel();
        this._viewingPhasePanel = new ViewingPhaseHelpPanel();
        this._testingPhasePanel = new TestingPhaseHelpPanel();
        this._scoringPanel = new ScoringHelpPanel();
        this._closingPanel = new ClosingHelpPanel();

        this._currentPanel = null;
    };

    _initMainContent() {
        this._helpContent = document.createElement('div');
        this._helpContent.className = 'help__content';

        const pageToCallback = {
            1: () => { this._switchPanel(this._overviewPanel.HTMLElement); },
            2: () => { this._switchPanel(this._viewingPhasePanel.HTMLElement); },
            3: () => { this._switchPanel(this._testingPhasePanel.HTMLElement); },
            4: () => { this._switchPanel(this._scoringPanel.HTMLElement); },
            5: () => { this._switchPanel(this._closingPanel.HTMLElement); },
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

    _switchPanel(newPanel) {
        if (this.currentPanel) {
            this.currentPanel.remove();
        };
        this._helpContent.insertBefore(newPanel, this._helpContent.firstChild);
        this.currentPanel = newPanel;
    };

    get HTMLElement() {
        return this._helpWindow;
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
