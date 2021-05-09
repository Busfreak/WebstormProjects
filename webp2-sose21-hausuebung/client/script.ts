class User{
    vorname: string;
    nachname: string;
    username: string;
    passwort: string;
}
class Pet {
    tierart: string;
    tiername: string;
}

let userlist: User[] = [];
let petList: Pet[] = [];

document.addEventListener("DOMContentLoaded", () => {
    renderLoginForm();
    renderPetForm();

    document.getElementById("inhalt").addEventListener("click", (event: Event) => {
        event.preventDefault();
        const ziel: HTMLElement = event.target as HTMLElement;

        //listener für Anmeldedialog
        if (ziel.matches(".login-button")) {
            login();
        }
        //listener für Registrierungsdialog
        if (ziel.matches(".registration-form-button")) {
            renderRegistrationForm();
        }
        //listener für Registrierungsbestätigung
        if (ziel.matches(".registration-button")) {
            saveRegistration();
        }
    })

    //listener für Bearbeitung von Usern
    document.getElementById("user-table").addEventListener("click", (event: Event) => {
        event.preventDefault();
        const ziel: HTMLElement = event.target as HTMLElement;
        const index: number = Number(ziel.dataset.index);
        if (ziel.matches(".edit-button")) {
            editUser(index);
        }
        if (ziel.matches(".delete-button")) {
            deleteUser(index);
        }
        if (ziel.matches(".save-button")) {
            saveUser(index);
        }
        if (ziel.matches(".cancel-button")) {
            renderUserlist();
        }
        if (ziel.matches(".password-button")){
            editPassword(index);
        }
        if (ziel.matches(".password-save-button")){
            checkPassword(index);
        }
    })

    //listener für anlegen eines Haustiers
    document.getElementById("petform").addEventListener("click", (event: Event) => {
        event.preventDefault();
        const ziel: HTMLElement = event.target as HTMLElement;
        if (ziel.matches(".pet-registration-button")) {
            savePet();
        }
    })
    //listener für löschen eines Haustiers
    document.getElementById("pettable").addEventListener("click", (event: Event) => {
        event.preventDefault();
        const ziel: HTMLElement = event.target as HTMLElement;
        const index: number = Number(ziel.dataset.index);
        if (ziel.matches(".pet-delete-button")) {
            deletePet(index);
        }
    })
})

function saveRegistration():void {
    const form: HTMLFormElement = document.getElementById("form") as HTMLFormElement;
    //Eingaben auslesen
    const vorname: string = (document.getElementById("vorname") as HTMLInputElement). value;
    const nachname: string = (document.getElementById("nachname") as HTMLInputElement). value;
    const username: string = (document.getElementById("username") as HTMLInputElement). value;
    const passwort: string = (document.getElementById("passwort") as HTMLInputElement). value;

    //Eingaben ins user speichern und Leerzeichen trimmen
    let user: User = new User();
    user.vorname = vorname.trim();
    user.nachname = nachname.trim();
    user.username = username.trim();
    user.passwort = passwort.trim();

    //Werte wieder ins FOrmular schreiben
    (document.getElementById("vorname") as HTMLInputElement).value = user.vorname;
    (document.getElementById("nachname") as HTMLInputElement).value = user.nachname;
    (document.getElementById("username") as HTMLInputElement).value = user.username;
    (document.getElementById("passwort") as HTMLInputElement).value = user.passwort;

    //prüfen ob der Username bereits registriert wurde, sonst Hinweis ausgeben
    for (let i: number=0; i < userlist.length; i++){
        if(userlist[i].username == username){
            (document.getElementById("username")as HTMLInputElement).value = "Username ist bereits vergeben";
            alert("Der Username ist leider schon vergeben. Überleg dir bitte einen anderen!")
        }
    }
    //Formular prüfen, wenn Ok - user in userlist übernehmen
    const val: boolean = form.reportValidity();
    if (val) {
        userlist.push(user);
        form.reset();
        renderUserlist();
    }
    renderLoginForm();
}

function login():void{
    console.log();
    console.log("Login wird geprüft");
}

function renderLoginForm(){
    const inhalt: HTMLDivElement = document.getElementById("inhalt") as HTMLDivElement;
    inhalt.innerHTML = `
           <p>Anmelden</p>
        <form id="form1">
            <label for="username">
                <input type="text"  id="username1" placeholder="Username">
            </label>
            <label for="passwort">
                <input type="password" id="passwort1" Placeholder="Passwort">
            </label>
            <button type="submit" class="login-button btn btn-outline-primary btn-sm line-darkred text-red">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                </svg>
            Anmelden</button>
    <div>
        <p>Du hast noch keinen Account, möchtest aber deine Haustiere präsentieren und die der anderen bewundern?</p>
        <p>Dann registriere dich jetzt und freu dich auf ein flauschiges Miteinander!</p>
    </div>
            <button type="submit" class="registration-form-button btn btn-outline-primary btn-sm line-darkred text-red">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                </svg>
            Registrieren</button>
        </form>
    `;
}

