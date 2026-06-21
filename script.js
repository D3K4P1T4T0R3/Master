let bouton_fr = document.querySelector("#fr");
let bouton_en = document.querySelector("#en");
let categories_left = document.querySelector("#categories-left");
let categories_right = document.querySelector("#categories-right");
let categories = document.querySelectorAll(".category");


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

//PS : j'ai eu besoin d'IA pour cette partie-là, pour le "e.target.matches"
//car ".category" n'était pas trouvé, donc l'event listener ne fonctionnait pas
document.addEventListener("click", (e) => {
    if (e.target.matches(".category h2")) {
        let category = e.target.parentElement;
        let articles = category.querySelector(".articles");
        if (articles.style.display === "none") {
            articles.style.display = "flex";
        } else {
            articles.style.display = "none";
        }
    }
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
                articles_container.style.display = "none"; //cacher les articles par défaut
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
                    description.append(article.content);

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
