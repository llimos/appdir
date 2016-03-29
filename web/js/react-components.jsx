(function (window, React, Routing) {
    'use strict';
    
    var AppCard = (props)=>
        <div className="col-md-4">
            <a href={Routing.generate('app', {id: props.app.id})}>
                <div className="card">
                    <div className="card-block">
                        <h4 className="card-title">{props.app.name}</h4>
                        <p className="card-text">{props.app.info}</p>
                    </div>
                    <div className="card-block">
                        <h5>{props.app.deployments.length} deployments</h5>
                    </div>
                </div>
            </a>
        </div>
    ;
    
    var AppList = (props)=>
        <div className="row">
            {props.apps.map((a) => <AppCard app={a} key={a.id}/>)}
        </div>
    ;

    var ServerCard = (props)=>
        <div className="col-md-4">
            <a href={Routing.generate('server', {id: props.server.id})}>
                <div className="card">
                    <div className="card-block">
                        <h4 className="card-title">{props.server.name} <small className="text-muted">{props.server.ip}</small></h4>
                        <p className="card-text">{props.server.info}</p>
                    </div>
                    <div className="card-block">
                        <h5>{props.server.deployments.length} deployments</h5>
                    </div>
                </div>
            </a>
        </div>
    ;

    var ServerList = (props)=>
        <div className="row">
            {props.servers.map((s) => <ServerCard server={s} key={s.id}/>)}
        </div>
    ;
        
    var ServerInfo = (props)=>
        <div>
            <p>{props.server.info}</p>
            <h1>
                Deployments
            </h1>
            <div>
                {props.server.deployments.map((d)=><DeploymentCard key={d.id} deployment={d}/>)}
            </div>
        </div>
    ;
    
    var AppInfo = (props)=>
        <TabSet useHash={true} activeTab={props.activeTab}>
            <TabContent name="deployments" title="Deployments">
                <h1 className="m-b-1">
                    Deployments
                    <button type="button" className="btn btn-primary pull-md-right">+</button>
                </h1>
                <div>
                    {props.app.deployments.map((d)=><DeploymentCard key={d.id} deployment={d}/>)}
                </div>
            </TabContent>
            <TabContent name="connections" title="Connections">
                <h1 className="m-b-1">
                    Connections
                    <button type="button" className="btn btn-primary pull-md-right">+</button>
                </h1>
                <h3 className="m-t-1">Outgoing</h3>
                <div>
                    {props.app.connections.length ? 
                    props.app.connections.map((c)=><ConnectionCard key={c.id} connection={c}/>)
                    : <h6 className="text-muted">No outgoing connections defined</h6>}
                </div>
                <h3 className="m-t-1">Incoming</h3>
                <div>
                    {props.app.inbound_connections.length ? 
                    props.app.inbound_connections.map((c)=><ConnectionCard key={c.id} connection={c}/>)
                    : <h6 className="text-muted">No incoming connections defined</h6>}
                </div>
            </TabContent>
        </TabSet>
    ;
        
    var TabSet = React.createClass({
        getDefaultProps() {
            return {
                useHash: false,
                activeTab: null
            };
        },
        
        onSwitch(event) {
            // Update the hash if necessary
            if (this.props.useHash) {
                var scrollmem = $('body').scrollTop();
                window.location.hash = event.target.getAttribute('href').substring(1);
                $('html,body').scrollTop(scrollmem);
            }
        },
        
        render() {
            var activeTab = null;
            if (!activeTab && this.props.activeTab) {
                // Look for default one passed in
                activeTab = React.Children.toArray(this.props.children).find((tab)=>tab.props.name == this.props.activeTab);
            }
            if (!activeTab) {
                // Use the first one
                activeTab = React.Children.toArray(this.props.children).shift();
            }
            
            var active = activeTab ? activeTab.props.name : null;
            
            return (
                <div>
                    <ul className="nav nav-tabs" role="tablist">
                        {this.props.children.map((t)=>(
                        <li className="nav-item" key={t.props.name}>
                            {/* We only handle the switching if useHash is false; otherwise we use URL routing */}
                            <a className={"nav-link" + (active == t.props.name ? " active" : "")} href={"#"+t.props.name} data-toggle={this.props.useHash?undefined:"tab"} role="tab">{t.props.title}</a>
                        </li>))}
                    </ul>
                    
                    <div className="tab-content p-t-2">
                        {this.props.children.map((t)=><div key={t.props.name} className={"tab-pane" + (active == t.props.name ? " active" : "")} id={t.props.name} role="tabpanel">{t}</div>)}
                    </div>
                </div>
            );
        }
    });
    
    var TabContent = (props)=> <div>{props.children}</div>;
        
    var DeploymentCard = React.createClass({
        envClass: {
            'prod': 'danger',
            'staging': 'warning',
            'qa': 'primary',
            'dev': 'info'
        },
        
        render() {
            // Put together connection info
            var deployment = this.props.deployment;
            var outgoing = deployment.app.connections.map((c)=> ({
                app: c,
                dep: deployment.connections.find(test => test.connection === c)
            }));
            var incoming = deployment.inbound_connections.map((c)=> ({
                app: c.connection,
                dep: c
            }));
            
            return (
                <div className="card" id={"deployment-" + this.props.deployment.id}>
                    <h5 className="card-header"><a href={Routing.generate('app', {id: this.props.deployment.app.id})}>{this.props.deployment.app.name}</a></h5>
                    <div className="card-block">
                        <h3>
                            <span className={"label label-"+this.envClass[this.props.deployment.env]}>{this.props.deployment.env.toUpperCase()}</span>
                            <span className="m-x-1">{this.props.deployment.name}</span>
                            <div className="btn-group m-x-1">
                            {this.props.deployment.servers.map((s)=><a className="btn btn-info-outline" key={s.id} href={Routing.generate('server', {id: s.id})}>{s.name}</a> )}
                            </div>
                            <div className="btn-group-vertical pull-md-right" role="group">
                                <button type="button" className="btn btn-primary-outline">Edit</button> 
                                <button type="button" className="btn btn-danger-outline">Delete</button>
                            </div>
                        </h3>
                        <p>{this.props.deployment.info}</p>
                        <h5 className="card-title"><a data-toggle="collapse" data-target={"#d"+this.props.deployment.id+"-connections"}>Connections</a></h5>
                        <div className="collapse m-t-2" id={"d"+this.props.deployment.id+"-connections"}>
                        
                            <h5>Outbound</h5>
                            {outgoing.length ?
                            <table className="table">
                                <thead><tr>
                                    <th>Connection</th>
                                    <th>Deployment</th>
                                    <th>Info</th>
                                    <th/>
                                </tr></thead>
                                <tbody>
                                    {outgoing.map(c =>
                                        <tr key={c.app.id}>
                                            <td>{c.app.name} (<a href={Routing.generate('app', {id: c.app.server_app.id})}>{c.app.server_app.name}</a>)</td>
                                            <td>{c.dep ? <span><a href={Routing.generate('app', {id: c.dep.server_deployment.app.id})+"#deployment-"+c.dep.server_deployment.id}>{c.dep.server_deployment.name}</a> <div className="btn-group">{c.dep.server_deployment.servers.map(s=><a className="btn btn-sm btn-info-outline" key={s.id} href={Routing.generate('server', {id: s.id})}>{s.name}</a>)}</div></span> : null}</td>
                                            <td>{c.dep ? c.dep.info : null}</td>
                                            <td><button type="button" className="btn btn-primary btn-sm">Edit</button> </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            :<span className="text-muted">No connections</span>}
                            
                            <h5 className="m-t-1">Inbound</h5>
                            {incoming.length ?
                            <table className="table">
                                <thead><tr>
                                    <th>Connection</th>
                                    <th>Deployment</th>
                                    <th>Info</th>
                                </tr></thead>
                                <tbody>
                                    {incoming.map(c =>
                                        <tr key={c.dep.id}>
                                            <td>{c.app.name} (<a href={Routing.generate('app', {id: c.app.client_app.id})}>{c.app.client_app.name}</a>)</td>
                                            <td>{c.dep ? <span><a href={Routing.generate('app', {id: c.dep.client_deployment.app.id}) +"#deployment-"+c.dep.client_deployment.id}>{c.dep.client_deployment.name}</a> <div className="btn-group">{c.dep.client_deployment.servers.map(s=><a className="btn btn-sm btn-info-outline" key={s.id} href={Routing.generate('server', {id: s.id})}>{s.name}</a>)}</div></span> : null}</td>
                                            <td>{c.dep ? c.dep.info : null}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            :<span className="text-muted">No connections</span>}
                        </div>
                    </div>
                </div>
            );
        }
    });
    
    var ConnectionCard = (props)=>
        <div className="card">
            <h5 className="card-header">{props.connection.name}</h5>
            <div className="card-block">
                <div className="btn-group-vertical pull-md-right" role="group">
                    <button type="button" className="btn btn-primary-outline">Edit</button> 
                    <button type="button" className="btn btn-danger-outline">Delete</button>
                </div>
                <h3 className="card-title">
                    <span className="label label-default m-r-1">{props.connection.client_app.type}</span><a href={Routing.generate('app', {id: props.connection.client_app.id})+"#connections"}>{props.connection.client_app.name}</a> {"\u2192"} <a href={Routing.generate('app', {id: props.connection.server_app.id})+"#connections"}>{props.connection.server_app.name}</a><span className="label label-default m-l-1">{props.connection.server_app.type}</span>
                </h3>
                <p>{props.connection.info}</p>
            </div>
        </div>
    ;
    
    var PageHeader = (props)=>
        <div>
            <h1 className="display-4">
                {props.title} {props.label ? <span className="label label-default">{props.label}</span> : null}
                {props.button ?
                <button type="button" onClick={props.button} className="btn btn-primary-outline btn-lg pull-md-right">{props.buttonText ? props.buttonText : 'Edit info'}</button>
                : null}
            </h1>
            <h3 className="text-muted">{props.subtitle}</h3>
            {props.children}
        </div>
    ;
    
    var NavBar = class NavBar extends React.Component {
        constructor() {
            super();
            this.defaultProps = {active : null};
            
             var items = {
                'Servers': Routing.generate('server'),
                'Apps': Routing.generate('app')
             };
        
            this.render = function() {
                return (
                    <nav className="navbar navbar-dark navbar-full bg-info">
                        <a className="navbar-brand" href={Routing.generate('single-page')}><img src="/connections.png" height="32" style={{display:"inline-block"}}/> <strong style={{color:"black"}}>Application Directory</strong></a>
                        <ul className="nav navbar-nav">
                            {Object.keys(items).map((item)=>
                                <li key={item} className={"nav-item" + (this.props.active == item ? " active" : "")}>
                                    <a className="nav-link" href={items[item]}>{item}</a>
                                </li>
                            )}
                        </ul>
                    </nav>
                );
            };
        };
    };
    
    var Homepage = (props)=>
        <div>
            <h1 className="m-b-1">How to use Application Directory</h1>
            <p>An <strong>application</strong> can have multiple <strong>deployments</strong>, each of which can reside on zero or more <strong>servers</strong>.</p>
            <p><strong>Applications</strong> can be defined as <em>internal</em>, <em>vendor</em> or <em>cloud</em>.</p>
            <p><strong>Deployments</strong> can be defined as <em>prod</em>, <em>QA</em>, <em>staging</em> or <em>dev</em>.</p>
            <p>An <strong>application connection</strong> defines when an <strong>application</strong> needs to connect to another <strong>application</strong>.</p>
            <p>A <strong>deployment connection</strong> defines an instance of an <strong>application connection</strong>, describing <em>which</em> <strong>deployment</strong> of the client <strong>application</strong> connects to which <strong>deployment</strong> of the server <strong>application</strong>.</p>
        </div>
    ;
    
    var ModalDialog = class ModalDialog extends React.Component {
        constructor(props) {
            super(props);
            this.state = {message: null};
        }

        open(callback){
            if (callback) {
                jQuery(this._dialog).on('shown.bs.modal', callback);
            }
            jQuery(this._dialog).modal('show');
        }
        
        close(callback){
            if (callback) {
                jQuery(this._dialog).on('hidden.bs.modal', callback);
            }
            jQuery(this._dialog).modal('hide');
        }
        
        componentDidMount(){
            this.open();
        }
        
        componentDidUpdate(){
            this.open();
        }
        
        handleSubmit(event){
            event.preventDefault();
            var form = event.target;
            var formdata = new FormData(form);
            var data = {};
            for (var entry of formdata.keys()) {
                data[entry] = formdata.get(entry);
            }
            this.props.onSave(data);
        }
        
        render() {
            var close = this.close.bind(this);
            var handleSubmit = this.handleSubmit.bind(this);
            return (
                <div id="modal" className="modal fade" ref={(d)=>this._dialog=d}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" onClick={close} aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                                <h4 className="modal-title">{this.props.title}</h4>
                            </div>
                            <div className="modal-body">
                                {this.state.message ? <Alert type="danger">{this.state.message}</Alert>:''}
                                {this.props.children}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={close}>Close</button>
                                <input type="submit" className="btn btn-primary" value="Save" onClick=""/>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    };
    
    var AppForm = class AppForm extends React.Component {
        handleSubmit(event){
            event.preventDefault();
            var form = event.target;
            var formdata = new FormData(form);
            var data = {};
            for (var entry of formdata.keys()) {
                data[entry] = formdata.get(entry);
            }
            this.props.onSave(data);
        }

        render() {
            let handleSubmit = this.handleSubmit.bind(this);
            let app = this.props.app;
            return (
                <form onSubmit={handleSubmit}>
                    <FormInput name="name"  value={app.name} formName="app" label="Name"/>
                    <FormSelect name="type" value={app.type} formName="app" label="Type" options={{internal: "Internal", vendor: "Vendor", cloud: "Cloud", wrong: "Invalid"}}/>
                    <FormInput name="info" value={app.info} formName="app" label="Extra info"/>
                </form>
            )
        }
    };

    var FormInput = class FormInput extends React.Component {
        value: null,

        render() {
            let props = this.props;
            let id = props.formName+'-'+props.name;
            this.value = this.props.value;
            return (
                <fieldset className="form-group">
                    <label labelFor={id}>{props.label}</label>
                    <input type={props.type} className="form-control" name={name} id={id} value={this.value} onChange={(evt)=>this.value = evt.target.value}/>
                </fieldset>
            );
        }
    };
    FormInput.defaultProps = {type: "text", value: null};

    var FormSelect = class FormSelect extends React.Component {
        render() {
            var props = this.props;
            var id = props.formName + '-' + props.name;
            return (
                <fieldset className="form-group">
                    <label labelFor={id}>{props.label}</label>
                    <select className="form-control" name={name} id={id}>
                        {Object.keys(props.options).map((value) => (
                            <option key={value} value={value}>{props.options[value]}</option>))}
                    </select>
                </fieldset>
            );
        }
    };
    
    var Alert = (props)=>(
        <div className={"alert alert-dismissable fade in alert-" + props.type} role="alert">
            <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            {props.children}
        </div> 
    );
    
    // Export the ones needed outside
    window.Homepage = Homepage;
    window.AppList = AppList;
    window.ServerList = ServerList;
    window.AppInfo = AppInfo;
    window.ServerInfo = ServerInfo;
    window.NavBar = NavBar;
    window.PageHeader = PageHeader;
    window.AppForm = AppForm;
    window.ModalDialog = ModalDialog;
    window.Alert = Alert;
})(window, React, Routing);