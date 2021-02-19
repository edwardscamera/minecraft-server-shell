const { Terminal } = require("xterm");
const { FitAddon } = require("xterm-addon-fit");
const pty = require("node-pty");

const openTerminal = (server) => {
    term = new Terminal();
    while (document.querySelector("#Terminal_Terminal").children.length > 0) document.querySelector("#Terminal_Terminal").children[0].remove();
    term.open(document.querySelector("#Terminal_Terminal"));

    const shell = os.platform() === "win32" ? "cmd.exe" : "bash";
    ptyProcess = pty.spawn(shell, [], {
        name: "xterm-color",
        cols: 80,
        rows: 30,
        cwd: DIR.SERVER,
        env: process.env,
    });

    term.onData(data => ptyProcess.write(data));
    ptyProcess.onData(data => term.write(data));


    fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    window.onresize = () => {
        if (!ptyProcess.killed && document.querySelector("#Panel_Terminal").style.display === "block") fitAddon.fit();
        if (!ptyProcess.killed) ptyProcess.resize(term["_core"]["cols"], term["_core"]["rows"]);
    };
    window.onresize();

    checkInt = window.setInterval(checkStatus, 2 * 1000);
};

const checkStatus = () => {
    if (!DIR.SERVER) return;
    Opened.file(path.join(DIR.SERVER, "./server.jar"), (err, result) => {
        if (err) throw err;
        document.querySelector("#Terminal_Start").setAttribute("disabled", result);
        document.querySelector("#Terminal_Stop").setAttribute("disabled", !result);
    });
};

document.querySelector("#Terminal_Start").onclick = () => {
    if (document.querySelector("#Terminal_Start").getAttribute("disabled") === "true") return;
    ptyProcess.write("start.bat\r");
    term.clear();
    document.querySelector("#Terminal_Start").setAttribute("disabled", true);
    document.querySelector("#Terminal_Stop").setAttribute("disabled", true);
    window.setTimeout(checkStatus, 1000);
};

document.querySelector("#Terminal_Stop").onclick = () => {
    if (document.querySelector("#Terminal_Stop").getAttribute("disabled") === "true") return;
    ptyProcess.write("stop\r");
    term.clear();
    document.querySelector("#Terminal_Start").setAttribute("disabled", true);
    document.querySelector("#Terminal_Stop").setAttribute("disabled", true);
    window.setTimeout(checkStatus, 1000);
};