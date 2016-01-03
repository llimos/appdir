(function (window, React, urlTemplates, baseUrl) {
    'use strict';
    window.AppCard = React.createClass({
        render: function () {
            return (
                <div className="col-md-4">
                    <a href={urlTemplates.app.replace('appId', this.props.app.id)}>
                        <div className="card">
                            <div className="card-block">
                                <h4 className="card-title">{this.props.app.name}</h4>
                                <p className="card-text">{this.props.app.info}</p>
                            </div>
                            <div className="card-block">
                                <h5>{this.props.app.deployments.length} deployments</h5>
                            </div>
                        </div>
                    </a>
                </div>
            );
        }
    });
    
    window.AppList = React.createClass({
        render: function() {
            return (
                <div className="row">
                    {this.props.apps.map((a) => <AppCard app={a} key={a.id}/>)}
                </div>
            );
        }
    });

    window.ServerCard = React.createClass({
        render: function() {
            return (
                <div className="col-md-4">
                    <a href={urlTemplates.server.replace('serverId', this.props.server.id)}>
                        <div className="card">
                            <div className="card-block">
                                <h4 className="card-title">{this.props.server.name} <small className="text-muted">{this.props.server.ip}</small></h4>
                                <p className="card-text">{this.props.server.info}</p>
                            </div>
                            <div className="card-block">
                                <h5>{this.props.server.deployments.length} deployments</h5>
                            </div>
                        </div>
                    </a>
                </div>
            );
        }
    });

    window.ServerList = React.createClass({
        render: function() {
            return (
                <div className="row">
                    {this.props.servers.map((s) => <ServerCard server={s} key={s.id}/>)}
                </div>
            );
        }
    });
        
    window.ServerInfo = React.createClass({
        render: function() {
            return (
                <div>
                    <p>{this.props.server.info}</p>
                    <h1>
                        Deployments
                    </h1>
                    <div>
                        {this.props.server.deployments.map((d)=><DeploymentCard key={d.id} deployment={d}/>)}
                    </div>
                </div>
            );
        }
    });
    
    window.AppInfo = React.createClass({
        render: function() {
            return (
                <TabSet useHash={true} activeTab={this.props.activeTab}>
                    <TabContent name="deployments" title="Deployments">
                        <h1>
                            Deployments
                            <button type="button" className="btn btn-primary pull-md-right">+</button>
                        </h1>
                        <div>
                            {this.props.app.deployments.map((d)=><DeploymentCard key={d.id} deployment={d}/>)}
                        </div>
                    </TabContent>
                    <TabContent name="connections" title="Connections">
                        <h1>
                            Connections
                            <button type="button" className="btn btn-primary pull-md-right">+</button>
                        </h1>
                        <h3 className="m-t-1">Outgoing</h3>
                        <div>
                            {this.props.app.connections.length ? 
                            this.props.app.connections.map((c)=><ConnectionCard key={c.id} connection={c}/>)
                            : <h6 className="text-muted">No outgoing connections defined</h6>}
                        </div>
                        <h3 className="m-t-1">Incoming</h3>
                        <div>
                            {this.props.app.inbound_connections.length ? 
                            this.props.app.inbound_connections.map((c)=><ConnectionCard key={c.id} connection={c}/>)
                            : <h6 className="text-muted">No incoming connections defined</h6>}
                        </div>
                    </TabContent>
                </TabSet>
            );
        }
    });
        
    window.TabSet = React.createClass({
        getDefaultProps: function() {
            return {
                useHash: false,
                activeTab: null
            };
        },
        
        onSwitch: function(event) {
            // Update the hash if necessary
            if (this.props.useHash) {
                var scrollmem = $('body').scrollTop();
                window.location.hash = event.target.getAttribute('href').substring(1);
                $('html,body').scrollTop(scrollmem);
            }
        },
        
        render: function() {
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
    
    window.TabContent = React.createClass({
        render: function() {
            return <div>{this.props.children}</div>;
        }
    });
    
    
    window.DeploymentCard = React.createClass({
        envClass: {
            'prod': 'danger',
            'staging': 'warning',
            'qa': 'primary',
            'dev': 'info'
        },
        
        render: function() {
            // Put together connection info
            var deployment = this.props.deployment;
            var outgoing = deployment.app.connections.map(function(c) {
                return {
                    app: c,
                    dep: deployment.connections.find(test => test.connection === c)
                };
            });
            var incoming = deployment.inbound_connections.map(function(c) {
                return {
                    app: c.connection,
                    dep: c
                };
            });
            
            return (
                <div className="card" id={"deployment-" + this.props.deployment.id}>
                    <h5 className="card-header"><a href={urlTemplates.app.replace('appId', this.props.deployment.app.id)}>{this.props.deployment.app.name}</a></h5>
                    <div className="card-block">
                        <h3>
                            <span className={"label label-"+this.envClass[this.props.deployment.env]}>{this.props.deployment.env.toUpperCase()}</span>
                            <span className="m-x-1">{this.props.deployment.name}</span>
                            <div className="btn-group m-x-1">
                            {this.props.deployment.servers.map((s)=><a className="btn btn-info-outline" key={s.id} href={urlTemplates.server.replace('serverId', s.id)}>{s.name}</a> )}
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
                                            <td>{c.app.name} (<a href={urlTemplates.app.replace('appId', c.app.server_app.id)}>{c.app.server_app.name}</a>)</td>
                                            <td>{c.dep ? <span><a href={baseUrl+"/app/"+c.dep.server_deployment.app.id+"#deployment-"+c.dep.server_deployment.id}>{c.dep.server_deployment.name}</a> <div className="btn-group">{c.dep.server_deployment.servers.map(s=><a className="btn btn-sm btn-info-outline" key={s.id} href={urlTemplates.server.replace('serverId', s.id)}>{s.name}</a>)}</div></span> : null}</td>
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
                                        <tr key={c.app.id}>
                                            <td>{c.app.name} (<a href={urlTemplates.app.replace('appId', c.app.client_app.id)}>{c.app.client_app.name}</a>)</td>
                                            <td>{c.dep ? <span><a href={baseUrl+"/app/"+c.dep.client_deployment.app.id+"#deployment-"+c.dep.client_deployment.id}>{c.dep.client_deployment.name}</a> <div className="btn-group">{c.dep.client_deployment.servers.map(s=><a className="btn btn-sm btn-info-outline" key={s.id} href={urlTemplates.server.replace('serverId', s.id)}>{s.name}</a>)}</div></span> : null}</td>
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
    
    window.ConnectionCard = React.createClass({
        render: function(){
            var c = this.props.connection;
            
            return (
            <div className="card">
                <h5 className="card-header">{c.name}</h5>
                <div className="card-block">
                    <div className="btn-group-vertical pull-md-right" role="group">
                        <button type="button" className="btn btn-primary-outline">Edit</button> 
                        <button type="button" className="btn btn-danger-outline">Delete</button>
                    </div>
                    <h3 className="card-title">
                        <span className="label label-default m-r-1">{c.client_app.type}</span><a href={urlTemplates.app.replace('appId', c.client_app.id)+"#connections"}>{c.client_app.name}</a> {"\u2192"} <a href={urlTemplates.app.replace('appId', c.server_app.id)+"#connections"}>{c.server_app.name}</a><span className="label label-default m-l-1">{c.server_app.type}</span>
                    </h3>
                    <p>{c.info}</p>
                </div>
            </div>
            );
        }
    });
    
    window.PageHeader = React.createClass({
        render: function() {
            return (
                <div>
                    <h1 className="display-4">
                        {this.props.title} {this.props.label ? <span className="label label-default">{this.props.label}</span> : null}
                        {this.props.button ?
                        <button type="button" onClick={this.props.button} className="btn btn-primary-outline btn-lg pull-md-right">{this.props.buttonText ? this.props.buttonText : 'Edit info'}</button>
                        : null}
                    </h1>
                    <h3 className="text-muted">{this.props.subtitle}</h3>
                    {this.props.children}
                </div>
            );
        }
    });
    
    window.NavBar = React.createClass({
        items: {
            'Servers': '/server/',
            'Apps': '/app/'
        },
        
        getDefaultProps: function() {
            return {active : null};
        },
        
        render: function() {
            return (
                <nav className="navbar navbar-dark navbar-full bg-info">
                    <a className="navbar-brand" href={baseUrl + "/"}><img src="/connections.png" height="32" style={{display:"inline-block"}}/> <strong style={{color:"black"}}>Application Directory</strong></a>
                    <ul className="nav navbar-nav">
                        {Object.keys(this.items).map((item)=>
                            <li key={item} className={"nav-item" + (this.props.active == item ? " active" : "")}>
                                <a className="nav-link" href={baseUrl + this.items[item]}>{item}</a>
                            </li>
                        )}
                    </ul>
                </nav>
            );
        }
    });
    
    window.Homepage = React.createClass({
        render() {
            return (
                <div>
                    <h1 className="m-b-1">How to use Application Directory</h1>
                    <p>An <strong>application</strong> can have multiple <strong>deployments</strong>, each of which can reside on zero or more <strong>servers</strong>.</p>
                    <p><strong>Applications</strong> can be defined as <em>internal</em>, <em>vendor</em> or <em>cloud</em>.</p>
                    <p><strong>Deployments</strong> can be defined as <em>prod</em>, <em>QA</em>, <em>staging</em> or <em>dev</em>.</p>
                    <p>An <strong>application connection</strong> defines when an <strong>application</strong> needs to connect to another <strong>application</strong>.</p>
                    <p>A <strong>deployment connection</strong> defines an instance of an <strong>application connection</strong>, describing <em>which</em> <strong>deployment</strong> of the client <strong>application</strong> connects to which <strong>deployment</strong> of the server <strong>application</strong>.</p>
                </div>
            );
        }
    });
})(window, React, {app: page.base() + "/app/appId", server: page.base() + "/server/serverId"}, page.base());