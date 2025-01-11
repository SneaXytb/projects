// Initialisation des variables
const barre_vie_j1 = document.getElementById('barre_vie_j1');
const barre_vie_j2 = document.getElementById('barre_vie_j2');

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const titre = document.getElementById('page_title');

const images_paths = {
    fighter: 'ressources/fighter.png',
    samurai: 'ressources/samurai.png',
    shinobi: 'ressources/shinobi.png',
    background: 'ressources/background.png'
};

const fighter = new Image();
fighter.src = images_paths.fighter;
const samurai = new Image();
samurai.src = images_paths.samurai;
const shinobi = new Image();
shinobi.src = images_paths.shinobi;
const background = new Image();
background.src = images_paths.background;
const background_2 = new Image();
background_2.src = images_paths.background;

const limites = {
    fighter: [6, 8, 8, 10, 4, 3, 4, 2, 3, 3],
    samurai: [6, 8, 8, 12, 6, 4, 3, 2, 2, 3],
    shinobi: [6, 8, 8, 12, 5, 3, 4, 4, 2, 4]
};

const pas_en_cours = {
    fighter: 0,
    samurai: 0,
    shinobi: 0
};

const action_en_cours = {
    fighter: 'rien',
    samurai: 'rien',
    shinobi: 'rien'
};

const pos_x = {
    fighter: 0,
    samurai: 0,
    shinobi: 0,
    background: 0,
    background_2: canvas.width
};

const pos_y = { // Pour être au niveau du sol
    fighter: 130,
    samurai: 130,
    shinobi: 130
};

const miroir = {
    fighter: false,
    samurai: false,
    shinobi: false
}

const vie = {
    fighter: 100,
    samurai: 100,
    shinobi: 100
};

let ligne = fighter.height / 10; // 10 lignes de 128px de hauteurs
let taille_bloc = 128; // blocs de 128x128 // 12 blocs de 128px de largeur
let taille_afficher = 250; // blocs de 250x250
const  time = 100;
const vitesse_deplacement_backgroud = 10;
const position_default = 'position_combat';

const epsilon = 80;

const actions = ['immobile', 'marche', 'course', 'saut', 'attaque_crochet', 'attaque_direct', 'attaque_fouetter', 'position_combat', 'parade', 'mort'];

// Pour les joueurs
var j1 = 'fighter';
var j2 = 'samurai';

// Définition des fonctions
function action(commande) {
    switch (commande) {
        case 'immobile':
            return 0;
        case 'marche':
            return 1;
        case 'course':
            return 2;
        case 'saut':
            return 3;
        case 'attaque_crochet':
            return 4;
        case 'attaque_direct':
            return 5;
        case 'attaque_fouetter':
            return 6;
        case 'position_combat':
            return 7;
        case 'parade':
            return 8;
        case 'mort':
            return 9;
        default:
            return -1;
    }
};

// function animation_solo() {
//         var interval = setInterval(() => {
//             dx += 10;
//             draw(pas, perso.fighter, action('marche'));
//             pas++;
//             if (pas >= limites.fighter[action('marche')]) {
//                 clearInterval(interval);
//             }
//         }, time);
// };

function reset_pas(perso) {
    pas_en_cours[perso] = 0;
};

function set_action(perso, action) {
    if (action_en_cours[perso] != action) {
        action_en_cours[perso] = action;
        reset_pas(perso);
    }
};

function set_position(perso, x, y) {
    pos_x[perso] = x;
    pos_y[perso] = y;
};

function peut_avancer(perso) {
    return pos_x[perso] >= -10 && pos_x[perso] <= canvas.width - taille_afficher;
};

function avancer(perso, x, y, action) {
    set_action(perso, action);
    if (peut_avancer(perso)) {
        if (!miroir[perso]) {
            pos_x[perso] += x;
        }
        else {
            pos_x[perso] -= x;
        }
        pos_y[perso] += y;
    }
};

function immobile(perso) {
    set_action(perso, 'immobile');
};

