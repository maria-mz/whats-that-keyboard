import LandingPageView from "../views/landingPageView.js";
import { subscribeEvent } from "../eventBus.js";


/**
 * Manages display for the Landing Page.
 */
class LandingPageController {
    constructor(gameModel) {
        this.model = gameModel;

        this.view = new LandingPageView(this.model.getGameDate());
        this.view.displayView();

        this._subscribeToEvents();
    };

    _subscribeToEvents() {
        subscribeEvent('playBtnClicked', () => { this.view.removeView(); });
    };

};

export default LandingPageController;
