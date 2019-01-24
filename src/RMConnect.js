class ClientWS {
    constructor(ip, options = {}) {
        const {shell = () => {}} = options;
        this.shell = shell;
        this.ip = ip;
        console.log("Connecting to " + this.ip + "...");
        this.socket = new WebSocket("ws://" + this.ip + ":44443");
        this.socketWorker();
    }

    socketWorker() {
        this.socket.onopen = (...args) => {
            console.log("Connection to " + this.ip + " succesed.");
            console.log("Creating shell...");
            console.log(this.shell);
            
            this.shell.setHostnameRM();
        };
        
        this.socket.onclose = function(event) {
            if (event.wasClean) {
                console.log("Connection to " + this.ip + " has been closed.");
            } else {
                console.log("Disconnected host " + this.ip);
            }
            console.log('Code: ' + event.code + '; Reason: ' + event.reason);
        };
        
        this.socket.onmessage = (...args) => {
            console.log("Recieved data: " + args[0].data);
            this.shell.onResultShell(JSON.parse(args[0].data));
        };
        
        this.socket.onerror = function(error) {
            console.log("Error: " + error.message);
        };
    }

    sender(data) {
        this.socket.send(data);
    }
}

export default ClientWS;