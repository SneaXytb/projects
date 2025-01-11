const template_arme = document.createElement('template');
template_arme.innerHTML = `
<style>
    @media (prefers-color-scheme: dark) {
        .texte_haut {
            background-color: rgba(0, 0, 0, 0.58);
            color: white;
        }
        .texte_bas {
            background-color: rgba(0, 0, 0, 0.58);
            color: white;
        }
    }

    @media (prefers-color-scheme: light) {
        .texte_haut {
            background-color: rgba(255, 255, 255, 0.58);
            color: black;
        }
        .texte_bas {
            background-color: rgba(255, 255, 255, 0.58);
            color: black;
        }
    }

    .without2with {
        display: block;
        text-align: center;
        width: 300px;
    }

    #with_lara {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        margin: 0;
        padding: 0;
        & > img {
            border-radius: 50%;
            height: 300px;
            width: 300px;
            margin-top: 30px;
            margin-bottom: 10px;
        }
        transition: all 0.5s ease-in-out;
    }
    
    .texte_haut {
        opacity: 0;
        border-radius: 5px;
        font-size: 2em;
        transition: all 0.5s ease-in-out;
        }
        
    .texte_bas {
        opacity: 0;
        border-radius: 5px;
        font-size: 1.8em;
        transition: all 0.5s ease-in-out;
        }
    
    .without2with:hover {
        #with_lara > img {
            transform: scale(1.1);
        }
        .texte_haut {
            animation: sort_texte_haut 0.5s ease-in-out;
            opacity: 1;
        }
        .texte_bas {
            animation: sort_texte_bas 0.5s ease-in-out;
            opacity: 1;
        }
    }

    @media screen and (max-width: 1366px) {
        #with_lara > img {
            height: 275px;
            width: 275px;
        }

        .texte_haut {
            font-size: 1.7em;
        }

        .texte_bas {
            font-size: 1.5em;
        }
    }

    @media screen and (max-width: 1024px) {
        #with_lara > img {
            height: 250px;
            width: 250px;
        }

        .texte_haut {
            font-size: 1.5em;
        }

        .texte_bas {
            font-size: 1.3em;
        }
    }

    @media screen and (max-width: 768px) {
        #with_lara > img {
            height: 200px;
            width: 200px;
        }

        .texte_haut {
            font-size: 1.3em;
        }

        .texte_bas {
            font-size: 1.1em;
        }
    }

    @media screen and (max-width: 425px) {
        #with_lara > img {
            height: 150px;
            width: 150px;
        }

        .texte_haut {
            font-size: 1.2em;
        }

        .texte_bas {
            font-size: 1em;
        }
    }

    @keyframes sort_texte_haut {
        0% {
            transform: translateY(50px);
            opacity: 0;
        }
        100% {
            transform: translateY(0);
            opacity: 1;
        }
    }

    @keyframes sort_texte_bas {
        0% {
            transform: translateY(-50px);
            opacity: 0;
        }
        100% {
            transform: translateY(0);
            opacity: 1;
        }
    }
</style>
<div class="without2with">
    <figure id="with_lara">
        <figcaption class="texte_haut" id="name">Lara Croft avec les Doubles Pistolets (Beretta M92FS)</figcaption>
        <img id="src" src="images/Armes/with_Lara_Croft/dual_baretta.jpg" alt="Lara Croft avec les Doubles Pistolets (Beretta M92FS)">
    </figure>
    <p id="competence" class="texte_bas">Une arme légère et rapide.</p>
</div>
`;
customElements.define("x-image-arme",
    class Armes extends HTMLElement {

        static observedAttributes = ['src', 'name', 'competence'];

        constructor() {
            super();
            this.attachShadow({mode: 'open'});
            this.shadowRoot.appendChild(template_arme.content.cloneNode(true));
        }

        attributeChangedCallback(name, oldValue, newValue) {
            const texte = this.shadowRoot.getElementById(name);
            if (name === 'src') {
                texte.setAttribute('src', newValue);
            }
            if (name === 'name') {
                texte.textContent = newValue;
                this.shadowRoot.getElementById("src").setAttribute('alt', newValue);
            }
            if (name === 'competence') {
                texte.textContent = newValue;
            }
        }
    }
);