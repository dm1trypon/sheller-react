import React, { Fragment, Component } from 'react';
import RMConnect from './RMConnect'
import './main.css';

const ENTER = 13;
const UP = 38;
const DOWN = 40;
const SHELL = 'shell';

class Shell extends Component {
    constructor() {
        super();
        this.linesShell = [];
        this.history = [];
        this.rmConnect = {};
        this.state = {
            operationTK: <div></div>,
            hostTk: '',
            hall: '',
            kind: '',
            pressed: false,
            supportButton: true,
            hostnameRM: '10.15.57.223',
            hostnameEx: '',
            lastBash: '',
            lastBashId: 0,
            lineCount: 0,
            historyCount: 0,
            connectedEx: false,
            connectedRM: false
        };
    }

    onChangeHostnameEx(event) {
        this.setState({hostnameEx: event.target.value});
    }

    onChangeHostnameRM(event) {
        this.setState({hostnameRM: event.target.value});
    }

    setHostnameRM() {
        this.setState({connectedRM: true});
    }

    connectRM() {
        console.log('Creating websocket connection...');
        this.rmConnect = new RMConnect(this.state.hostnameRM, {shell: this});
    }

    onSendOperation(event) {
        switch (event.target.name) {
            case 'xorg':
                this.rmConnect.sender(this.toJsonOperation(event.target.name));
                break;

            case 'hall_xorg':
                this.rmConnect.sender(this.toJsonOperation(event.target.name));   
                break;

            case 'reboot':
                this.rmConnect.sender(this.toJsonOperation(event.target.name));
                break;

            case 'hall_reboot':
                this.rmConnect.sender(this.toJsonOperation(event.target.name));
                break;

            case 'change_template':
                this.rmConnect.sender(this.toJsonOperation(event.target.name));
                break;

            case 'kind':
                this.rmConnect.sender(this.toJsonOperation(event.target.name));
                break;

            case 'hall_kind':
                this.rmConnect.sender(this.toJsonOperation(event.target.name));
                break;

            default:
                break;
        }

        this.setState({hostTk: '', hall: '', kind: ''});
    }

    onSendBash(event) {
        switch (event.keyCode) {
            case ENTER:
                this.history.push(event.target.value);
                this.setState({historyCount: this.state.historyCount + 1});
                this.rmConnect.sender(this.toJsonShell(event.target.value));
                break;

            case UP:
                this.state.lastBash = this.history[this.state.lastBashId];
                document.getElementById('bash').value = this.state.lastBash;

                if (this.state.lastBashId >= this.state.historyCount - 1) {
                    break;
                }
                
                this.setState({lastBashId: this.state.lastBashId + 1});
                break;

            case DOWN:
                this.state.lastBash = this.history[this.state.lastBashId];
                document.getElementById('bash').value = this.state.lastBash;

                if (this.state.lastBashId <= 0) {
                    break;
                }

                this.setState({lastBashId: this.state.lastBashId - 1});
                break;

            default:
                break;
        }
    }

    onResultShell(data) {
        if (!this.checkOnJsonShell(data)) {
            return;
        }

        this.addResultLine(data.result);
        this.addDefaultLine();
    }

    checkOnJsonShell(data) {
        if (data.method === SHELL) {
            return true;
        }

        return false;
    }

    toJsonShell(data) {
        const jsonData = {
                host_tk: this.state.hostnameEx,
                method: SHELL,
                bash: [data]
            };
        
        return JSON.stringify(jsonData);
    }

    toJsonOperation(method) {
        let jsonData;

        switch (method) {
            case 'xorg':
                jsonData = {
                    method: method,
                    host_tk: this.state.hostTk
                };

                break;

            case 'hall_xorg':
                jsonData = {
                    method: method,
                    hall: this.state.hall
                };

                break;

            case 'reboot':
                jsonData = {
                    method: method,
                    host_tk: this.state.hostTk
                };

                break;

            case 'hall_reboot':
                jsonData = {
                    method: method,
                    hall: this.state.hall
                };

                break;

            case 'kind':
                jsonData = {
                    method: method,
                    type: this.state.kind,
                    host_tk: this.state.hostTk
                };

                break;

            case 'hall_kind':
                jsonData = {
                    method: method,
                    type: this.state.kind,
                    hall: this.state.hall
                };

                break;

            case 'change_template':
                jsonData = {
                    method: method,
                    host_tk: this.state.hostTk
                };

                break;
            
            default:
                jsonData = {};
                break;
        }

        return JSON.stringify(jsonData);
    }