function renderRegistrationForm():void {
    const inhalt: HTMLDivElement = document.getElementById("inhalt") as HTMLDivElement;
    inhalt.innerHTML = `
    <h2>Registrieren</h2>
    <form id="form">
        <table>
            <tr><th><label for="vorname">Vorname:</label></th><td><input type="text" id="vorname" placeholder="Vorname" required></td></tr>
            <tr><th><label for="nachname">Nachname:</label></th><td><input type="text" id="nachname" placeholder="Nachname" required></td></tr>
            <tr><th><label for="username">username</label></th><td><input type="text" id="username" placeholder="Username" required></td></tr>
            <tr><th><label for="passwort">Passwort:</label></th><td><input type="password" id="passwort" placeholder="Passwort" required></td></tr>
        </table>
            <button type="submit" class="registration-button btn btn-outline-primary btn-sm line-darkred text-red">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                </svg>
            jetzt Registrieren</button>
    </form>`;
}

function savePet():void {
    const form: HTMLFormElement = document.getElementById("petform1") as HTMLFormElement;
    //Eingaben auslesen
    const tiername: string = (document.getElementById("tiername") as HTMLInputElement). value;
    const tierart: string = (document.getElementById("tierart") as HTMLInputElement). value;
    let pet: Pet = new Pet();
    pet.tiername = tiername.trim();
    pet.tierart = tierart.trim();
    petList.push(pet);
    const val: boolean = form.reportValidity();
    form.reset();
    renderPetlist();
}

function deletePet(index): void {
    petList.splice(index, 1);
    renderPetlist();
}

function renderPetForm(){
    const petform: HTMLDivElement = document.getElementById("petform") as HTMLDivElement;
    petform.innerHTML = `
           <H2>dein Haustier</H2>
        <form id="petform1">
            <label for="tiername"><input type="text" id="tiername" Placeholder="Tiername"></label>
            <label for="tierart"><input type="text" id="tierart" placeholder="Tiername"></label>
            <button type="submit" class="pet-registration-button btn btn-outline-primary btn-sm line-darkred text-red">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                </svg>
            Speichern</button>
        </form>
    `;

}

function renderPetlist(): void {
    console.log(petList.length);
    //Tabellenhead anzeigen
    const pettable: HTMLDivElement = document.getElementById("pettable") as HTMLDivElement;
    pettable.innerHTML = `
        <table>
            <thead>
                <th class="col-3 darkred text-color">Tierart:</th>
                <th class="col-3 darkred text-color">Name:</th>
                <th class="col-3 darkred text-color">bearbeiten</th>
            </thead>
            <tbody id="pet-table"></tbody>
        </table>
    `;

    //Tabelle erstellen
    let table: HTMLElement = document.getElementById("pet-table");
    table.innerHTML = "";

    for (let i: number = 0; i < petList.length; i++) {
        const pet: Pet = petList[i];
        const row: HTMLElement = document.createElement("tr");
        row.setAttribute("id", "row" + i);
        row.innerHTML = `
            <td class="col-3">${pet.tierart}</td>
            <td class="col-3">${pet.tiername}</td>
            <td class="col-3" id="buttonliste">
                <button type="submit" class="pet-delete-button btn btn-outline-primary btn-sm line-darkred text-red" data-index="${i}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                    </svg>
                Löschen</button>
            </td>`;

        table.appendChild(row);
    }
}

function renderUserlist(): void {
    //Tabellenhead anzeigen
    let thead: HTMLElement = document.getElementById("user-thead");
    thead.innerHTML = "";
    const editthead: HTMLElement = document.createElement("tr");
    editthead.innerHTML=`
        <th class="col-3 darkred text-color">Username:</th>
        <th class="col-3 darkred text-color">Vorname:</th>
        <th class="col-3 darkred text-color">Nachname:</th>
        <th class="col-3 darkred text-color">Aktionen:</th>`
    thead.appendChild(editthead);
    //Tabelle erstellen
    let table: HTMLElement = document.getElementById("user-table");
    table.innerHTML = "";

    for (let i: number = 0; i < userlist.length; i++) {
        const user: User = userlist[i];
        const row: HTMLElement = document.createElement("tr");
        row.setAttribute("id", "row" + i);
        row.innerHTML = `
            <td class="col-3">${user.username}</td>
            <td class="col-3">${user.vorname}</td>
            <td class="col-3">${user.nachname}</td>
            <td class="col-3" id="buttonliste">
               <button type="submit" class="edit-button btn btn-outline-primary btn-sm line-darkred text-red" data-index="${i}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                    <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                    </svg>
                Editieren</button>
                <button type="submit" class="delete-button btn btn-outline-primary btn-sm line-darkred text-red" data-index="${i}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                    </svg>
                Löschen</button>
                <button type="submit" class="password-button btn btn-outline-primary btn-sm line-darkred text-red" data-index="${i}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-key-fill" viewBox="0 0 16 16">
                    <path d="M3.5 11.5a3.5 3.5 0 1 1 3.163-5H14L15.5 8 14 9.5l-1-1-1 1-1-1-1 1-1-1-1 1H6.663a3.5 3.5 0 0 1-3.163 2zM2.5 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                    </svg>
                Passwort ändern</button>
            </td>`;

        table.appendChild(row);
    }
}

