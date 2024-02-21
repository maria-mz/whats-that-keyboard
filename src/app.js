import ViewPhaseController from "./controllers/viewPhaseController.js";
import TestPhaseController from "./controllers/testPhaseController.js";

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
    }
}

// Start app
new App()
