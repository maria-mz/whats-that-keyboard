/**
 * Represents a functional HTML component for page navigation.
 * 
 * This component is meant to be used within another component. It uses the
 * callback functions provided by the parent component to respond to user
 * interactions and apply page changes.
 */
class PageNavigator {
    /**
     * Creates a new `PageNavigator` component.
     * 
     * @param {number} startPageNumber - The initial page number
     * @param {number} minPageNumber - The minimum page number allowed
     * @param {number} maxPageNumber - The maximum page number allowed
     * @param {object} pageNumberToCallbacks - A mapping of page numbers to callback functions
     */
    constructor(startPageNumber, minPageNumber, maxPageNumber, pageNumberToCallbacks) {
        this._pageNumberToCallbacks = pageNumberToCallbacks;

        this._currPageNumber = startPageNumber;
        this._minPageNumber = minPageNumber;
        this._maxPageNumber = maxPageNumber;

        this._prevNavBtn;
        this._nextNavBtn;
        this._navText;

        this._pageNavigator = this._createPageNavigator(startPageNumber);

        this._pageNumberToCallbacks[startPageNumber]();
    };

    _createPageNavigator(startPageNumber) {
        const navContainer = document.createElement('div');
        navContainer.className = 'page-nav__container';

        this._prevNavBtn = this._createPrevNavBtn(startPageNumber);
        this._nextNavBtn = this._createNextNavBtn(startPageNumber);

        this._updateBtnHover(startPageNumber);
        this._setupNavBtnEvents();

        this._navText = this._createNavText(startPageNumber);

        navContainer.append(this._prevNavBtn, this._navText, this._nextNavBtn);

        return navContainer;
    };

    _createPrevNavBtn() {
        const prevNavBtn = document.createElement('div');
        prevNavBtn.classList.add('page-nav__btn', 'page-nav__prev-btn');

        const prevIcon = document.createElement('i');
        prevIcon.classList.add('fa-solid', 'fa-angle-left');

        prevNavBtn.append(prevIcon);

        return prevNavBtn;
    };

    _createNextNavBtn() {
        const nextNavBtn = document.createElement('div');
        nextNavBtn.classList.add('page-nav__btn', 'page-nav__next-btn');

        const nextIcon = document.createElement('i');
        nextIcon.classList.add('fa-solid', 'fa-angle-right');

        nextNavBtn.append(nextIcon);

        return nextNavBtn;
    };

    _createNavText(startPageNumber) {
        const navText = document.createElement('div');
        navText.className = 'page-nav__text';
        this._setNavTextPageNumber(navText, startPageNumber)

        return navText;
    };

    _setNavTextPageNumber(navText, pageNumber) {
        navText.textContent = `${pageNumber} of ${this._maxPageNumber}`;
    }

    _setupNavBtnEvents() {
        this._prevNavBtn.addEventListener('click', () => {
            if (this._currPageNumber == this._minPageNumber) {
                // Do nothing, as if not registering the click
                return;
            };

            this.updatePageNumberView(this._currPageNumber - 1);
        });

        this._nextNavBtn.addEventListener('click', () => {
            if (this._currPageNumber == this._maxPageNumber) {
                // Do nothing, as if not registering the click
                return;
            };

            this.updatePageNumberView(this._currPageNumber + 1);
        });
    };

    updatePageNumberView(newPageNumber) {
        this._currPageNumber = newPageNumber;

        this._setNavTextPageNumber(this._navText, this._currPageNumber)
        this._updateBtnHover(this._currPageNumber);
        this._pageNumberToCallbacks[this._currPageNumber]();
    };

    _disableNavBtnHover(navBtn) {
        navBtn.classList.remove('page-nav__btn-hoverable');
        navBtn.onmouseenter = null;
        navBtn.onmouseleave = null;

        const icon = navBtn.querySelector('.fa-solid');
        icon.style.opacity = '0.4';
        // Make sure to return colour in case was in hover state,
        // otherwise icon will still look hovered
        icon.style.color = '';
    };

    _enableNavBtnHover(navBtn) {
        navBtn.classList.add('page-nav__btn-hoverable');
        navBtn.style.borderColor = '';

        const icon = navBtn.querySelector('.fa-solid');
        icon.style.opacity = '';

        navBtn.onmouseenter = () => { icon.style.color = 'white'; };
        navBtn.onmouseleave = () => { icon.style.color = ''; };
    };

    _updateBtnHover(newPageNumber) {
        if (newPageNumber == this._minPageNumber) {
            this._disableNavBtnHover(this._prevNavBtn);
        }
        else {
            this._enableNavBtnHover(this._prevNavBtn);
        };

        if (newPageNumber == this._maxPageNumber) {
            this._disableNavBtnHover(this._nextNavBtn);
        }
        else {
            this._enableNavBtnHover(this._nextNavBtn);
        };
    };

    /**
     * Retrieves the HTML element of the page navigator.
     * 
     * @returns {HTMLElement} - The page navigator HTML element
     */
    get HTMLElement() {
        return this._pageNavigator;
    };
};

export default PageNavigator;
