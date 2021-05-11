//import axios, {AxiosError, AxiosResponse} from "axios";
var User = /** @class */ (function () {
    function User() {
    }
    return User;
}());
var Pet = /** @class */ (function () {
    function Pet() {
    }
    return Pet;
}());
var userlist = [];
var petList = [];
document.addEventListener("DOMContentLoaded", function () {
    renderLoginForm();
    renderPetForm();
    document.getElementById("inhalt").addEventListener("click", function (event) {
        event.preventDefault();
        var ziel = event.target;
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
    });
    //listener für Bearbeitung von Usern
    document.getElementById("user-table").addEventListener("click", function (event) {
        event.preventDefault();
        var ziel = event.target;
        var index = Number(ziel.dataset.index);
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
        if (ziel.matches(".password-button")) {
            editPassword(index);
        }
        if (ziel.matches(".password-save-button")) {
            checkPassword(index);
        }
    });
    //listener für anlegen eines Haustiers
    document.getElementById("petform").addEventListener("click", function (event) {
        event.preventDefault();
        var ziel = event.target;
        if (ziel.matches(".pet-registration-button")) {
            savePet();
        }
    });
    //listener für löschen eines Haustiers
    document.getElementById("pettable").addEventListener("click", function (event) {
        event.preventDefault();
        var ziel = event.target;
        var index = Number(ziel.dataset.index);
        if (ziel.matches(".pet-delete-button")) {
            deletePet(index);
        }
    });
});
function saveRegistration() {
    var form = document.getElementById("form");
    //Eingaben auslesen
    var vorname = document.getElementById("vorname").value;
    var nachname = document.getElementById("nachname").value;
    var username = document.getElementById("username").value;
    var passwort = document.getElementById("passwort").value;
    //Eingaben ins user speichern und Leerzeichen trimmen
    var user = new User();
    user.vorname = vorname.trim();
    user.nachname = nachname.trim();
    user.username = username.trim();
    user.passwort = passwort.trim();
    //Werte wieder ins FOrmular schreiben
    document.getElementById("vorname").value = user.vorname;
    document.getElementById("nachname").value = user.nachname;
    document.getElementById("username").value = user.username;
    document.getElementById("passwort").value = user.passwort;
    //prüfen ob der Username bereits registriert wurde, sonst Hinweis ausgeben
    for (var i = 0; i < userlist.length; i++) {
        if (userlist[i].username == username) {
            document.getElementById("username").value = "Username ist bereits vergeben";
            alert("Der Username ist leider schon vergeben. Überleg dir bitte einen anderen!");
        }
    }
    //Formular prüfen, wenn Ok - user in userlist übernehmen
    var val = form.reportValidity();
    if (val) {
        userlist.push(user);
        // AJAX Request
        axios.post("/user", {
            username: username,
            vorname: vorname,
            nachname: nachname,
            passwort: passwort
        })
            .then(function () {
            console.log("Speichern erfolgreich!");
        })
            .catch(function (err) {
            if (err.response.status == 403) {
                console.log("Benutzername ist breits vergeben");
            }
            else {
                console.log("Fehler in der Anmeldung");
            }
        });
        form.reset();
        renderUserlist();
    }
    renderLoginForm();
}
function login() {
    console.log();
    console.log("Login wird geprüft");
}
function renderLoginForm() {
    var inhalt = document.getElementById("inhalt");
    inhalt.innerHTML = "\n           <p>Anmelden</p>\n        <form id=\"form1\">\n            <label for=\"username\">\n                <input type=\"text\"  id=\"username1\" placeholder=\"Username\">\n            </label>\n            <label for=\"passwort\">\n                <input type=\"password\" id=\"passwort1\" Placeholder=\"Passwort\">\n            </label>\n            <button type=\"submit\" class=\"login-button btn btn-outline-primary btn-sm line-darkred text-red\">\n                <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-pencil-fill\" viewBox=\"0 0 16 16\">\n                <path d=\"M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z\"/>\n                </svg>\n            Anmelden</button>\n    <div>\n        <p>Du hast noch keinen Account, m\u00F6chtest aber deine Haustiere pr\u00E4sentieren und die der anderen bewundern?</p>\n        <p>Dann registriere dich jetzt und freu dich auf ein flauschiges Miteinander!</p>\n    </div>\n            <button type=\"submit\" class=\"registration-form-button btn btn-outline-primary btn-sm line-darkred text-red\">\n                <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-pencil-fill\" viewBox=\"0 0 16 16\">\n                <path d=\"M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z\"/>\n                </svg>\n            Registrieren</button>\n        </form>\n    ";
}
function renderRegistrationForm() {
    var inhalt = document.getElementById("inhalt");
    inhalt.innerHTML = "\n    <h2>Registrieren</h2>\n    <form id=\"form\">\n        <table>\n            <tr><th><label for=\"vorname\">Vorname:</label></th><td><input type=\"text\" id=\"vorname\" placeholder=\"Vorname\" required></td></tr>\n            <tr><th><label for=\"nachname\">Nachname:</label></th><td><input type=\"text\" id=\"nachname\" placeholder=\"Nachname\" required></td></tr>\n            <tr><th><label for=\"username\">username</label></th><td><input type=\"text\" id=\"username\" placeholder=\"Username\" required></td></tr>\n            <tr><th><label for=\"passwort\">Passwort:</label></th><td><input type=\"password\" id=\"passwort\" placeholder=\"Passwort\" required></td></tr>\n        </table>\n            <button type=\"submit\" class=\"registration-button btn btn-outline-primary btn-sm line-darkred text-red\">\n                <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-pencil-fill\" viewBox=\"0 0 16 16\">\n                <path d=\"M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z\"/>\n                </svg>\n            jetzt Registrieren</button>\n    </form>";
}
function savePet() {
    var form = document.getElementById("petform1");
    //Eingaben auslesen
    var tiername = document.getElementById("tiername").value;
    var tierart = document.getElementById("tierart").value;
    var pet = new Pet();
    pet.tiername = tiername.trim();
    pet.tierart = tierart.trim();
    petList.push(pet);
    var val = form.reportValidity();
    form.reset();
    renderPetlist();
}
function deletePet(index) {
    petList.splice(index, 1);
    renderPetlist();
}
function renderPetForm() {
    var petform = document.getElementById("petform");
    petform.innerHTML = "\n           <H2>dein Haustier</H2>\n        <form id=\"petform1\">\n            <label for=\"tiername\"><input type=\"text\" id=\"tiername\" Placeholder=\"Tiername\"></label>\n            <label for=\"tierart\"><input type=\"text\" id=\"tierart\" placeholder=\"Tiername\"></label>\n            <button type=\"submit\" class=\"pet-registration-button btn btn-outline-primary btn-sm line-darkred text-red\">\n                <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-pencil-fill\" viewBox=\"0 0 16 16\">\n                <path d=\"M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z\"/>\n                </svg>\n            Speichern</button>\n        </form>\n    ";
}
function renderPetlist() {
    console.log(petList.length);
    //Tabellenhead anzeigen
    var pettable = document.getElementById("pettable");
    pettable.innerHTML = "\n        <table>\n            <thead>\n                <th class=\"col-3 darkred text-color\">Tierart:</th>\n                <th class=\"col-3 darkred text-color\">Name:</th>\n                <th class=\"col-3 darkred text-color\">bearbeiten</th>\n            </thead>\n            <tbody id=\"pet-table\"></tbody>\n        </table>\n    ";
    //Tabelle erstellen
    var table = document.getElementById("pet-table");
    table.innerHTML = "";
    for (var i = 0; i < petList.length; i++) {
        var pet = petList[i];
        var row = document.createElement("tr");
        row.setAttribute("id", "row" + i);
        row.innerHTML = "\n            <td class=\"col-3\">" + pet.tierart + "</td>\n            <td class=\"col-3\">" + pet.tiername + "</td>\n            <td class=\"col-3\" id=\"buttonliste\">\n                <button type=\"submit\" class=\"pet-delete-button btn btn-outline-primary btn-sm line-darkred text-red\" data-index=\"" + i + "\">\n                    <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-trash-fill\" viewBox=\"0 0 16 16\">\n                    <path d=\"M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z\"/>\n                    </svg>\n                L\u00F6schen</button>\n            </td>";
        table.appendChild(row);
    }
}
function renderUserlist() {
    //Tabellenhead anzeigen
    var thead = document.getElementById("user-thead");
    thead.innerHTML = "";
    var editthead = document.createElement("tr");
    editthead.innerHTML = "\n        <th class=\"col-3 darkred text-color\">Username:</th>\n        <th class=\"col-3 darkred text-color\">Vorname:</th>\n        <th class=\"col-3 darkred text-color\">Nachname:</th>\n        <th class=\"col-3 darkred text-color\">Aktionen:</th>";
    thead.appendChild(editthead);
    //Tabelle erstellen
    var table = document.getElementById("user-table");
    table.innerHTML = "";
    // AJAX Request
    axios.get("/users").then(function (res) {
        for (var value in res.data) {
            console.log(res.data[value]["vorname"]);
            //            for (let i: number = 0; i < userlist.length; i++) {
            //                const user: User = userlist[i];
            var row = document.createElement("tr");
            //                row.setAttribute("id", "row" + i);
            row.innerHTML = "\n            <td class=\"col-3\">" + res.data[value]["username"] + "</td>\n            <td class=\"col-3\">" + res.data[value]["vorname"] + "</td>\n            <td class=\"col-3\">" + res.data[value]["nachname"] + "</td>\n            <td class=\"col-3\" id=\"buttonliste\">\n               <button type=\"submit\" class=\"edit-button btn btn-outline-primary btn-sm line-darkred text-red\" data-index=\"" + i + "\">\n                    <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-pencil-fill\" viewBox=\"0 0 16 16\">\n                    <path d=\"M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z\"/>\n                    </svg>\n                Editieren</button>\n                <button type=\"submit\" class=\"delete-button btn btn-outline-primary btn-sm line-darkred text-red\" data-index=\"" + i + "\">\n                    <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-trash-fill\" viewBox=\"0 0 16 16\">\n                    <path d=\"M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z\"/>\n                    </svg>\n                L\u00F6schen</button>\n                <button type=\"submit\" class=\"password-button btn btn-outline-primary btn-sm line-darkred text-red\" data-index=\"" + i + "\">\n                    <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-key-fill\" viewBox=\"0 0 16 16\">\n                    <path d=\"M3.5 11.5a3.5 3.5 0 1 1 3.163-5H14L15.5 8 14 9.5l-1-1-1 1-1-1-1 1-1-1-1 1H6.663a3.5 3.5 0 0 1-3.163 2zM2.5 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z\"/>\n                    </svg>\n                Passwort \u00E4ndern</button>\n            </td>";
            table.appendChild(row);
            //            }
        }
    }).catch(function (err) {
        if (err.response.status == 401) {
            console.log("Das geht nur angemeldet!");
        }
        else {
            console.log("Anfrage Fehlgeschlagen");
        }
    });
}
function editUser(index) {
    var Zeile = document.getElementById("row" + index);
    Zeile.innerHTML = "";
    var user = userlist[index];
    var editrow = document.createElement("tr");
    editrow.innerHTML = "\n        <form id=\"edit-form\">\n        <td class=\"col-3\"><input type=\"text\" value=\"" + user.username + "\" id=\"edit-uname\"></td>\n        <td class=\"col-3\"><input type=\"text\" value=\"" + user.vorname + "\" id=\"edit-fname\"></td>\n        <td class=\"col-3\"><input type=\"text\" value=\"" + user.vorname + "\" id=\"edit-lname\"></td>\n        <td class=\"col-3\"><button type=\"submit\" class=\"save-button\" data-index=\"" + index + "\">Best\u00E4tigen</button></td>\n        <td class=\"col-3\"><button type=\"submit\" class=\"cancel-button\" data-index=\"" + index + "\">Abbrechen</button></td>\n     \n        </form>";
    Zeile.replaceWith(editrow);
}
function deleteUser(index) {
    userlist.splice(index, 1);
    renderUserlist();
}
function saveUser(index) {
    var user = userlist[index];
    user.vorname = document.getElementById("edit-fname").value;
    user.nachname = document.getElementById("edit-lname").value;
    userlist[index] = user;
    renderUserlist();
}
function editPassword(index) {
    //Tabellenhead neu beschriften
    var thead = document.getElementById("user-thead");
    thead.innerHTML = "";
    var editthead = document.createElement("tr");
    editthead.innerHTML = "\n        <th class=\"col-3 darkred text-color\">Altes Passwort:</th>\n        <th class=\"col-3 darkred text-color\">Neues Passwort:</th>\n        <th class=\"col-3 darkred text-color\">Neues Passwort wiederholen:</th>\n        <th class=\"col-3 darkred text-color\">Aktionen:</th>";
    thead.appendChild(editthead);
    //neue Inputfelder
    var Zeile = document.getElementById("row" + index);
    Zeile.innerHTML = "";
    var editrow = document.createElement("tr");
    editrow.innerHTML = "\n        <form id=\"password-form\">\n            <td><input type=\"password\" placeholder=\"altes Passwort\" required id=\"oldpassword\"></td>\n            <td><input type=\"password\" placeholder=\"neues Passwort\" required id=\"password1\"></td>\n            <td><input type=\"password\" placeholder=\"Wiederholung\" required id=\"password2\"></td>\n            <td><button type=\"submit\" class=\"password-save-button btn btn-primary darkred line-darkred text-color\" data-index=\"" + index + "\">\n            <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-check\" viewBox=\"0 0 16 16\">\n                <path d=\"M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z\"/>\n            </svg>\n            Best\u00E4tigen\n            </button></td>\n        </form>";
    Zeile.replaceWith(editrow);
}
function checkPassword(index) {
    var user = userlist[index];
    var oldpassword = document.getElementById("oldpassword").value;
    var password1 = document.getElementById("password1").value;
    var password2 = document.getElementById("password2").value;
    if (oldpassword != user.passwort) {
        document.getElementById("oldpassword").setCustomValidity("Das alte Passwort ist nicht korrekt!");
        alert("Das alte Passwort ist nicht korrekt!");
    }
    else {
        document.getElementById("oldpassword").setCustomValidity("");
        if (password1.trim().length == 0) {
            document.getElementById("password1").setCustomValidity("Passwort darf nicht leer sein!");
            document.getElementById("password1").value = "";
            alert("Passwort darf nicht leer sein oder nur aus Leerezichen bestehen!");
        }
        else {
            document.getElementById("password1").setCustomValidity("");
            if (password1 != password2) {
                document.getElementById("password2").setCustomValidity("Passwörter müssen übereinstimmen!");
                alert("Passwörter müssen übereinstimmen!");
            }
            else {
                document.getElementById("password2").setCustomValidity("");
                user.passwort = password2;
                userlist[index] = user;
                renderUserlist();
            }
        }
    }
}