function marche(perso) {
    set_action(perso, 'marche');
};

function course(perso) {
    set_action(perso, 'course');
};

function saut(perso) {
    set_action(perso, 'saut');
};

function attaque_crochet(perso) {
    set_action(perso, 'attaque_crochet');
};

function attaque_direct(perso) {
    set_action(perso, 'attaque_direct');
};

function attaque_fouetter(perso) {
    set_action(perso, 'attaque_fouetter');
};

function position_combat(perso) {
    set_action(perso, 'position_combat');
};

function parade(perso) {
    set_action(perso, 'parade');
};

function mort(perso) {
    set_action(perso, 'mort');
};

function cacher(perso) {
    set_action(perso, 'rien');
};

function take_domage(perso) {
    vie[perso] -= 3;
};

function verif_domage_1_sur_2(perso1, perso2) {
    var temp_action = action(action_en_cours[perso1]);
    // Les attaques sont entre 4 et 6
    if (temp_action >= 4 && temp_action <= 6) {
        if (action(action_en_cours[perso2]) != 8) {
            take_domage(perso2);
        }
    }
};

function abs(x) {
    if (x < 0) {
        return -x;
    }
    return x;
};

function en_vie(perso) {
    return vie[perso] > 0;
};

function update_vie() {
    barre_vie_j1.style.setProperty("--progress-ratio-j1", vie[j1] + "%");
    barre_vie_j2.style.setProperty("--progress-ratio-j2", vie[j2] + "%");
};

function update_death() {
    if (vie.fighter <= 0) {
        mort('fighter');
    }
    if (vie.samurai <= 0) {
        mort('samurai');
    }
    if (vie.shinobi <= 0) {
        mort('shinobi');
    }
};

function update_death_joueurs() {
    if (vie[j1] <= 0) {
        mort(j1);
        titre.innerText = 'Le joueur 2 a gagné';
        rematch.style.display = 'block';
    }
    if (vie[j2] <= 0) {
        mort(j2);
        titre.innerText = 'Le joueur 1 a gagné';
        rematch.style.display = 'block';
    }
};

function collision_joueurs() {
    if (en_vie(j1) && en_vie(j2)) {
        var temp_j1_miroir = canvas.width - pos_x[j1] - taille_afficher; // cf update_position_miroir
        var temp_j2_miroir = canvas.width - pos_x[j2] - taille_afficher; // cf update_position_miroir
        if (miroir[j1] && !miroir[j2] && abs(temp_j1_miroir - pos_x[j2]) <= epsilon) {
            verif_domage_1_sur_2(j1, j2);
            verif_domage_1_sur_2(j2, j1);
        }
        else if (!miroir[j1] && miroir[j2] && abs(pos_x[j1] - temp_j2_miroir) <= epsilon) {
            verif_domage_1_sur_2(j1, j2);
            verif_domage_1_sur_2(j2, j1);
        }
        else if (miroir[j1] == miroir[j2] && abs(pos_x[j1] - pos_x[j2]) <= epsilon) {
            verif_domage_1_sur_2(j1, j2);
            verif_domage_1_sur_2(j2, j1);
        }
    }

    update_death_joueurs();
    update_vie();
};

function collision() {
    if (en_vie('fighter') && en_vie('samurai') && abs(pos_x.fighter - pos_x.samurai) <= epsilon) {
        verif_domage_1_sur_2('fighter', 'samurai');
        verif_domage_1_sur_2('samurai', 'fighter');
    }
    if (en_vie('fighter') && en_vie('shinobi') && abs(pos_x.fighter - pos_x.shinobi) <= epsilon) {
        verif_domage_1_sur_2('fighter', 'shinobi');
        verif_domage_1_sur_2('shinobi', 'fighter');
    }
    if (en_vie('samurai') && en_vie('shinobi') && abs(pos_x.samurai - pos_x.shinobi) <= epsilon) {
        verif_domage_1_sur_2('samurai', 'shinobi');
        verif_domage_1_sur_2('shinobi', 'samurai');
    }

    update_death();
    update_vie();
};

