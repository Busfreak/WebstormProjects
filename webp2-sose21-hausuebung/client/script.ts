//import axios, {AxiosError, AxiosResponse} from "axios";

document.addEventListener("DOMContentLoaded", () => {
    renderUserInfo();
    renderPetForm();
    renderUserlist();
    renderPetlist();

    // Listenre für Abmelden, hängt am Element userinfo
    document.getElementById("userinfo").addEventListener("click", (event: Event) => {
        event.preventDefault();
        const ziel: HTMLElement = event.target as HTMLElement;

        //listener für Logout-Button
        if (ziel.matches(".logout-button")) {
            logout();
        }
        //listener für Login-Button
        if (ziel.matches(".render-login-button")) {
            renderLoginForm();
        }
        //listener für Registrierungsdialog
        if (ziel.matches(".registration-form-button")) {
            renderRegistrationForm();
        }

    })

    // Listener für Anmeldung / Registrierung, hängen am Element inhalt
    document.getElementById("inhalt").addEventListener("click", (event: Event) => {
        event.preventDefault();
        // was wurde angeklick?
        const ziel: HTMLElement = event.target as HTMLElement;

        //listener für Anmeldedialog
        if (ziel.matches(".login-button")) {
            login();
        }
        //listener für Registrierungsbestätigung
        if (ziel.matches(".registration-button")) {
            saveRegistration();
        }
    })

    //listener für Bearbeitung von Usern, hängen am Element user-table
    document.getElementById("user-table").addEventListener("click", (event: Event) => {
        event.preventDefault();
        // was wurde angeklick?
        const ziel: HTMLElement = event.target as HTMLElement;
        // username aus dataset auslesen
        const username: string = String(ziel.dataset.username);
        // welchen Zeilenindex hat das angeklickte Element?
        const index: number = Number(ziel.dataset.index);

        // Edit-Button
        if (ziel.matches(".edit-button")) {
            editUser(username, index);
        }
        // Delete-Button
        if (ziel.matches(".delete-button")) {
            deleteUser(username);
            renderUserlist();
        }
        // Save-Button
        if (ziel.matches(".save-button")) {
            // die Daten stehen in neuen Input-Feldern, deshalb müssen sie hier gesondert ausgelesen werden
            const vorname = (document.getElementById("edit-fname") as HTMLInputElement).value.trim();
            const nachname = (document.getElementById("edit-lname") as HTMLInputElement).value.trim();
            saveUser(username, vorname, nachname);
            renderUserlist();
        }
        // Cancel-Button
        if (ziel.matches(".cancel-button")) {
            renderUserlist();
        }
        // Passwort ändern Button
        if (ziel.matches(".password-button")){
            editPassword(username, index);
        }
        // Passwort speichern Button
        if (ziel.matches(".password-save-button")){
            checkPassword(username);
        }
    })

    //listener für Anlegen eines Haustiers
    document.getElementById("petform").addEventListener("click", (event: Event) => {
        event.preventDefault();
        // tbd
        const ziel: HTMLElement = event.target as HTMLElement;
        if (ziel.matches(".pet-registration-button")) {
            savePet();
            renderPetlist();
        }
    })

    //listener für löschen eines Haustiers
    document.getElementById("pettable").addEventListener("click", (event: Event) => {
        event.preventDefault();
        // tbd
        const ziel: HTMLElement = event.target as HTMLElement;
        const tiername: string = String(ziel.dataset.tiername);
        if (ziel.matches(".pet-delete-button")) {
            deletePet(tiername);
            renderPetlist();
        }
    })
})

