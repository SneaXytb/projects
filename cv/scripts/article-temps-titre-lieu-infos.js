const template = document.createElement('template');
template.innerHTML = `
<style>
    article {
        margin: 0;
        padding: 0;
        font-family: 'Arial', sans-serif;
        font-size: 1em;
        color: #333;
        background-color:rgba(249, 249, 249, 0.49);
        border: 1px solid #ccc;
        border-radius: 5px;
        margin-bottom: 1em;
        padding: 1em;
    }
    #temps {
        font-size: 1.5em;
        font-weight: bold;
    }
    #titre {
        font-size: 1.2em;
        font-weight: bold;
    }
    #lieu {
        font-size: 1em;
        font-style: italic;
    }
    #infos {
        font-size: 1em;
    }
</style>
<article>
    <p>
        <time id="temps" datetime="2011 - 2015">2011 - 2015</time>
        <br>
        <span id="titre" class="forma">Doctorat en Archéologie</span>
        <br>
        <span id="lieu" data-location="Université de Cambridge">Université de Cambridge</span>
    </p>
    <p id="infos">Spécialisation en civilisations anciennes et techniques de fouilles modernes.</p>
</article>
`;
customElements.define("article-temps-titre-lieu-infos",
    class extends HTMLElement {

        static observedAttributes = ['temps', 'titre', 'lieu', 'infos'];

        constructor() {
            super();
            this.attachShadow({mode: 'open'});
            this.shadowRoot.appendChild(template.content.cloneNode(true));
        }

        attributeChangedCallback(name, oldValue, newValue) {
            const texte = this.shadowRoot.getElementById(name);
            if (name === 'temps') {
                texte.setAttribute('datetime', newValue);
                texte.textContent = newValue;
            }
            if (name === 'titre') {
                texte.classList.add('forma');
                texte.textContent = newValue;
            }
            if (name === 'lieu') {
                texte.setAttribute('data-location', newValue);
                texte.textContent = newValue;
            }
            if (name === 'infos') {
                texte.textContent = newValue;
            }
        }
    }
);