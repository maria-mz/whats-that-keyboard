import MainHeaderController from "./controllers/mainHeaderController.js";
import LandingPageController from "./controllers/landingPageController.js";
import ViewPhaseController from "./controllers/viewPhaseController.js";
import TestPhaseController from "./controllers/testPhaseController.js";
import ResultsPhaseController from "./controllers/resultsPhaseController.js";

import { GameModel } from "./gameModel.js";

/**
 * @class App
 * 
 * 
 */
class App {
    constructor() {
        const dateNow = new Date();
        const gameDate = new Date(
            dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate()
        );

        this.model = new GameModel(gameDate);

        this.landingPageController = new LandingPageController(this.model);
        this.mainHeaderController =  new MainHeaderController(this.model);
        this.viewPhaseController = new ViewPhaseController(this.model);
        this.testPhaseController = new TestPhaseController(this.model);
        this.resultsPhaseController = new ResultsPhaseController(this.model);
    };
};

document.addEventListener("DOMContentLoaded", () => {
    // Start app
    new App()
});
