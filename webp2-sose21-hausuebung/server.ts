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
const users: Map<string, User> = new Map<string, User>();

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
router.delete("/user/:username", deleteUser)
router.put("/user/:username", updateUser)


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
    const passwort: string = req.body.passwort;
//    res.send("Der User mit dem Usernamen " + username + " wurde aktualisiert :)");
    if (users.has(username)) {
        const u: User = users.get(username);
        u.vorname = vorname;
        u.nachname = nachname;
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }

}

