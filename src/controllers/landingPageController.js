import LandingPageView from "../views/landingPageView.js";
import { subscribeEvent } from "../eventBus.js";


/**
 * @class LandingPageController
 * 
 * 
 */
class LandingPageController {
    constructor(gameModel) {
        this.model = gameModel;

        this.view = new LandingPageView();
        this.view.displayView();

        this._subscribeToEvents();
    };

    _subscribeToEvents() {
        subscribeEvent('playBtnClicked', () => { this.view.removeView(); });
    };

};

export default LandingPageController;
