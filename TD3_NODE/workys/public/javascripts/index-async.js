// ASYNC FILTER

var filters = {
    types : [],
    localisations : [],
    min_price : undefined,
    max_price: undefined,
    entreprises: [],
    keywords : []
}

// ASYNC LOAD

const annoncesList = $("#annonces-list");

const createAnnonce = (annonce) => {
    console.log(annonce);

    var $article = $("<article>", {"class": "border border-2 border-dark p-2 my-3"});

    // Title
    var $divTitle = $("<div>", {"class": "d-flex flex-row flex-wrap align-items-center justify-content-between"}).appendTo($article);
    $("<h1>").text(annonce.title).appendTo($divTitle)
    $("<h4>").text(`${annonce.type} - ${annonce.avg_salary}€/an`).appendTo($divTitle);

    // Org name & loca
    $("<h3>").html(`par <b>${annonce.org_name}</b> situé à <b>${annonce.address}</b>`).appendTo($article);
    
    // Description
    $("<p>").text(annonce.description).appendTo($article)
    
    // Footer
    var $divFooter = $("<div>", {"class" : "row align-items-end"}).appendTo($article);

    // Candidater button
    var $divFooterLeft = $("<div>", {"class" : "col-3 align-self-start"}).appendTo($divFooter)

    if(!annonce.has_applied) {
        $("<button>", {"class": "w-100", "click" : () => openAnnonceModal(annonce) }).text("Candidater").appendTo($divFooterLeft)
    }
    
    $("<div>", {"class" : "col-6"}).appendTo($divFooter)

    var $divFooterRight = $("<div>", {"class" : "col-3 align-self-end"}).appendTo($divFooter)
    $("<button>", {"class": "w-100", "click" : () => window.location.href=`/offreemploi/${annonce.id}`}).text("Voir plus").appendTo($divFooterRight)
    
    return $article;
}

$spinner = $("#spinner-wrapper").clone();

const updateFilters = () => {
    // Types
    filters.types = []
    $(".filter-input-type").each((i, elt)  => {
        if(elt.checked) 
            filters.types.push(elt.value);
    })
    // Localisations
    filters.localisations = []
    $(".localisation-form-input").each((i, elt) => {
        filters.localisations.push(elt.innerHTML);
    })
    // Keywords
    filters.keywords = []
    $(".keywords-form-input").each((i, elt) => {
        filters.keywords.push(elt.innerHTML);
    })
}

var FETCH_LOCK = false;

const asyncAnnoncesFetch = () => {
    // LOCK ON FETCH
    if(FETCH_LOCK) return;
    FETCH_LOCK = true;
    
    // Retrieve the filters
    updateFilters();

    const urlParams = new URLSearchParams(window.location.search);
    const queryParam = urlParams.get('q');
    const pageParam = urlParams.get('p');

    $("#spinner-wrapper").addClass("d-block");
    $("#spinner-wrapper").removeClass("d-none");

    $("#annonces-list").children().remove();

    // Pages button hide
    $("#prev-page-btn").addClass("d-none");
    $("#prev-page-btn").removeClass("d-block");

    $("#next-page-btn").addClass("d-none");
    $("#next-page-btn").removeClass("d-block");

    const request = $.ajax({
        type: 'GET',          
        url : 'offreemploi', 
        data : {
            "query" : JSON.stringify(queryParam),
            "page": JSON.stringify(pageParam),
            "filters" : JSON.stringify(filters)
        },
        asynch : false          
    });

    request.done((res) => {
        const result = res.result;

        $("#spinner-wrapper").addClass("d-none");
        $("#spinner-wrapper").removeClass("d-block");

        result.annonces.forEach((annonce) => {
            annoncesList.append(createAnnonce(annonce))
        })

        if(result.has_before){
            $("#prev-page-btn").addClass("d-block")
            $("#prev-page-btn").removeClass("d-none")
        }

        if(result.has_after){
            $("#next-page-btn").addClass("d-block")
            $("#next-page-btn").removeClass("d-none")
        }
    })

    request.fail((err) => {
        console.log(err);
    })

    request.always(() => {
        FETCH_LOCK = false;
    })
}

// AJAX REQUEST FOR FILTERS
const filters_elements = $(".filter-input");
filters_elements.on("change", function() {
    setPage(0);

    asyncAnnoncesFetch();
})

asyncAnnoncesFetch();