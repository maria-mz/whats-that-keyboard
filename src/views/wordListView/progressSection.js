const COLOUR_PROGRESS_LOW = '#d1002d';
const COLOUR_PROGRESS_OK = '#fdad0c';
const COLOUR_PROGRESS_GOOD = '#8bdc83';
const COLOUR_PROGRESS_GREAT = '#178317'


/**
 * @class ProgressSection
 * 
 * Represents the display for Progress Section in Word List view, and handles
 * some functionality for updating said display.
 * 
 * This Progress Section is a visual indicator to show how many unique letters
 * (or keys) have been covered by the current words in the Word List.
 * The more letters covered, the better.
 */
class ProgressSection {
    constructor() {
        // Actual HTML Element
        this._progressSection = this._createProgressSection();
    };

    /**
     * Create HTML Element for the entire Progress Section
     */
    _createProgressSection() {
        const progessSection = document.createElement('section');
        const progressTextContainer = this._createProgressTextContainer();
        const progressBarContainer = this._createProgressBarContainer();

        progessSection.append(progressTextContainer, progressBarContainer)

        return progessSection;
    };

    /**
     * Create HTML Element that contains the text above the progress bar
     */
    _createProgressTextContainer() {
        const progressTextContainer = document.createElement('div');
        progressTextContainer.className = 'word-list__progress-text__container';

        const progressTitle = this._createProgressTextTitle();
        const coverageText = this._createProgressTextConverage();

        progressTextContainer.append(progressTitle, coverageText);

        return progressTextContainer;
    };

    /**
     * Create HTML Element for the text above the progress bar that shows the
     * title of the progress bar
     */
    _createProgressTextTitle() {
        const title = document.createElement('p');
        title.className = 'word-list__progress-text__title';
        title.textContent = 'Keys Coverage';

        return title;
    };

    /**
     * Create HTML Element for the text above the progress bar that shows the
     * letter coverage numbers
     */
    _createProgressTextConverage() {
        const coverageText = document.createElement('p');
        coverageText.className = 'word-list__progress-text__coverage';
        coverageText.textContent = '0 / 26';

        return coverageText;
    };

    /**
     * Create HTML Element that contains the adjustable progress bar
     */
    _createProgressBarContainer() {
        const progressBarContainer = document.createElement('div');
        progressBarContainer.className = 'word-list__progress-bar__container';

        const progressBar = document.createElement('div');
        progressBar.className = 'word-list__progress-bar';

        progressBarContainer.append(progressBar);

        return progressBarContainer;
    };

    /**
     * Calculate the coverage of unique letters in the provided word set
     * 
     * @param {Set<string>} wordsSet - The set of words to analyze for letter coverage
     * @returns {number} The number of unique letters covered in the word set
     */
    _getLetterCoverage(wordsSet) {
        const concatenatedWords = Array.from(wordsSet).join("").toLowerCase();
        const includedLetters = new Set()

        for (let i = 0; i < concatenatedWords.length; i++) {
            includedLetters.add(concatenatedWords[i]);
        };

        return includedLetters.size;
    };

    /**
     * Update the letter coverage value
     * 
     * @param {number} newCoverage - The new letter coverage to show
     */
    _updateProgressCoverageText(newCoverage) {
        const coverageText = this._progressSection.querySelector(
            '.word-list__progress-text__coverage'
        );
        coverageText.textContent = `${newCoverage} / 26`
    };

    /**
     * Update the width (by percentage) and colour of the progress bar
     * 
     * @param {number} percentage - The percentage to have filled
     * @param {string} barColour - The color code (hex)
     */
    _updateProgressBar(percentage, barColour) {
        const progressBar = this._progressSection.querySelector(
            '.word-list__progress-bar'
        );
        progressBar.style.width = `${percentage}%`
        progressBar.style.background = barColour;
    };

    /**
     * Determine the color of the progress bar based on the letter coverage
     * 
     * @param {number} coverage - The number of letters covered
     * @returns {string} The color code (hex)
     */
    _getProgressBarColour(coverage) {
        if (coverage < 10) { return COLOUR_PROGRESS_LOW; };
        if (coverage >= 10 && coverage < 20) { return COLOUR_PROGRESS_OK };
        if (coverage >= 20 && coverage < 23) { return COLOUR_PROGRESS_GOOD };
        if (coverage >= 23) { return COLOUR_PROGRESS_GREAT };
    };

    /**
     * Update the progress display based on the coverage of letters in the
     * provided word set
     * 
     * @param {Set<string>} wordsSet - The set of words to analyze and translate
     *      to visual progress
     */
    updateProgress(wordsSet) {
        const coverage = this._getLetterCoverage(wordsSet);
        const percentCoverage = (coverage / 26) * 100;

        this._updateProgressCoverageText(coverage);
        this._updateProgressBar(
            percentCoverage, this._getProgressBarColour(coverage)
        );
    };

    /**
     * Retrieve the Progress Section HTML Element
     */
    get HTMLElement() {
        return this._progressSection;
    };
};

export default ProgressSection;
