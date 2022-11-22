import View from "./view";

class Search extends View {

    _parent = document.querySelector('.search')

    getQuery() {
        return this._parent.querySelector('.search__field').value;
    }

    addHandlerSearch(handler) {
        this._parent.addEventListener('submit', (e) => {
            e.preventDefault();
            handler();
        });
    }
}

export default new Search();