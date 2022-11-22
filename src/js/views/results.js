import icons from 'url:../../img/icons.svg'; // import necesario para que parcel reconozca los íconos
import View from "./view";

class Results extends View {

    _parent = document.querySelector('.results');
    _errorMsg = 'No recipes found.';

    _generateHtml() {

        const id = window.location.hash.slice(1);

        return this._data.map(result => `
        <li class="preview">
            <a class="preview__link ${id === result.id ? 'preview__link--active' : ''}" href="#${result.id}">
            <figure class="preview__fig">
                <img src="${result.image}" alt="${result.title}" />
            </figure>
            <div class="preview__data">
                <h4 class="preview__title">${result.title}</h4>
                <p class="preview__publisher">${result.publisher}</p>
                <div class="preview__user-generated ${!result.key ? 'hidden' : ''}">
                    <svg>
                        <use href="${icons}#icon-user"></use>
                    </svg>
                </div>
            </div>
            </a>
      </li>`
      ).join('');
    }
}

export default new Results();