    connectEx() {
        if (this.state.hostnameEx === '') {
            alert('Host name is empty!');
            return;
        }

        console.log('Creating command line in shell...');
        this.addDefaultLine();
        this.setState({lineCount: this.state.lineCount + 1, connectedEx: true});
    }

    addResultLine(data) {
        const shellResult = 
            <div className = 'shell__viewer__line' key = {this.state.lineCount}>
                <div>
                    <span className = 'shell__viewer__line__result'>{data}</span>
                </div>
            </div>;

        this.linesShell.push(shellResult);
        this.setState({lineCount: this.state.lineCount + 1});
    }

    

                
    addDefaultLine() {
        const oldLine = 
            <div className = 'shell__viewer__line' key = {this.state.lineCount - 2}>
                <div>
                    <span className = 'shell__viewer__line__remote-host'>root@{this.state.hostnameEx}:$</span>
                </div>
                <div>
                    <span className = 'shell__viewer__line__history'>{this.history[this.state.historyCount - 1]}</span>
                </div>
            </div>;

        const shellLine = 
            <div className = 'shell__viewer__line' key = {this.state.lineCount}>
                <div>
                    <span className = 'shell__viewer__line__remote-host'>root@{this.state.hostnameEx}:$</span>
                </div>
                <div>
                    <input id = 'bash' onKeyUp = {this.onSendBash.bind(this)} autoFocus = 'autofocus'></input>
                </div>
            </div>;

        this.linesShell[this.state.lineCount - 2] = oldLine;
        this.linesShell.push(shellLine);
        this.setState({lineCount: this.state.lineCount + 1});
    }

    onChangeOperationTK(event) {
        switch (event.target.name) {
            case 'host_tk':
                this.setState({hostTk: event.target.value});
                break;

            case 'hall':
                this.setState({hall: event.target.value});
                break;

            case 'kind':
                this.setState({kind: event.target.value});
                break;

            default:
                break;
        }
    }

    addOperationTK(event) {
        let inner = <div></div>;
        let onButton = true;
        switch (event.target.id) {
            case 'xorg':
                inner =
                    <div>
                        <h3>Restart XORG on TK</h3>
                        <span>IP TK:</span>
                        <input name = 'host_tk' onChange = {this.onChangeOperationTK.bind(this)}></input>
                    </div>;

                break;

            case 'hall_xorg':
                inner =
                    <div>
                        <h3>Restart XORG hall</h3>
                        <span>Hall number:</span>
                        <input name = 'hall' onChange = {this.onChangeOperationTK.bind(this)}></input>
                    </div>;
                    
                break;

            case 'reboot':
                inner =
                    <div>
                        <h3>Reboot TK</h3>
                        <span>Input IP TK:</span>
                        <input name = 'host_tk' onChange = {this.onChangeOperationTK.bind(this)}></input>
                    </div>;
            
                break;

            case 'hall_reboot':
                inner =
                    <div>
                        <h3>Reboot hall</h3>
                        <span>Hall number:</span>
                        <input name = 'hall' onChange = {this.onChangeOperationTK.bind(this)}></input>
                    </div>;
            
                break;

            case 'change_template':
                inner =
                    <div>
                        <h3>Check TK</h3>
                        <span>IP TK:</span>
                        <input name = 'host_tk' onChange = {this.onChangeOperationTK.bind(this)}></input>
                    </div>;
                    
                break;

            case 'kind':
                inner =
                    <div>
                        <h3>Change kind TK</h3>
                        <span>IP TK:</span>
                        <input name = 'host_tk' onChange = {this.onChangeOperationTK.bind(this)}></input>
                        <span>Type kind:</span>
                        <input name = 'kind' onChange = {this.onChangeOperationTK.bind(this)}></input>
                    </div>;
            
                break;

            case 'hall_kind':
                inner =
                    <div>
                        <h3>Change kind hall</h3>
                        <span>Hall number:</span>
                        <input name = 'hall' onChange = {this.onChangeOperationTK.bind(this)}></input>
                        <span>Type kind:</span>
                        <input name = 'type' onChange = {this.onChangeOperationTK.bind(this)}></input>
                    </div>;
            
                break;

            default:
                inner =
                    <div>
                        <h3>Button is not work...not yet</h3>
                    </div>
                onButton = false;
                this.setState({method: ''});
                break;
        }

        let button = <div></div>;
        console.log(this.state.supportButton);
        if (onButton) {
            button = <button name = {event.target.id} onClick = {this.onSendOperation.bind(this)}>Send</button>
        }
        
        let block = 
            <div className = 'operation-tk'>
                <div>
                    {inner}
                    <div>
                        {button}
                    </div>
                </div>
            </div>;

        this.setState({pressed: true, operationTK: block});
    }