function editUser(index): void {
    let Zeile: HTMLElement = document.getElementById("row" + index);
    Zeile.innerHTML = "";
    const user: User = userlist[index];
    const editrow: HTMLElement = document.createElement("tr");
    editrow.innerHTML = `
        <form id="edit-form">
        <td class="col-3"><input type="text" value="${user.username}" id="edit-uname"></td>
        <td class="col-3"><input type="text" value="${user.vorname}" id="edit-fname"></td>
        <td class="col-3"><input type="text" value="${user.vorname}" id="edit-lname"></td>
        <td class="col-3"><button type="submit" class="save-button" data-index="${index}">Bestätigen</button></td>
        <td class="col-3"><button type="submit" class="cancel-button" data-index="${index}">Abbrechen</button></td>
     
        </form>`;
    Zeile.replaceWith(editrow);
}

function deleteUser(index): void {
    userlist.splice(index, 1);
    renderUserlist();
}

function saveUser(index): void {
    const user: User = userlist[index];
    user.vorname = (document.getElementById("edit-fname") as HTMLInputElement).value;
    user.nachname = (document.getElementById("edit-lname") as HTMLInputElement).value;
    userlist[index] = user;
    renderUserlist();
}

function editPassword(index): void {
    //Tabellenhead neu beschriften
    let thead: HTMLElement = document.getElementById("user-thead");
    thead.innerHTML = "";
    const editthead: HTMLElement = document.createElement("tr");
    editthead.innerHTML=`
        <th class="col-3 darkred text-color">Altes Passwort:</th>
        <th class="col-3 darkred text-color">Neues Passwort:</th>
        <th class="col-3 darkred text-color">Neues Passwort wiederholen:</th>
        <th class="col-3 darkred text-color">Aktionen:</th>`
    thead.appendChild(editthead);

    //neue Inputfelder
    let Zeile: HTMLElement = document.getElementById("row" + index);
    Zeile.innerHTML = "";
    const editrow: HTMLElement= document.createElement("tr")
    editrow.innerHTML= `
        <form id="password-form">
            <td><input type="password" placeholder="altes Passwort" required id="oldpassword"></td>
            <td><input type="password" placeholder="neues Passwort" required id="password1"></td>
            <td><input type="password" placeholder="Wiederholung" required id="password2"></td>
            <td><button type="submit" class="password-save-button btn btn-primary darkred line-darkred text-color" data-index="${index}">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16">
                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
            </svg>
            Bestätigen
            </button></td>
        </form>`;
    Zeile.replaceWith(editrow);
}

function checkPassword(index): void {
    const user: User = userlist[index];
    const oldpassword: string = (document.getElementById("oldpassword")as HTMLInputElement).value;
    const password1: string = (document.getElementById("password1")as HTMLInputElement).value;
    const password2: string = (document.getElementById("password2")as HTMLInputElement).value;
    if(oldpassword != user.passwort){
        (document.getElementById("oldpassword") as HTMLInputElement).setCustomValidity("Das alte Passwort ist nicht korrekt!");
        alert("Das alte Passwort ist nicht korrekt!");
    } else{
        (document.getElementById("oldpassword") as HTMLInputElement).setCustomValidity("");
        if(password1.trim().length==0){
            (document.getElementById("password1") as HTMLInputElement). setCustomValidity("Passwort darf nicht leer sein!");
            (document.getElementById("password1") as HTMLInputElement).value = "";
            alert("Passwort darf nicht leer sein oder nur aus Leerezichen bestehen!");
        } else{
            (document.getElementById("password1") as HTMLInputElement).setCustomValidity("");
            if (password1 != password2){
                (document.getElementById("password2") as HTMLInputElement).setCustomValidity("Passwörter müssen übereinstimmen!");
                alert("Passwörter müssen übereinstimmen!");
            } else {
                (document.getElementById("password2") as HTMLInputElement).setCustomValidity("");
                user.passwort =password2;
                userlist[index] = user;
                renderUserlist();
            }
        }
    }
}

