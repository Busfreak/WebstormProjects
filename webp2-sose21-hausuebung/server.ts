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

router.listen (PORT, () => {
    console.log("Server ist gestartet unter http://localhost:" + PORT + "/");
});

router.use(express.urlencoded({extended: false}));
router.use(express.json());
router.use(session({
    cookie: {
        expires: new Date(Date.now() + (1000 * 60 * 60)),
        sameSite: 'strict'
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
            console.log("login", err);
            res.sendStatus(404);
        })
}

// Beendet die Session
function logout(req: express.Request, res: express.Response): void {
    req.session.destroy(() => {
        res.clearCookie("connect.sid");
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
                console.log("loggedIn", err);
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
    query("SELECT NULL FROM user WHERE username = ?;", [req.body.username])
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
                        console.log("postUser INSERT", err);
                        res.sendStatus(500);
                    })
            } else {
                res.sendStatus(403);
            }
        })
        .catch((err)=>{
            console.log("postUser SELECT", err);
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
    query("SELECT NULL FROM user WHERE username = ?;", [req.params.username])
        .then((results)=>{
            if(results.length == 1) {
                query("DELETE FROM user WHERE username = ?;", [req.params.username])
                    .then((results)=>{
                        if(results.affectedRows == 1) {
                            query("DELETE FROM pets WHERE username = ?;", [req.session.uname])
                                .then((results)=>{})
                                .catch((err)=>{
                                    console.log("deleteUser DELETE Pets", err);
                                    res.sendStatus(500);
                                })
                             res.sendStatus(200);
                        }
                    })
                    .catch((err)=>{
                        console.log("deleteUser DELETE User", err);
                        res.sendStatus(500);
                    })
            } else {
                res.sendStatus(403);
            }
        })
        .catch((err)=>{
            console.log("deleteUser SELECT", err);
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
            console.log("updateUser", err);
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
    query("SELECT NULL FROM pets WHERE username = ? AND tiername = ?;", [req.session.uname, req.body.tiername])
        .then((results)=>{
            if(results.length == 0) {
                query("INSERT INTO pets (username, tiername, tierart) VALUES (?, ?, ?);", [req.session.uname, req.body.tiername, req.body.tierart])
                    .then((results)=>{
                        if(results.affectedRows == 1) {
                            res.sendStatus(201);
                        } else {
                            res.sendStatus(400);
                        }
                    })
                    .catch((err)=>{
                        console.log("postPet INSERT", err);
                        res.sendStatus(500);
                    })
            } else {
                res.sendStatus(403);
            }
        })
        .catch((err)=>{
            console.log("postPet SELECT", err);
            res.sendStatus(500);
        })
}

// Tiere auslesen und zurück senden
function getPets(req: express.Request, res: express.Response): void {
    query("SELECT tiername, tierart FROM pets WHERE username = ?;", [req.session.uname])
        .then((results)=>{
            if(results.length > 0) {
                res.status(200);
                res.json(results);
            } else {
                res.sendStatus(204);
            }
        })
        .catch((err)=>{
            console.log("getPets", err);
            res.sendStatus(500);
        })
}

// Tier löschen
function deletePet(req: express.Request, res: express.Response): void {
    query("SELECT NULL FROM pets WHERE tiername = ?;", [req.params.tiername])
        .then((results)=>{
            if(results.length == 1) {
                query("DELETE FROM pets WHERE username = ? AND tiername = ?;", [req.session.uname, req.params.tiername])
                    .then((results)=>{
                        if(results.affectedRows == 1) {
                            res.sendStatus(200);
                        } else {
                            res.sendStatus(404);
                        }
                    })
                    .catch((err)=>{
                        console.log("deletePet DELETE", err);
                        res.sendStatus(500);
                    })
            } else {
                res.sendStatus(403);
            }
        })
        .catch((err)=>{
            console.log("deletePet SELECT", err);
            res.sendStatus(500);
        })
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