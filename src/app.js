import ViewPhaseController from "./controllers/viewPhaseController.js";
import TestPhaseController from "./controllers/testPhaseController.js";
import ResultsPhaseController from "./controllers/resultsPhaseController.js";

import GameModel from "./gameModel.js";


/**
 * @class App
 * 
 * 
 */
class App {
    constructor() {
        this.model = new GameModel();

        this.viewPhaseController = new ViewPhaseController(this.model);
        this.testPhaseController = new TestPhaseController(this.model);
        this.resultsPhaseController = new ResultsPhaseController(this.model);
    }
}

// Start app
new App()
