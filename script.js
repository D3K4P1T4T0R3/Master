let bouton_fr = document.querySelector("#fr");
let bouton_en = document.querySelector("#en");

let categories_left = document.querySelector("#categories-left");
let categories_right = document.querySelector("#categories-right");
let categories = document.querySelectorAll(".category");

let displayer = document.querySelector("#displayer");

let overlay = document.querySelector("#overlay"); //get overlay
let overlay_displayer = document.querySelector("#overlay-displayer");

let last_article_clicked = document.querySelector("article");
let lastest_article_clicked = document.querySelector("article");

//load stuff
loadLang("fr");
grayLangButtons("fr");
creatAllCategoriesAndArticles();


//buttons event
bouton_fr.addEventListener("click", function (e) {
    loadLang("fr");
    grayLangButtons("fr");
});

bouton_en.addEventListener("click", function (e) {
    loadLang("en");
    grayLangButtons("en");
});

//click event pour tout le document (pour les elements ajouter en JS)
document.addEventListener("click", (e) => {
    hideOrShowArticlesInCategories(e);
    displayArticlesInRightSection(e);
    displayAndControlOverlay(e);
});

//functions
function loadLang(lang){
    fetch( "lang/"+lang+".json" ).then(function(response){
        response.json().then(function(data){
            let all_keys = Object.keys(data);

            all_keys.forEach(element => {
                document.querySelector("#"+element).innerHTML = data[element]
            });
        })
    });
}

function grayLangButtons(lang){
    let buttons = document.querySelectorAll(".lang_button");
    //mettre toute les boutons de langue en gris
    buttons.forEach(element => {
        element.style.backgroundColor = "gray";
    });
    //sauf le boutn sur lequelle on à cliquer (en blanc)
    document.querySelector("#"+lang).style.backgroundColor = "white";
}

function creatAllCategoriesAndArticles(){
    fetch( "work.json" ).then(function(response){
        response.json().then(function(data){
            //recupere les differents categories et leurs articles depuis le fichier work.json
            data.categories.forEach(function(category, index) {
                // créer un nouvelle element div & lui ajouter la class "category"
                let new_category = document.createElement("div");
                new_category.classList.add('category');

                //ajouter le titre de la category à la nouvelle category
                let h2 = document.createElement("h2");
                h2.append(category.title);
                new_category.append(h2);

                //creer le container des l'articles (grouper)
                let articles_container = document.createElement("div");
                articles_container.classList.add('articles');
                //articles_container.style.display = "none"; //cacher les articles par défaut
                new_category.append(articles_container);

                category.articles.forEach(article => {
                    //creer le container de l'article (seul)
                    let article_container = document.createElement("article"); // !!!

                    //creer l'image de l'article
                    let img = document.createElement("img");
                    img.src = article.url;
                    img.alt = article.content;
                    //creer la description de l'article
                    let description = document.createElement("p");
                    description.setHTML(article.content);

                    //verifier le type d'article et créer l'élément correspondant
                    if(article.type == "img"){
                        article_container.classList.add('img_article');
                    }
                    if(article.type == "vid"){
                        article_container.classList.add('vid_article');
                        
                        let iframe = document.createElement("iframe");
                        iframe.width = "560";
                        iframe.height = "315";
                        iframe.src = article.vid_url;
                        iframe.title = "YouTube video player";
                        iframe.frameBorder = "0";
                        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
                        iframe.referrerPolicy = "strict-origin-when-cross-origin";
                        iframe.allowFullscreen = true;                                                
                        article_container.append(iframe);
                    }

                    //ajouter l'image et la description à l'article
                    article_container.append(img);
                    article_container.append(description);

                    //ajouter l'article à la category
                    articles_container.append(article_container);
                });

                // ajouter la category et ces articles à la section de gauche
                if (index % 2 === 0) {
                    document.querySelector("#categories-left").append(new_category);
                } else {
                    document.querySelector("#categories-right").append(new_category);
                }
            });
        })
    });
}

//cache et montre les articles d'une catégorie quand on clique sur le titre de la catégorie
function hideOrShowArticlesInCategories(e){
    //PS : j'ai eu besoin d'IA pour cette partie-là, pour le "e.target.matches"
    //car ".category" n'était pas trouvé, donc l'event listener ne fonctionnait pas
    if (e.target.matches(".category h2")) {
        let category = e.target.parentElement;
        let articles = category.querySelector(".articles");
        
        articles.classList.toggle("open"); //version utiliser pour etre animer

        /*
        if (articles.style.display === "none") {
            articles.style.display = "flex";
        } else {
            articles.style.display = "none";
        }
            */
    }
}

