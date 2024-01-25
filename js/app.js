const urlBase = "http://localhost:3000/user";

//Selectores

const userForm = document.querySelector("#userForm");
const tbody = document.querySelector("#tbody");
const userName = document.querySelector("#userName");
const userAge = document.querySelector("#userAge");
const idUser = document.querySelector("#idUser");
let isEditing = false
let idUserEditing

userForm.addEventListener("submit", (event) => {

    event.preventDefault();
    if (idUser.value && !isEditing) {
        loadingInfo(urlBase)
    } else {
        if (isEditing) {

            const putUserInfo = {
                name: userName.value,
                age: userAge.value,
            }
            PUThUser(idUserEditing, JSON.stringify(putUserInfo))
            isEditing = false
            idUserEditing = ''
        } else {
            addUser();
        }

    }
});

document.addEventListener("DOMContentLoaded", getUsers)

// Funcion para agregar un usuario
async function addUser() {

    //Se cuarda informacion de usuario en el objeto
    const newUser = {
        name: userName.value,
        age: userAge.value,
    }

    // En este punto se hace la peticion de HTTP 
    /* Verbos HTTP
        1. Get -> Obtener
        2. Post -> Crear
        3. Put -> Actualizar
        4. Delet -> Eliminar
    */

    await fetch(urlBase, {
        /* Metodo -> Se especifica el metodo de la peticion */

        method: "POST",
        headers: {
            /* Indico en que formato voy a enviar la informacion */
            "Content-Type": "application/json"
        },
        /*  Envio la informacion */
        body: JSON.stringify(newUser)
    });
}

// obtener los usuarios 
function getUsers() {
    fetch(urlBase)
        .then(respuesta => respuesta.json())
        .then(data => renderUsers(data))
        .catch(error => console.error(error))
}

/* fUNCION PARA MOSTRAR USUARIOS EN HTML */

function renderUsers(users) {

    users.forEach(user => {
        //TD
        const tdName = document.createElement("td");
        const tdAge = document.createElement("td");
        const tdActions = document.createElement("td");
        //BUTTons
        const btnUpdate = document.createElement("button");
        const btnDelete = document.createElement("button");

        const tr = document.createElement("tr");

        btnDelete.classList.add("btn", "btn-danger", "me-5");
        btnUpdate.classList.add("btn", "btn-primary");

        btnDelete.textContent = "Delete";
        btnUpdate.textContent = "Edit";

        btnDelete.addEventListener("click", () => {
            console.log(user.id);
            deletUser(user.id);
        })

        btnUpdate.addEventListener("click", () => {
            console.log(user.id);
            loadingInfo(user)
            isEditing = true
            idUserEditing = user.id
        })


        tdName.textContent = user.name;
        tdAge.textContent = user.age;
        /* tdAge.textContent = user.age; */

        //APPEnCHILD
        tdActions.appendChild(btnDelete);
        tdActions.appendChild(btnUpdate);

        tr.appendChild(tdName);
        tr.appendChild(tdAge);
        tr.appendChild(tdActions);

        tbody.appendChild(tr);
    });
}

function loadingInfo(urlBase) {
    userAge.value = urlBase.age;
    userName.value = urlBase.name;
    idUser.value = urlBase.id;
}

async function deletUser(id) {
    console.log(`${urlBase}/${id}`)
    await fetch(`${urlBase}/${id}`, {
        method: "DELETE"
    });
}

async function PUThUser(id, objetoParche) {
    try {
        const response = await fetch(`${urlBase}/${id}`, {
            method: "PUT",
            body: objetoParche,
            headers: {
                "Content-Type": "application/json"
            }
        });
    } catch (error) {
        console.error(error)
    }
}