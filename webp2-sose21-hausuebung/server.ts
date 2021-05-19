import * as express from "express";
import * as session from "express-session";
import * as mysql from "mysql";

declare module "express-session" {
    interface Session {
        uname: string;
    }
}

const PORT: number = 8080;
const connection: mysql.Connection = mysql.createConnection({
    database: "webp2",
    host: "localhost",
    user: "root"
});
connection.connect((err) => {
    if (err !== null) {
        console.log("DB-Fehler: " + err);
    }
});

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
//const users: Map<string, User> = new Map<string, User>();
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
});

router.post("/login", login);
router.post("/logout", logout);

router.use("/res", express.static(__dirname + "/client"));
router.use("/lib", express.static(__dirname + "/node_modules"));

// Routen für REST
router.post("/user", postUser);
router.get("/user/:username", checkLogin, getUser);
router.delete("/user/:username", checkLogin, deleteUser);
router.put("/user/:username", checkLogin, updateUser);
router.post("/savepassword", checkLogin, savePassword);
router.get("/loggedin", loggedIn);

router.post("/pet", checkLogin, postPet);
router.get("/pets", checkLogin, getPets);
router.delete("/pet/:tiername", checkLogin, deletePet);
router.put("/pet/:tiername", checkLogin, updatePet);

// Autorisiert die Session, falls Benutzer registriert ist
function login(req: express.Request, res: express.Response): void {
    query("SELECT null FROM user WHERE username = ? AND passwort = ?;", [req.body.username, req.body.passwort])
        .then((results)=>{
            if(results.length == 1) {
                req.session.uname = req.body.username;
                res.sendStatus(200);
            } else {
                res.sendStatus(404);
            }
        })
        .catch((err)=>{
            console.log("LOGIN", err);
            res.sendStatus(404);
        })
}

// Beendet die Session
function logout(req: express.Request, res: express.Response): void {
    req.session.destroy(() => {
        res.clearCookie("connect.sid");
//        res.redirect("/");
        res.sendStatus(200);
    });
}

// Prüfen, ob ein User angemeldet ist
function loggedIn(req: express.Request, res: express.Response): void {
    if (req.session.uname !== undefined) {
        query("SELECT username, vorname, nachname FROM user WHERE username = ?;", [req.session.uname])
            .then((results)=>{
                if(results.length == 1) {
                    res.status(200);
                    res.json({"username": results[0]["username"], "vorname": results[0]["vorname"], "nachname": results[0]["nachname"]});
                } else {
                    res.sendStatus(404);
                }
            })
            .catch((err)=>{
                console.log("LOGIN", err);
                res.sendStatus(500);
            })
    } else {
        // Client nicht angemeldet
        res.sendStatus(204);
    }
}

// Eine sog. Middleware-Route prüft, ob der Client angemeldet ist und ruft ggf. die nächste Funktion auf
function checkLogin(req: express.Request, res: express.Response, next: express.NextFunction): void {
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
    query("SELECT NULL FROM user WHERE username = ?;", [req.session.uname])
        .then((results)=>{
            if(results.length == 0) {
                query("INSERT INTO user (username, vorname, nachname, passwort) VALUES (?, ?, ?, ?);", [req.body.username, req.body.vorname, req.body.nachname, req.body.passwort])
                    .then((results)=>{
                        if(results.affectedRows == 1) {
                            res.sendStatus(200);
                        } else {
                            res.sendStatus(404);
                        }
                    })
                    .catch((err)=>{
                        console.log("postUser", err);
                        res.sendStatus(500);
                    })
//                res.status(201);
//                res.json({"username": res.json(results[0]), "vorname": res.json(results[1]), "nachname": res.json(results[2])});
            } else {
                res.sendStatus(403);
            }
        })
        .catch((err)=>{
            console.log("LOGIN", err);
            res.sendStatus(500);
        })
}

// User auslesen und zurück senden
function getUser(req: express.Request, res: express.Response): void {
    query("SELECT vorname, nachname FROM user WHERE username = ?;", [req.params.username])
        .then((results)=>{
            if(results.length == 1) {
                res.status(200);
                res.json({"username": req.params.username, "vorname": results[0]["vorname"], "nachname": results[0]["nachname"]});
            } else {
                res.sendStatus(404);
            }
        })
        .catch((err)=>{
            console.log("getUser", err);
            res.sendStatus(500);
        })
}

// User löschen
function deleteUser(req: express.Request, res: express.Response): void {
    query("DELETE FROM user WHERE username = ?;", [req.params.username])
        .then((results)=>{
            if(results.length == 1) {
                res.sendStatus(200);
            } else {
                res.sendStatus(404);
            }
        })
        .catch((err)=>{
            console.log("deleteUSer", err);
            res.sendStatus(500);
        })
}

// User aktualisieren
function updateUser(req: express.Request, res: express.Response): void {
    query("UPDATE user SET vorname = ?, nachname = ? WHERE username = ?;", [req.body.vorname, req.body.nachname, req.body.username])
        .then((results)=>{
            if(results.affectedRows == 1) {
                res.sendStatus(200);
            } else {
                res.sendStatus(404);
            }
        })
        .catch((err)=>{
            console.log("LOGIN", err);
            res.sendStatus(500);
        })
}

// Passwort prüfen und speichern
function savePassword(req: express.Request, res: express.Response): void {
    query("SELECT passwort FROM user WHERE username = ?;", [req.body.username])
        .then((results)=>{
            if(results.length == 1) {
                if(req.body.old != results[0]["passwort"]) {
                    // Anfrage nicht erlaubt - "Das alte Passwort ist nicht korrekt!"
                    res.sendStatus(403);
                } else {
                    query("UPDATE user SET passwort = ? WHERE username = ?;", [req.body.new, req.body.username])
                        .then((results)=>{
                            if(results.affectedRows == 1) {
                                res.sendStatus(200);
                            } else {
                                res.sendStatus(400);
                            }
                        })
                        .catch((err)=>{
                            console.log("savePassword", err);
                            res.sendStatus(500);
                        })
                }
            } else {
                res.sendStatus(400);
            }
        })
        .catch((err)=>{
            console.log("savePassword", err);
            res.sendStatus(500);
        })
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

// Ein eigener Wrapper, um die MySQL-Query als Promise (then/catch Syntax) zu nutzen
function query(sql: string, param: any[] = []): Promise<any> {
    return new Promise<any>((resolve: any, reject: any) => {
        connection.query(sql, param, (err: mysql.MysqlError | null, results: any) => {
            if (err === null) {
                resolve(results);
            } else {
                reject(err);
            }
        });
    });
}