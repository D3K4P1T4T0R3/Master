let bouton_fr = document.querySelector("#fr");
let bouton_en = document.querySelector("#en");
let categories_left = document.querySelector("#categories-left");
let categories_right = document.querySelector("#categories-right");


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
                // créer un nouvelle element div et lui ajouter la class "category"
                let new_category = document.createElement("div");
                new_category.classList.add('category');

                //ajouter le titre de la category à la nouvelle category
                let h2 = document.createElement("h2");
                h2.append(category.title);
                new_category.append(h2);

                //creer le container des l'articles
                let articles_container = document.createElement("div");
                articles_container.classList.add('articles');
                new_category.append(articles_container);

                category.articles.forEach(article => {
                    //creer le container de l'article
                    let article_container = document.createElement("article");

                    //verifier le type d'article et créer l'élément correspondant
                    if(article.type == "img"){
                        article_container.classList.add('img_article');
                        let img = document.createElement("img");
                        img.src = article.url;
                        img.alt = article.content;
                        article_container.append(img);
                    }
                    if(article.type == "vid"){
                        article_container.classList.add('vid_article');
                        let img = document.createElement("img");
                        img.src = article.url;
                        img.alt = article.content;
                        article_container.append(img);
                    }

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