function peut_aller_a_gauche(perso) {
    return pos_x[perso] > -70;
};

function peut_aller_a_droite(perso) {
    return pos_x[perso] < canvas.width - 180;
};

// A revoir car ne redescent pas
function jump(perso) {
    if (action_en_cours[perso] === 'saut') {
        if (pos_y[perso] >= -50) {
            pos_y[perso] -= 36;
            setTimeout(() => {
                jump(perso); }, time);
        }
        if (pos_y[perso] <= -50) {
            pos_y[perso] += 36;
            var temp = setTimeout(() => {
                jump(perso); }, time);
        }
    }
};

function update_background() {
    pos_x.background -= vitesse_deplacement_backgroud;
    pos_x.background_2 -= vitesse_deplacement_backgroud;
    if (pos_x.background <= -canvas.width) {
        pos_x.background = canvas.width;
    }
    if (pos_x.background_2 <= -canvas.width) {
        pos_x.background_2 = canvas.width;
    }
};

function update_position_miroir(perso) {
    pos_x[perso] = canvas.width - pos_x[perso] - taille_afficher;
};

function update_miroir(perso) {
    if (miroir[perso]) {
        miroir[perso] = false;
        update_position_miroir(perso);
    } else {
        miroir[perso] = true;
        update_position_miroir(perso);
    }
};

function update_affichage() {
    // Pour faire défiler le background en continu
    // update_background();
    // Début de l'actualisation de tout (position et animation)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Affichage du background
    ctx.drawImage(background, pos_x.background, 0, canvas.width, canvas.height);
    ctx.drawImage(background_2, pos_x.background_2, 0, canvas.width, canvas.height);
    // Gestion du miroir
    if (miroir.fighter) {
        ctx.save();
        ctx.scale(-1, 1); // Miroir horizontal
        ctx.translate(-canvas.width, 0);
    }
    if (action(action_en_cours.fighter) != -1 && vie.fighter > 0) {
        // Gestion de l'animation du fighter
        if (pas_en_cours.fighter >= limites.fighter[action(action_en_cours.fighter)] - 1) {
            pas_en_cours.fighter = 0;
            set_action('fighter', position_default);
        } else {
            pas_en_cours.fighter++;
        }
        // Affichage update du fighter
        ctx.drawImage(fighter, pas_en_cours.fighter * taille_bloc, ligne * action(action_en_cours.fighter), taille_bloc, taille_bloc, pos_x.fighter, pos_y.fighter, taille_afficher, taille_afficher);
    }
    if (miroir.fighter) {
        ctx.restore();
    }
    if (miroir.samurai) {
        ctx.save();
        ctx.scale(-1, 1); // Miroir horizontal
        ctx.translate(-canvas.width, 0);
    }
    if (action(action_en_cours.samurai) != -1 && vie.samurai > 0) {
        // Gestion de l'animation du samurai
        if (pas_en_cours.samurai >= limites.samurai[action(action_en_cours.samurai)] - 1) {
            pas_en_cours.samurai = 0;
            set_action('samurai', position_default);
        } else {
            pas_en_cours.samurai++;
        }
        // Affichage update du samurai
        ctx.drawImage(samurai, pas_en_cours.samurai * taille_bloc, ligne * action(action_en_cours.samurai), taille_bloc, taille_bloc, pos_x.samurai, pos_y.samurai, taille_afficher, taille_afficher);
    }
    if (miroir.samurai) {
        ctx.restore();
    }
    if (miroir.shinobi) {
        ctx.save();
        ctx.scale(-1, 1); // Miroir horizontal
        ctx.translate(-canvas.width, 0);
    }
    if (action(action_en_cours.shinobi) != -1 && vie.shinobi > 0) {
        // Gestion de l'annimation du shinobi
        if (pas_en_cours.shinobi >= limites.shinobi[action(action_en_cours.shinobi)] - 1) {
            pas_en_cours.shinobi = 0;
            set_action('shinobi', position_default);
        } else {
            pas_en_cours.shinobi++;
        }
        // Affichage update du shinobi
        ctx.drawImage(shinobi, pas_en_cours.shinobi * taille_bloc, ligne * action(action_en_cours.shinobi), taille_bloc, taille_bloc, pos_x.shinobi, pos_y.shinobi, taille_afficher, taille_afficher);
    }
    if (miroir.shinobi) {
        ctx.restore();
    }
};