// Funktionen für Benutzerverwaltung
// Login/Register/Logout Buttons rendern
function renderUserInfo(): void {
    //prüfen, ob ein User angemeldet ist, oder nicht
    // AJAX Request: alle User aus Backend abfragen
    axios.get("/loggedin").then((res: AxiosResponse) => {
        const userinfo: HTMLDivElement = document.getElementById("userinfo") as HTMLDivElement;
        userinfo.innerHTML = "angemeldet als: " + res.data["vorname"] + " " + res.data["nachname"] + `
                    <button type="submit" class="logout-button btn btn-outline-danger">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up-right-circle-fill" viewBox="0 0 16 16">
                    <path d="M0 8a8 8 0 1 0 16 0A8 8 0 0 0 0 8zm5.904 2.803a.5.5 0 1 1-.707-.707L9.293 6H6.525a.5.5 0 1 1 0-1H10.5a.5.5 0 0 1 .5.5v3.975a.5.5 0 0 1-1 0V6.707l-4.096 4.096z"></path>
                        </svg>
                    Abmelden</button>
                `;
    }).catch((err: AxiosError) => {
        if(err.response.status == 401) {
            const userinfo: HTMLDivElement = document.getElementById("userinfo") as HTMLDivElement;
            userinfo.innerHTML = "nicht angemeldet" + `
                    <button type="submit" class="render-login-button btn btn-outline-danger">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up-right-circle-fill" viewBox="0 0 16 16">
                    <path d="M0 8a8 8 0 1 0 16 0A8 8 0 0 0 0 8zm5.904 2.803a.5.5 0 1 1-.707-.707L9.293 6H6.525a.5.5 0 1 1 0-1H10.5a.5.5 0 0 1 .5.5v3.975a.5.5 0 0 1-1 0V6.707l-4.096 4.096z"></path>
                        </svg>
                    Anmelden</button>
                    <button type="submit" class="registration-form-button btn btn-outline-danger">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up-right-circle-fill" viewBox="0 0 16 16">
                    <path d="M0 8a8 8 0 1 0 16 0A8 8 0 0 0 0 8zm5.904 2.803a.5.5 0 1 1-.707-.707L9.293 6H6.525a.5.5 0 1 1 0-1H10.5a.5.5 0 0 1 .5.5v3.975a.5.5 0 0 1-1 0V6.707l-4.096 4.096z"></path>
                        </svg>
                    Registrieren</button>
                `;
        } else {
            console.log("Anfrage Fehlgeschlagen: " + err.response.status)
        }
    });
}

// Resgistrierungsformular prüfen, korrigieren und speichern - create
function saveRegistration():void {
    const form: HTMLFormElement = document.getElementById("form") as HTMLFormElement;
    // Eingaben auslesen und Leerzeichen trimmen
    const vorname: string = (document.getElementById("vorname") as HTMLInputElement).value.trim();
    const nachname: string = (document.getElementById("nachname") as HTMLInputElement).value.trim();
    const username: string = (document.getElementById("username") as HTMLInputElement).value.trim();
    const passwort: string = (document.getElementById("passwort") as HTMLInputElement).value.trim();

    // Werte wieder ins Formular schreiben
    (document.getElementById("vorname") as HTMLInputElement).value = vorname;
    (document.getElementById("nachname") as HTMLInputElement).value = nachname;
    (document.getElementById("username") as HTMLInputElement).value = username;
    (document.getElementById("passwort") as HTMLInputElement).value = passwort;

    // prüfen, ob der Username Leerzeichen enthält
    const test = username.split(" ");
    if (test.length > 1) {
        alert("Der Username darf keine Leerzeichen enthalten!");
        (document.getElementById("username") as HTMLInputElement).value = "";
    }

    //Formular prüfen, wenn Ok speichern
    const val: boolean = form.reportValidity();
    if (val) {
        // AJAX Request: neuen User speichern
        axios.post("/user", {
            username: username,
            vorname: vorname,
            nachname: nachname,
            passwort: passwort
        }).then(()=>{
                console.log("Speichern erfolgreich!");
                form.reset();
                renderUserlist();
                renderLoginForm();
            })
            .catch((err : AxiosError) => {
                if(err.response.status == 403) {
                    //die Prüfung ergab, dass der Username bereits registriert wurde
                    console.log("Benutzername ist breits vergeben");
                    alert("Der Username ist leider schon vergeben. Überleg dir bitte einen anderen!");
                    (document.getElementById("username")as HTMLInputElement).value = "Username ist bereits vergeben";
                } else {
                    console.log("Es ist ein Fehler aufgetreten: " + err.response.status);
                }
            });
    }
}

// Benutzer nach dem Bearbeiten speichern - update
function saveUser(username: string, vorname: string, nachname: string): void {
    // AJAX Request: Benutzer mit username und weiteren Daten speichern
    axios.put("/user/" + username, {username: username, vorname: vorname, nachname: nachname}).then(()=>{
        console.log("Speichern erfolgreich!");
    })
        .catch((err : AxiosError) => {
            if(err.response.status == 404) {
                console.log("Der Benutzername ist nicht bekannt");
            } else {
                console.log(err.response.status);
            }
        });
}

