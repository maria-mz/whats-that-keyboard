import HelpWindowView from "../views/helpWindowView/helpWindowView.js";
import MainHeaderView from "../views/mainHeaderView.js";

import { subscribeEvent } from "../eventBus.js";


/**
 * @class MainHeaderController
 * 
 * 
 */
class MainHeaderController {
    constructor(gameModel) {
        this.model = gameModel;

        this.mainHeaderView = new MainHeaderView();
        this.helpWindowView = new HelpWindowView();
        // TODO: Add stats and settings

        this._subscribeToHeaderEvents();
        this._subscribeToWindowEvents();

        subscribeEvent(
            'playBtnClicked', () => { this.mainHeaderView.displayView(); }
        );
    };

    _subscribeToHeaderEvents() {
        subscribeEvent('helpIconClicked', this._displayHelpWindow.bind(this));
    };

    _subscribeToWindowEvents() {
        subscribeEvent('helpWindowExitClicked', this._removeDisplayWindow.bind(this));
    };

    _displayHelpWindow() {
        this.helpWindowView.resetPageView();
        this.helpWindowView.displayWindow();
    };

    _removeDisplayWindow() {
        this.helpWindowView.removeWindow();
    };
};

export default MainHeaderController;
