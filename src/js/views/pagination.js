import View from "./view";
import icons from 'url:../../img/icons.svg'; // import necesario para que parcel reconozca los íconos

class Pagination extends View {

    _parent = document.querySelector('.pagination');

    addHandlerClick(handler) {
        this._parent.addEventListener('click', function(e) {
            const btn = e.target.closest('.btn--inline');

            if (!btn) return;

            const goTo = +btn.dataset.goto;

            handler(goTo);
        });
    }

    _generateHtml(){

        const pages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
        
        if (this._data.page === 1 && pages > 1){
            return `
            <button class="btn--inline pagination__btn--next" data-goto="${this._data.page + 1}">
                <span>Page ${this._data.page + 1}</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
            `
        }

        if (this._data.page === pages && pages > 1){
            return `
            <button class="btn--inline pagination__btn--prev" data-goto="${this._data.page - 1}">
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${this._data.page - 1}</span>
            </button>
            `;
        }

        if (this._data.page < pages){
            return `
            <button class="btn--inline pagination__btn--prev" data-goto="${this._data.page - 1}">
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${this._data.page - 1}</span>
            </button>
            <button class="btn--inline pagination__btn--next" data-goto="${this._data.page + 1}">
                <span>Page ${this._data.page + 1}</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
            `;
        }

        return ``;
    }
}

export default new Pagination();