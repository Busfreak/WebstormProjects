import * as express from "express";

const PORT: number = 8080;

const router: express.Express = express();

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

console.log("Server is an")
