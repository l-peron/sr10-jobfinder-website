const formField = document.getElementById("candidature_form");
let PIECES_COUNT = 1;

const createPiece = (fileId) => {
    var newRow = document.createElement('div');
    newRow.classList.add("row", "w-100", "p-0", "m-0")
    newRow.setAttribute('id', `fileRow${fileId}`)

    // Create the file input
    var newField = document.createElement('input');
    newField.setAttribute('type','file');
    newField.setAttribute('name','file[]');
    newField.setAttribute('placeholder','Fichier');
    newField.classList.add("fileFields", "col-sm", "form-control", "rounded-0", "h-100")
    newRow.appendChild(newField);

    // Create the file select
    var newSelect = document.createElement('select');
    newSelect.setAttribute('name','type[]');
    newSelect.classList.add("col-sm", "border-0")

    // Create the options
    var selectTypes = ['Autre', 'CV', 'Lettre de motivation']
    selectTypes.forEach(element => {
        var newSelectType = document.createElement('option')
        newSelectType.value = element;
        newSelectType.text = element;

        newSelect.appendChild(newSelectType);
    })
    newRow.appendChild(newSelect);

    // Create the delete button
    var deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = 'X'
    deleteBtn.onclick = (event) => {
        event.preventDefault();

        newRow.remove();
    }
    deleteBtn.classList.add("col-sm", "border-0", "btn", "btn-dark", "rounded-0")

    newRow.appendChild(deleteBtn);

    return newRow;
}

const addPiece = () => {
    var files = document.getElementsByClassName("fileFields");

    // If exist one element and has a file => exit
    if(files[files.length - 1]?.files?.length === 0)
        return;

    var newPiece = createPiece(PIECES_COUNT)

    PIECES_COUNT++;

    formField.appendChild(newPiece);
}

const submitForm = () => {
    formField.submit();
}