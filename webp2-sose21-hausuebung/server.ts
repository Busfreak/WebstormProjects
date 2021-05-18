import * as express from "express";
import * as session from "express-session";
declare module "express-session" {
    interface Session {
        uname: string;
    }
}
const PORT: number = 8080;
const router: express.Express = express();

class User {
    public readonly username: string;
    public vorname: string;
    public nachname: string;
    private passwort: string;

    constructor(username: string, vorname: string, nachname: string, passwort: string) {
        this.username = username;
        this.vorname = vorname;
        this.nachname = nachname;
        this.passwort = passwort;
    }

    get userInfo() {
        let jsonObject = {};
        jsonObject["username"] = this.username;
        jsonObject["vorname"] = this.vorname;
        jsonObject["nachname"] = this.nachname;
        return jsonObject;
    }

    get getPasswort() {
        return this.passwort;
    }

    set setPasswort(newPassword) {
        this.passwort = newPassword;
    }
}
class Pet {
    public readonly tiername: string;
    public tierart: string;

    constructor(tiername: string, tierart: string) {
        this.tiername = tiername;
        this.tierart = tierart;
    }
}
const users: Map<string, User> = new Map<string, User>();
const pets: Map<string, Pet> = new Map<string, Pet>();

router.listen (PORT, () => {
    console.log("Server ist gestartet unter http://localhost:" + PORT + "/");
});

router.use(express.urlencoded({extended: false}));
router.use(express.json());
router.use(session({
    cookie: {
        expires: new Date(Date.now() + (1000 * 60 * 60)),
        sameSite: true,
        secure: false,
    },
    secret: Math.random().toString(),
    resave: true,
    saveUninitialized: true
}));

router.get("/", (reg: express.Request, res: express.Response) => {
    res.status(200);
    res.sendFile(__dirname + "/client/index.html");
//    var path = require('path');
//    res.sendFile(path.resolve(__dirname + "/../client/index.html"));
});

router.post("/login", login);
router.post("/logout", logout);

router.use("/res", express.static(__dirname + "/client"));
router.use("/lib", express.static(__dirname + "/node_modules"));

// Routen für REST
router.post("/user", postUser);
router.get("/user/:username", getUser);
router.delete("/user/:username", deleteUser);
router.put("/user/:username", updateUser);
router.get("/users", checkLogin, getUsers);
router.post("/savepassword", savePassword);

router.post("/pet", postPet);
router.get("/pets", getPets);
router.delete("/pet/:tiername", deletePet);
router.put("/pet/:tiername", updatePet);

// Autorisiert die Session, falls Benutzer registriert ist
function login(req: express.Request, res: express.Response): void {
    const username: string = req.body.username;
    const passwort: string = req.body.passwort;
    if (users.has(username)) {
        console.log("User bekannt");
        const u: User = users.get(username);
        if (u.getPasswort === passwort) {
            console.log("Passwort: " + passwort);
            req.session.uname = username
            res.sendStatus(200);
//            res.redirect("/");
        } else {
            res.sendStatus(403);
        }
    } else {
        res.sendStatus(404);
    }
}

// Beendet die Session
function logout(req: express.Request, res: express.Response): void {
    req.session.destroy(() => {
        res.clearCookie("connect.sid");
        res.sendStatus(200);
    });
}

// Eine sog. Middleware-Route prüft, ob der Client angemeldet ist und ruft ggf. die nächste Funktion auf
function checkLogin(req: express.Request, res: express.Response, next: express.NextFunction): void {
    console.log("Test: " + req.session.uname);
    if (req.session.uname !== undefined) {
        // Ruft die nächste Funktion der Funktioskette
        next();
    } else {
        // Client nicht angemeldet
        res.sendStatus(401);
    }
}

// Funktionen für REST
// neuen User anlegen, wenn er noch nicht existiert
function postUser(req: express.Request, res: express.Response): void {
    const username: string = req.body.username;
    const vorname: string = req.body.vorname;
    const nachname: string = req.body.nachname;
    const passwort: string = req.body.passwort;
    if (!users.has(username)) {
        users.set(username, new User(username, vorname, nachname, passwort));
//        res.send("Der Benutzer " + vorname + " " + nachname + " wurde angelegt");
        res.sendStatus(201);
    } else {
        res.sendStatus(403);
    }
}

// User auslesen und zurück senden
function getUser(req: express.Request, res: express.Response): void {
    const username: string = req.params.username;
//    res.send("Der User mit dem Usernamen " + username + " existiert :)");
    if (users.has(username)) {
        const u: User = users.get(username);
        res.status(200);
        res.json({"vorname":u.vorname,"nachname":u.nachname});
    } else {
        res.sendStatus(404);
    }
}

// User löschen
function deleteUser(req: express.Request, res: express.Response): void {
    const username: string = req.params.username;
//    res.send("Der User mit dem Usernamen " + username + " wurde gelöscht :)");
    if (users.has(username)) {
        users.delete(username);
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
}

// User aktualisieren
function updateUser(req: express.Request, res: express.Response): void {
    const username: string = req.body.username;
    const vorname: string = req.body.vorname;
    const nachname: string = req.body.nachname;
    if (users.has(username)) {
        const u: User = users.get(username);
        if (vorname.length > 0) {u.vorname = vorname}
        if (nachname.length  > 0) {u.nachname = nachname}
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
}

// alle User auslesen und zurück senden
function getUsers(req: express.Request, res: express.Response): void {
// https://www.cloudhadoop.com/2018/09/typescript-how-to-convert-map-tofrom.html
    if (users.size > 0) {
        let jsonObject = {};
        users.forEach((value, key) => {
            jsonObject[key] = value.userInfo;
        });
        res.status(200);
        res.json(jsonObject);
    } else {
        res.sendStatus(204);
    }
}

// Passwort prüfen und speichern
function savePassword(req: express.Request, res: express.Response): void {
    const username: string = req.body.username;
    const oldPassword: string = req.body.old;
    const newPassword: string = req.body.new;
    if (users.has(username)) {
        const u: User = users.get(username);
        console.log(u);
        if(oldPassword != u.getPasswort) {
            // Anfrage nicht erlaubt - "Das alte Passwort ist nicht korrekt!"
            res.sendStatus(403);
        } else {
            u.setPasswort = newPassword;
            res.sendStatus(200);
            }
        } else {
        res.sendStatus(401);
    }
}

// neues Tier anlegen
function postPet(req: express.Request, res: express.Response): void {
    const tiername: string = req.body.tiername;
    const tierart: string = req.body.tierart;
    if (!pets.has(tiername)) {
        pets.set(tiername, new Pet(tiername, tierart));
        res.sendStatus(201);
    } else {
        res.sendStatus(403);
    }
}

// Tiere auslesen und zurück senden
function getPets(req: express.Request, res: express.Response): void {
    if (pets.size > 0) {
        let jsonObject = {};
        pets.forEach((value, key) => {
            jsonObject[key] = value;
        });
        res.status(200);
        res.json(jsonObject);
    } else {
        res.sendStatus(204);
    }
}

// Tier löschen
function deletePet(req: express.Request, res: express.Response): void {
    const tiername: string = req.params.tiername;
    if (pets.has(tiername)) {
        pets.delete(tiername);
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
}

// Tier aktualisieren
function updatePet(req: express.Request, res: express.Response): void {
    const tiername: string = req.body.tiername;
    const tierart: string = req.body.tiertart;
    if (pets.has(tiername)) {
        const p: Pet = pets.get(tiername);
        p.tierart = tierart;
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
}

