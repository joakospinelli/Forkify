import icons from 'url:../../img/icons.svg'; // import necesario para que parcel reconozca los íconos

export default class View {
    

    render(data) {
      
        if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();

        this._data = data;

        const html = this._generateHtml();

        this._clear();
        this._parent.insertAdjacentHTML('afterbegin', html);
    }

    _clear() {
        this._parent.innerHTML = ''; // elimino msg de búsqueda
    }

    renderSpinner() {
        const html = `
        <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>
        `
        this._clear();
        this._parent.insertAdjacentHTML('afterbegin', html);
    }

    renderError(message = this._errorMsg) {

      this._clear();

      const html = `
      <div class="error">
          <div>
            <svg>
              <use href="${icons}#icon-alert-triangle"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>
      `;

      this._parent.insertAdjacentHTML('afterbegin', html);
    }

    renderMessage() {
        const html = `
        <div class="recipe">
        <div class="message">
          <div>
            <svg>
              <use href="${icons}g_icon-smile"></use>
            </svg>
          </div>
          <p>${this._msg}</p>
        </div>
        `

        this._clear();
        this._parent.insertAdjacentHTML('afterbegin',html);
    }

    update(data) {
      this._data = data;

      if (Array.isArray(this._data) && this._data.length === 0) return;

      const newHtml = this._generateHtml();
      const newDOM = document.createRange().createContextualFragment(newHtml);

      const newElements = Array.from(newDOM.querySelectorAll('*'));
      const currentElements = Array.from(this._parent.querySelectorAll('*'));

      newElements.forEach((newEl, i) => {
        const currentEl = currentElements[i];

        // Cambios al textContent
        if (!newEl.isEqualNode(currentEl) && newEl.firstChild?.nodeValue.trim() !== '') {
          currentEl.textContent = newEl.textContent;
        }

        // Cambios a atributos
        if (!newEl.isEqualNode(currentEl)) {
          Array.from(newEl.attributes).forEach(attr => currentEl.setAttribute(attr.name, attr.value));
        }
      })
    }
}