// Benutzer löschen - delete
function deleteUser(username: String): void {
    // AJAX Request: Benutzer mit username löschen
    axios.delete("/user/" + username).then(()=>{
        console.log("Löschen erfolgreich!");
    })
        .catch((err : AxiosError) => {
            if(err.response.status == 404) {
                console.log("Der Benutzername ist nicht bekannt");
            } else {
                console.log(err.response.status);
            }
        });
}

// Login
function login():void{
    const out: HTMLElement = document.getElementById("out");
    const loginform: HTMLFormElement = document.getElementById("loginform") as HTMLFormElement;
    const data: FormData = new FormData(loginform);
    const username: string = data.get("loginName");
    const passwort: string = data.get("loginPasswort");
    axios.post("/login", {
        username: username,
        passwort: passwort
    })
        .then(()=>{
            axios.get("/user/" + username).then((res: AxiosResponse)=>{
                renderUserInfo();
            })
            loginform.reset();
            const inhalt: HTMLDivElement = document.getElementById("inhalt") as HTMLDivElement;
            inhalt.innerHTML = "";
            renderUserlist();
        })
        .catch((err : AxiosError) => {
            if(err.response.status == 404) {
                console.log("Benutzername oder Passwort inkorrekt");
                out.innerText = "Benutzername oder Passwort inkorrekt";
            } else {
                console.log("Fehler in der Anmeldung");
                out.innerText = "Fehler in der Anmeldung";
            }
        });
}

// Logout
function logout(): void {
    axios.post("/logout")
        .then(() => {
            console.log("Logout erfolgreich");
            renderUserInfo();
        });
}

// Funktion zum Ändern des Passworts
function checkPassword(username: string): void {
    const oldpassword: string = (document.getElementById("oldpassword")as HTMLInputElement).value.trim();
    const password1: string = (document.getElementById("password1")as HTMLInputElement).value.trim();
    const password2: string = (document.getElementById("password2")as HTMLInputElement).value.trim();

    if(password1.trim().length==0 || password2.trim().length==0) {
        alert("Passwort darf nicht leer sein oder nur aus Leerezichen bestehen!");
    } else {
        if (password1 != password2) {
            (document.getElementById("password2") as HTMLInputElement).setCustomValidity("Passwörter müssen übereinstimmen!");
            alert("Passwörter müssen übereinstimmen!");
        } else {
            // AJAX Request: neues Passwort speichern
            axios.post("/savepassword/", {
                username: username,
                old: oldpassword,
                new: password1
            }).then(() => {
                console.log("Passwort erfolgreich geändert!");
            })
                .catch((err: AxiosError) => {
                    if (err.response.status == 403) {
                        console.log("Das Passwort ist falsch!");
                    } else {
                        console.log("das war nix: " + err.response.status);
                    }
                });
        }
    }
    renderUserlist();
}

// Funktionen für die Tierverwaltung
function savePet():void {
    const form: HTMLFormElement = document.getElementById("petinputform") as HTMLFormElement;
    //Eingaben auslesen
    const tiername: string = (document.getElementById("tiername") as HTMLInputElement).value.trim();
    const tierart: string = (document.getElementById("tierart") as HTMLInputElement).value.trim();

    // prüfen, ob der Tiername leer ist
    if (tiername.length == 0) {
        alert("Der Tiername darf nicht leer sein!");
    } else {
        // prüfen, ob der Tiername Leerzeichen enthält
        const test = tiername.split(" ");
        if (test.length > 1) {
            alert("Der Tiername darf keine Leerzeichen enthalten!");
            (document.getElementById("tiername") as HTMLInputElement).value = "";
        } else {
            // AJAX Request: neues Tier speichern
            axios.post("/pet", {
                tiername: tiername,
                tierart: tierart
            }).then(()=>{
                console.log("Speichern erfolgreich!");
                form.reset();
            })
                .catch((err : AxiosError) => {
                    if(err.response.status == 403) {
                        //die Prüfung ergab, dass der Tiername bereits registriert wurde
                        console.log("Tiername ist breits vergeben");
                        alert("Der Tiername ist leider schon vergeben. Überleg dir bitte einen anderen!");
                        (document.getElementById("tiername")as HTMLInputElement).value = "Tiername ist bereits vergeben";
                    } else {
                        console.log("Es ist ein Fehler aufgetreten: " + err.response.status);
                    }
                });
        }
    }
}

