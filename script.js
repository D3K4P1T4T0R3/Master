let bouton_fr = document.querySelector("#fr");
let bouton_en = document.querySelector("#en");


//load stuff
loadLang("fr");
grayLangButtons("fr");


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