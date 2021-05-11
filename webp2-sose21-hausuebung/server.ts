import * as express from "express";
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

router.get("/", (reg: express.Request, res: express.Response) => {
    res.status(200);
    res.sendFile(__dirname + "/client/index.html");
//    var path = require('path');
//    res.sendFile(path.resolve(__dirname + "/../client/index.html"));
});

router.use("/res", express.static(__dirname + "/client"));
router.use("/lib", express.static(__dirname + "/node_modules"));

// Routen für REST
router.post("/user", postUser);
router.get("/user/:username", getUser);
router.delete("/user/:username", deleteUser);
router.put("/user/:username", updateUser);
router.get("/users", getUsers);

router.post("/pet", postPet);
router.get("/pet/:tiername", getPet);
router.delete("/pet/:tiername", deletePet);
router.put("/pet/:tiername", updatePet);


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
            delete value["passwort"];
            jsonObject[key] = value
        });
        res.status(200);
        res.json(jsonObject);
    } else {
        res.sendStatus(404);
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

// Tier auslesen und zurück senden
function getPet(req: express.Request, res: express.Response): void {
    const tiername: string = req.params.tiername;
    if (pets.has(tiername)) {
        const p: Pet = pets.get(tiername);
        res.status(200);
        res.json({"tiername":p.tiername,"tierart":p.tierart});
    } else {
        res.sendStatus(404);
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