//affiche l'article sur laquelle on a cliqué dans la section de droite
function displayArticlesInRightSection(e){
    //quand l'artciel est une image :
    if (e.target.matches(".img_article img")) {
        console.log("Image article clicked");

        let article = e.target.parentElement;

        last_article_clicked = article; //keep the last article clicked
        lastest_article_clicked = article; //same

        //Clone
        let img = article.querySelector("img").cloneNode(true);
        let desciption = article.querySelector("p").cloneNode(true);
        //Clone vers Section droite
        displayer.innerHTML = '';
        displayer.append(img);
        displayer.append(desciption);

        //si sur telephone, ouvre l'overlay directe
        if(window.innerWidth > 768){return;}
        openOverlay();
    }

    //quand l'artciel est une video youtube:
    if (e.target.matches(".vid_article img")) {
        console.log("Video article clicked");

        let article = e.target.parentElement;

        last_article_clicked = article; //keep the last article clicked
        lastest_article_clicked = article; //same

        //Clone
        let vid = article.querySelector("iframe").cloneNode(true);
        let desciption = article.querySelector("p").cloneNode(true);
        //Clone vers Section droite
        displayer.innerHTML = '';
        displayer.append(vid);
        displayer.append(desciption);

        //si sur telephone, ouvre l'overlay directe
        if(window.innerWidth > 768){return;}
        openOverlay();
    }
}

function displayAndControlOverlay(e){
    //Cliquer sur l'image dans la section droite pour ouvrir l'overlay
    if (e.target.matches("#displayer img")) {
        openOverlay();
    }

    // Passer à l'article suivant
    if (e.target.matches("#next-article")) {
        console.log("Article Suivant");

        //Quelque Check pour eviter de passer à un element suivant inexistant
        if(!last_article_clicked){return;}
        if(!last_article_clicked.nextElementSibling){return;}
        //Article Suivant
        last_article_clicked = last_article_clicked.nextElementSibling;

        hideNextAndPreviousButtons(); //hide or not the buttons
        
        copieArticleToOverlay(); //copy article to overlay
    }

    // Passer à l'article precedent
    if (e.target.matches("#previous-article")) {
        console.log("Article Precedent");

        //Quelque Check pour eviter de passer à un element precedent inexistant
        if(!last_article_clicked){return;}
        if(!last_article_clicked.previousElementSibling){return;}
        //Article Precedent
        last_article_clicked = last_article_clicked.previousElementSibling;

        hideNextAndPreviousButtons(); //hide or not the buttons

        copieArticleToOverlay(); //copy article to overlay
    }

    //Clicker sur l'overlay pour le fermer
    if (e.target.matches("#overlay")) {
        closeOverlay();
    }
}

function copieArticleToOverlay(){
    //Copier les elements necessaire
    let p = last_article_clicked.querySelector("p").cloneNode(true);
    let img;
    if(last_article_clicked.classList.contains('img_article')){
        img = last_article_clicked.querySelector("img").cloneNode(true);
    }else if(last_article_clicked.classList.contains('vid_article')){
        img = last_article_clicked.querySelector("iframe").cloneNode(true);
    }
    //Coller dans l'overlay
    overlay_displayer.innerHTML = '';
    overlay_displayer.append(img);
    overlay_displayer.append(p);
}

//Ouvrir l'overlay
function openOverlay(){
    console.log("Ouvrir l'overlay");

    //si "last_article_clicked" est vide, passer directe à l'ouverture, sans copie
    if(last_article_clicked){
        copieArticleToOverlay(); //copy article to overlay
    }

    //open the overlay
    overlay.classList.toggle("open");
    hideNextAndPreviousButtons(); //hide or not the buttons
}

//Ouvrir l'overlay
function closeOverlay(){
    console.log("Fermer l'overlay");
    //reset the last article clicked
    last_article_clicked = lastest_article_clicked;
    //close the overlay
    overlay.classList.toggle("open");
}

//Cacher ou pas les boutons de l'overlay
function hideNextAndPreviousButtons(){
    let next_button = document.querySelector("#next-article");
    let previous_button = document.querySelector("#previous-article");

    //tout cacher si ya pas de dernier article
    if(!last_article_clicked){
        next_button.style.visibility = "hidden";
        previous_button.style.visibility = "hidden";
        return;
    }

    //cacher bouton droit
    if(!last_article_clicked.nextElementSibling){
        next_button.style.visibility = "hidden";
    }else{
        next_button.style.visibility = "visible";
    }

    //cacher bouton gauche
    if(!last_article_clicked.previousElementSibling){
        previous_button.style.visibility = "hidden";
    }else{
        previous_button.style.visibility = "visible";
    }
}
