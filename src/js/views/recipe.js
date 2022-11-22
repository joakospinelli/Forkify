import icons from 'url:../../img/icons.svg'; // import necesario para que parcel reconozca los íconos
import View from './view';

class Recipe extends View {
    _parent = document.querySelector('.recipe');
    _msg = '';
    _errorMsg = 'Recipe not found.';

    _generateHtml() {
        return `
        <figure class="recipe__fig">
        <img src="${this._data.image}" alt="${this._data.title}" class="recipe__img" />
        <h1 class="recipe__title">
            <span>${this._data.title}</span>
        </h1>
        </figure>

        <div class="recipe__details">
        <div class="recipe__info">
            <svg class="recipe__info-icon">
            <use href="${icons}g#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${this._data.cookingTime}</span>
            <span class="recipe__info-text">minutes</span>
        </div>
        <div class="recipe__info">
            <svg class="recipe__info-icon">
            <use href="${icons}g#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${this._data.servings}</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
            <button class="btn--tiny btn--update-servings" data-update-to="${this._data.servings - 1}">
                <svg>
                <use href="${icons}g#icon-minus-circle"></use>
                </svg>
            </button>
            <button class="btn--tiny btn--update-servings" data-update-to="${this._data.servings + 1}">
                <svg>
                <use href="${icons}g#icon-plus-circle"></use>
                </svg>
            </button>
            </div>
        </div>

        <div class="recipe__user-generated ${!this._data.key ? 'hidden' : ''}">
            <svg>
                <use href="${icons}#icon-user"></use>
            </svg>
        </div>
        <button class="btn--round btn--bookmark">
            <svg class="">
            <use href="${icons}g#icon-bookmark${this._data.bookmarked ? '-fill' : ''}"></use>
            </svg>
        </button>
        </div>

        <div class="recipe__ingredients">
        <h2 class="heading--2">Recipe ingredients</h2>
        <ul class="recipe__ingredient-list">
            ${this._data.ingredients.map(i => `
            <li class="recipe__ingredient">
            <svg class="recipe__icon">
                <use href="${icons}g#icon-check"></use>
            </svg>
            <div class="recipe__quantity">${i.quantity ? i.quantity : ''}</div>
            <div class="recipe__description">
                <span class="recipe__unit">${i.unit}</span>
                ${i.description}
            </div>
            </li>
            `).join('')}
        </ul>
        </div>

        <div class="recipe__directions">
        <h2 class="heading--2">How to cook it</h2>
        <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${this._data.publisher}</span>. Please check out
            directions at their website.
        </p>
        <a
            class="btn--small recipe__btn"
            href="${this._data.sourceUrl}"
            target="_blank">
            <span>Directions</span>
            <svg class="search__icon">
            <use href="${icons}g#icon-arrow-right"></use>
            </svg>
        </a>
        </div>
        `
    }

    addHandlerRender(handler){
        const events = ['hashchange', 'load'];
        events.forEach(event => window.addEventListener(event, handler));
    }

    addHandlerServings(handler){
        this._parent.addEventListener('click', function(e) {
            const btn = e.target.closest('.btn--update-servings');

            if (!btn) return;
            const updateTo = +btn.dataset.updateTo;

            if (updateTo < 1 || !isFinite(updateTo)) return;

            handler(updateTo);
        })
    }

    addHandlerToggleBookmark(handler) {
        this._parent.addEventListener('click', function(e) {

            const btn = e.target.closest('.btn--bookmark');

            if (!btn) return;

            handler();
        });
    }

}

export default new Recipe();