function deletePet(tiername: string): void {
    // AJAX Request: Benutzer mit username löschen
    axios.delete("/pet/" + tiername).then(()=>{
        console.log("Löschen erfolgreich!");
        renderPetlist();
    })
        .catch((err : AxiosError) => {
            if(err.response.status == 404) {
                console.log("Das Tier ist nicht bekannt");
            } else {
                console.log(err.response.status);
            }
        });
}

// Render-Funktionen
// Login Formular erstellen und anzeigen
function renderLoginForm(){
    const inhalt: HTMLDivElement = document.getElementById("inhalt") as HTMLDivElement;
    inhalt.innerHTML = `
        <p>Anmelden</p>
        <form id="loginform">
            <label for="username"><input type="text"  id="username1" placeholder="Username" name="loginName"></label>
            <label for="passwort"><input type="password" id="passwort1" Placeholder="Passwort" name="loginPasswort"></label>
            <button type="submit" class="login-button btn btn-outline-primary btn-sm line-darkred text-red">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                </svg>
            Anmelden</button>
            <div>
                <p>Du hast noch keinen Account, möchtest aber deine Haustiere präsentieren und die der anderen bewundern?</p>
                <p>Dann registriere dich jetzt und freu dich auf ein flauschiges Miteinander!</p>
            </div>
        </form>
    `;
}

// Registrierungsformular erstellen und anzeigen
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

// Userliste erstellen und anzeigen
function renderUserlist(): void {
    // Überschriften erstellen und anzeigen
    let thead: HTMLElement = document.getElementById("user-thead");
    thead.innerHTML = "";
    const editthead: HTMLElement = document.createElement("tr");
    editthead.innerHTML=`
        <th class="col-3 darkred text-color">Username:</th>
        <th class="col-3 darkred text-color">Vorname:</th>
        <th class="col-3 darkred text-color">Nachname:</th>
        <th class="col-3 darkred text-color">Aktionen:</th>`
    thead.appendChild(editthead);
    // Tabelle mit Benutzern erstellen und anzeigen
    let table: HTMLElement = document.getElementById("user-table");
    table.innerHTML = "";

    // AJAX Request: alle User aus Backend abfragen
    axios.get("/users").then((res: AxiosResponse) => {
        // Zähler für data-index, damit die angeklickte Zeile später gefunden werden kann - kann das auch durch den username ersetzt werden?
        let i: number = 0;
        // die einzelnen Datensätze aus der Response durchgehen und in die Tabelle einfügen
        for (let value in res.data) {
            const row: HTMLElement = document.createElement("tr");
            // Zeilennummer setzen
            row.setAttribute("id", "row" + i);
            row.innerHTML = `
                <td class="col-3">${res.data[value]["username"]}</td>
                <td class="col-3">${res.data[value]["vorname"]}</td>
                <td class="col-3">${res.data[value]["nachname"]}</td>
                <td class="col-3" id="buttonliste">
                   <button type="submit" class="edit-button btn btn-outline-primary btn-sm line-darkred text-red" data-username=${res.data[value]["username"]} data-index="${i}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                        <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                        </svg>
                    Editieren</button>
                    <button type="submit" class="delete-button btn btn-outline-primary btn-sm line-darkred text-red" data-username=${res.data[value]["username"]} data-index="${i}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                        </svg>
                    Löschen</button>
                    <button type="submit" class="password-button btn btn-outline-primary btn-sm line-darkred text-red" data-username=${res.data[value]["username"]}" data-index="${i}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-key-fill" viewBox="0 0 16 16">
                        <path d="M3.5 11.5a3.5 3.5 0 1 1 3.163-5H14L15.5 8 14 9.5l-1-1-1 1-1-1-1 1-1-1-1 1H6.663a3.5 3.5 0 0 1-3.163 2zM2.5 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                        </svg>
                    Passwort ändern</button>
                </td>`;
            table.appendChild(row);
            i++;
        }
    }).catch((err: AxiosError) => {
        if(err.response.status == 204) {
            console.log("Keine Benutzer gefunden.");
        } else {
            console.log("Anfrage Fehlgeschlagen: " + err.response.status)
        }
    });
}

