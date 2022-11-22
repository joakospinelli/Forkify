import View from "./view";

class addRecipe extends View {

    _parent = document.querySelector('.upload');
    _window = document.querySelector('.add-recipe-window');
    _overlay = document.querySelector('.overlay');
    _btnOpen = document.querySelector('.nav__btn--add-recipe');
    _btnClose = document.querySelector('.btn--close-modal');
    _msg = 'Recipe uploaded!';

    constructor(){
        super();
        this._addHandlerShowWindow();
        this._addHandlerCloseWindow();
    }

    _generateHtml() {

    }
    
    toggleWindow(){
        this._window.classList.toggle('hidden');
        this._overlay.classList.toggle('hidden');
    }

    _addHandlerShowWindow() {
        this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
    }

    _addHandlerCloseWindow() {
        this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
        this._overlay.addEventListener('click', this.toggleWindow.bind(this));
    }

    addHandlerUpload(handler){
        this._parent.addEventListener('submit', function(e) {
            e.preventDefault();
            const data = Object.fromEntries([...new FormData(this)]);
            handler(data);
        })
    }
}

export default new addRecipe();