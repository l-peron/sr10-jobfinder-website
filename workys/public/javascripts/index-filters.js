const localisationForm = document.querySelector("#localisation-form");
const keywordsForm = document.querySelector("#keywords-form");

localisationForm.addEventListener('submit', event => filterElt(event));
keywordsForm.addEventListener('submit', event => filterElt(event));

const filterElt = (event) => {
    // Cancel submit
    event.preventDefault();

    // Get the form
    const targetForm = event.target;

    // Get the input
    const formInput = targetForm.querySelector("input");
    const formValue = formInput.value;

    // Reset the value
    formInput.value = null;

    // Check for empty inputs
    if(formValue === undefined || formValue.length === 0 || formValue.replaceAll(" ", "").length === 0)
        return;

    // Get the list
    const formList = targetForm.querySelector("div");

    // Tag item
    var $tagItem = $("<div>", {"class": "d-inline-flex bg-dark text-light m-1 mw-100"}).appendTo(formList);
    $("<p>", {"class" : `text-light ${targetForm.name}-input text-truncate`}).text(formValue).appendTo($tagItem);

    // Delete button
    $("<button>", {"class" : "text-light bg-dark border-0", "click": () => { $tagItem.remove(); asyncAnnoncesFetch() } ,"type": "button"}).text("X").appendTo($tagItem);

    // Refresh
    setPage(0);

    asyncAnnoncesFetch();
}