function get_input() {
    window.addEventListener('keypress', (event) => {
        switch (event.key) {
            // Commande pour le joueur 1
            case 'q':
                if (!miroir[j1]) {
                    update_miroir(j1);
                }
                avancer(j1, -10, 0, 'marche');
                break;
            case 'd':
                if (miroir[j1]) {
                    update_miroir(j1);
                }
                avancer(j1, 10, 0, 'marche');
                break;
            // case 'Q':
            //     if (!miroir[j1]) {
            //         update_miroir(j1);
            //     }
            //     avancer(j1, -30, 0, 'course');
            //     break;
            // case 'D':
            //     if (miroir[j1]) {
            //         update_miroir(j1);
            //     }
            //     avancer(j1, 30, 0, 'course');
            //     break;
            case 'z':
                attaque_direct(j1);
                break;
            case 'e':
                attaque_crochet(j1);
                break;
            case 's':
                attaque_fouetter(j1);
                break;
            case 'a':
                parade(j1);
                break;
            // Commande pour le joueur 2
            case 'k':
                if (!miroir[j2]) {
                    update_miroir(j2);
                }
                avancer(j2, -10, 0, 'marche');
                break;
            case 'm':
                if (miroir[j2]) {
                    update_miroir(j2);
                }
                avancer(j2, 10, 0, 'marche');
                break;
            // case 'K':
            //     if (!miroir[j2]) {
            //         update_miroir(j2);
            //     }
            //     avancer(j2, -30, 0, 'course');
            //     break;
            // case 'M':
            //     if (miroir[j2]) {
            //         update_miroir(j2);
            //     }
            //     avancer(j2, 30, 0, 'course');
            //     break;
            case 'o':
                attaque_direct(j2);
                break;
            case 'i':
                attaque_crochet(j2);
                break;
            case 'l':
                attaque_fouetter(j2);
                break;
            case 'p':
                parade(j2);
                break;


            // case 'a':
            //     attaque_direct('fighter');
            //     break;
            // case '$':
            //     marche('fighter');
            //     break;
            // case 'e':
            //     course('fighter');
            //     break;
            // case 'r':
            //     saut('fighter');
            //     break;
            // case 't':
            //     attaque_crochet('fighter');
            //     break;
            // case 'y':
            //     attaque_fouetter('fighter');
            //     break;
            // case 'u':
            //     position_combat('fighter');
            //     break;
            // case 'i':
            //     parade('fighter');
            //     break;
            // case 'o':
            //     mort('fighter');
            //     break;
            // case 'p':
            //     cacher('fighter');
            //     break;
            // case '£':
            //     immobile('fighter');
            //     break;
            // case ' ':
            //     saut('fighter');
            //     jump('fighter');
            //     break;
            // case 'z':
            //     avancer('samurai', 0, -10, 'marche');
            //     break;
            // case 's':
            //     avancer('samurai', 0, 10, 'marche');
            //     break;
            default:
                break;
        }
    });
};

const rematch = document.getElementById('restart');

rematch.addEventListener('click', (event) => {
    window.location.reload();
});

function init_game() {
    set_position(j1, 0, 130);
    set_position(j2, canvas.width - taille_afficher, 130);
    set_action(j1, 'position_combat');
    set_action(j2, 'position_combat');
    update_miroir(j2);
};

function main() {
    var interval = setInterval(() => {
        window.requestAnimationFrame(update_affichage);
        collision_joueurs();
    }, time);
    get_input();
    init_game();
};