// Eingabefelder für die Bearbeitung eines Benutzers erstellen und mit den aktuellen Werten befüllen
function editUser(username: string, index: number): void {
    // welche Werte stehen in der angeklickten Zeile?
    const Zeile: HTMLElement = document.getElementById("row" + index);
    const vorname = Zeile.getElementsByTagName("td").item(1).innerText;
    const nachname = Zeile.getElementsByTagName("td").item(2).innerText;
    Zeile.innerHTML = "";
    const editrow: HTMLElement = document.createElement("tr");
    editrow.innerHTML = `
        <form id="edit-form">
            <td class="col-3"><input type="text" readonly value="${username}" id="edit-uname"></td>
            <td class="col-3"><input type="text" value="${vorname}" id="edit-fname"></td>
            <td class="col-3"><input type="text" value="${nachname}" id="edit-lname"></td>
            <td class="col-3"><button type="submit" class="save-button" data-username="${username}">Bestätigen</button></td>
            <td class="col-3"><button type="submit" class="cancel-button"">Abbrechen</button></td>
        </form>`;
    Zeile.replaceWith(editrow);
}

// Eingabefelder für Passwortänderung erstellen und anzeigen
function editPassword(username: string, index: number): void {
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
            <td><button type="submit" class="password-save-button btn btn-primary darkred line-darkred text-color" data-username="${username}">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16">
                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
            </svg>
            Bestätigen
            </button></td>
        </form>`;
    Zeile.replaceWith(editrow);
}

// Eingabefelder für das Anlegen eines neuen Tiers erstellen
function renderPetForm(){
    const petform: HTMLDivElement = document.getElementById("petform") as HTMLDivElement;
    petform.innerHTML = `
        <H2>dein Haustier</H2>
        <form id="petinputform">
            <label for="tiername"><input type="text" id="tiername" Placeholder="Tiername"></label>
            <label for="tierart"><input type="text" id="tierart" placeholder="Tierart"></label>
            <button type="submit" class="pet-registration-button btn btn-outline-primary btn-sm line-darkred text-red">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                </svg>
            Speichern</button>
        </form>
    `;

}

// Tierliste erstellen und anzeigen
function renderPetlist(): void {
    // AJAX Request: alle User aus Backend abfragen
    axios.get("/pets").then((res: AxiosResponse) => {
        //Tabellenhead anzeigen
        const pettable: HTMLDivElement = document.getElementById("pettable") as HTMLDivElement;
        pettable.innerHTML = `
            <table>
                <thead>
                    <th class="col-3 darkred text-color">Name:</th>
                    <th class="col-3 darkred text-color">Tierart:</th>
                    <th class="col-3 darkred text-color">bearbeiten</th>
                </thead>
                <tbody id="pet-table"></tbody>
            </table>
        `;
        //Tabelle erstellen
        let table: HTMLElement = document.getElementById("pet-table");
        table.innerHTML = "";

        // Zähler für data-index, damit die angeklickte Zeile später gefunden werden kann
        let i: number = 0;

        // die einzelnen Datensätze aus der Response durchgehen und in die Tabelle einfügen
        for (let value in res.data) {
            const row: HTMLElement = document.createElement("tr");
            // Zeilennummer setzen
            row.setAttribute("id", "row" + i);
            row.innerHTML = `
                <td class="col-3">${res.data[value]["tiername"]}</td>
                <td class="col-3">${res.data[value]["tierart"]}</td>
                <td class="col-3" id="buttonliste">
                    <button type="submit" class="pet-delete-button btn btn-outline-primary btn-sm line-darkred text-red" data-tiername=${res.data[value]["tiername"]} data-index="${i}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                        </svg>
                    Löschen</button>
                </td>`;
            table.appendChild(row);
            i++;
        }
    }).catch((err: AxiosError) => {
        if(err.response.status == 204) {
            console.log("Keine Tiere gefunden.");
        } else {
            console.log("Anfrage Fehlgeschlagen: " + err.response.status)
        }
    });
}

