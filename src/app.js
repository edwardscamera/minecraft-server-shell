const fs = require("fs");
const os = require("os");
const path = require("path");
const dialog = require("electron").remote.dialog;

const DIR = {
    HOME: path.join(os.homedir(), "./MinecraftServerShell/"),
    SERVERS: path.join(os.homedir(), "./MinecraftServerShell/servers/"),
    SERVER: null,
};

if (!fs.existsSync(DIR.HOME)) fs.mkdirSync(DIR.HOME);
if (!fs.existsSync(DIR.SERVERS)) fs.mkdirSync(DIR.SERVERS);

const updateServerList = (dir) => {
    let subdirs = fs.readdirSync(dir, { withFileTypes: true, })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    document.querySelector("#ServerSelect_Label").innerText = `${subdirs.length} Server${subdirs.length === 1 ? "" : "s"} Found`;

    let layout = new Array(subdirs.length).fill(null);
    for (let i = 0; i < layout.length; i++) layout[i] = {
        tag: "div",
        children: [
            {
                tag: "img",
                src: fs.existsSync(path.join(DIR.SERVERS, subdirs[i], "./server-icon.png")) ? path.join(DIR.SERVERS, subdirs[i], "./server-icon.png") : "./default.png",
                style: { verticalAlign: "middle", },
                draggable: false,
            },
            {
                tag: "span",
                content: subdirs[i],
                style: { marginLeft: "15px", },
            }
        ],
    };

    while (document.querySelector("#ServerSelect_List").children.length > 0) document.querySelector("#ServerSelect_List").children[0].remove();
    createLayout(layout, document.querySelector("#ServerSelect_List"));
};
fs.watch(DIR.SERVERS, () => updateServerList(DIR.SERVERS));
updateServerList(DIR.SERVERS);

const createServer = () => {
    if (dialog.showMessageBoxSync(null, {
        type: "question",
        title: "Minecraft Server Shell",
        buttons: ["Yes", "Cancel"],
        message: `Do you really want to create the server "${document.querySelector("#AddServer_Name").value}" with these settings? The settings can be changed afterwards.`,
    }) === 1) return;
};

const showPanel = (panel) => {
    Array.from(document.querySelector("#Panels").children).forEach(pan => {
        pan.style.display = pan.id === `Panel_${panel}` ? "block" : "none";
    });
};
showPanel("ServerSelect");

const openExternal = (url) => require("electron").shell.openExternal(url);
const switchDesc = () => {
    let dropval = document.querySelector("#AddServer_JAR").value;
    Array.from(document.getElementsByClassName("AddServer_PaperDesc")).forEach(c => c.style.display = (dropval === "Paper" ? "block" : "none"));
    Array.from(document.getElementsByClassName("AddServer_VanillaDesc")).forEach(c => c.style.display = (dropval === "Vanilla" ? "block" : "none"));
    Array.from(document.getElementsByClassName("AddServer_CustomDesc")).forEach(c => c.style.display = (dropval === "Custom" ? "block" : "none"));
};
switchDesc();
const disableBtn = () => document.querySelector("#AddServer_CreateButton").disabled = !document.querySelector("#AddServer_EULA").checked;