    disconnectEx() {
        console.log('Disconnecting...');
        this.linesShell = [];
        this.setState({hostnameEx: '', lineCount: 0, connectedEx: false});
        console.log("Здесь могла бы быть Ваша реклама...");
    }

    render() {
        return (
            this.state.connectedRM?
                <Fragment>
                    {this.state.operationTK}
                    <div className = 'shell'>
                        <div className = 'shell__host-connect'>
                        {
                            this.state.connectedEx?
                                <Fragment>
                                    <div>
                                        <span className = 'shell__host-connect__hostname'>Connected host:</span>
                                        <span className = 'shell__host-connect__hostname'>{this.state.hostnameEx}</span>
                                    </div>
                                    <div>
                                        <div className = 'button-new' onClick = {this.disconnectEx.bind(this)}>Disconnect</div>
                                    </div>
                                    
                                </Fragment>
                            :
                                <Fragment>
                                    <div>
                                        <span className = 'shell__host-connect__hostname'>Host name:</span>
                                        <input onChange = {this.onChangeHostnameEx.bind(this)}></input>
                                    </div>
                                    <div>
                                        <div className = 'button-new' onClick = {this.connectEx.bind(this)}>Сonnect</div>
                                    </div>
                                </Fragment>
                        }
                        </div>
                        <div className = 'shell__buttons'>
                            <div className = 'shell__buttons__item' id = 'xorg' onClick = {this.addOperationTK.bind(this)}>XORG</div>
                            <div className = 'shell__buttons__item' id = 'reboot' onClick = {this.addOperationTK.bind(this)}>REBOOT</div>
                            <div className = 'shell__buttons__item' id = 'hall_xorg' onClick = {this.addOperationTK.bind(this)}>HALL<br></br>XORG</div>
                            <div className = 'shell__buttons__item' id = 'hall_reboot' onClick = {this.addOperationTK.bind(this)}>HALL REBOOT</div>
                            <div className = 'shell__buttons__item' id = 'kind' onClick = {this.addOperationTK.bind(this)}>KIND</div>
                            <div className = 'shell__buttons__item' id = 'hall_kind' onClick = {this.addOperationTK.bind(this)}>HALL<br></br>KIND</div>
                            <div className = 'shell__buttons__item' id = 'ping' onClick = {this.addOperationTK.bind(this)}>PING</div>
                            <div className = 'shell__buttons__item' id = 'hall_ping' onClick = {this.addOperationTK.bind(this)}>HALL<br></br>PING</div>
                            <div className = 'shell__buttons__item' id = 'info' onClick = {this.addOperationTK.bind(this)}>INFO</div>
                            <div className = 'shell__buttons__item' id = 'change_template' onClick = {this.addOperationTK.bind(this)}>TEMPLATE</div>
                        </div>
                        <div className = 'shell__viewer'>
                        {
                            this.state.connectedEx?
                                <Fragment>
                                    {this.linesShell}
                                </Fragment>
                            :
                                <div></div>
                        }
                        </div>
                    </div>
                </Fragment>
            :
                <Fragment>
                    <div className = 'rm-connection'>
                        <div>
                            <input onChange = {this.onChangeHostnameRM.bind(this)} value = '10.15.57.223'></input>
                        </div>
                        <div>
                            <div className = 'button-new' onClick = {this.connectRM.bind(this)}>Connect</div>
                        </div>
                    </div>
                </Fragment>
        );
    }
}

export default Shell;