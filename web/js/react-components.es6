(function(window, React, urlTemplates){
    window.AppCard = React.createClass({
        render: function() {
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
    
    window.AppInfo = React.createClass({
        render: function() {
            return (
                <div>
                    <ul className="nav nav-tabs" role="tablist">
                        <li className="nav-item">
                            <a className="nav-link active" data-toggle="tab" href="#deployments" role="tab">Deployments</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" data-toggle="tab" href="#connections" role="tab">Connections</a>
                        </li>
                    </ul>
                    
                    <div className="tab-content p-t-2">
                        <div className="tab-pane active fade in" id="deployments" role="tabpanel">
                            <h1>
                                Deployments
                                <button type="button" className="btn btn-primary pull-md-right">+</button>
                            </h1>
                            <div>
                                {this.props.app.deployments.map((d)=><DeploymentCard key={d.id} deployment={d}/>)}
                            </div>
                        </div>
                        <div className="tab-pane fade" id="connections" role="tabpanel">                    
                            <h1>
                                Connections
                                <button type="button" className="btn btn-primary pull-md-right">+</button>
                            </h1>
                            <h3 className="m-t-1">Outgoing</h3>
                            <div>
                                {this.props.app.connections.length ? 
                                this.props.app.connections.map((c)=><ConnectionCard key={c.id} connection={c} scope="outbound"/>)
                                : <h6 className="text-muted">No outgoing connections defined</h6>}
                            </div>
                            <h3 className="m-t-1">Incoming</h3>
                            <div>
                                {this.props.app.inbound_connections.length ? 
                                this.props.app.inbound_connections.map((c)=><ConnectionCard key={c.id} connection={c} scope="inbound"/>)
                                : <h6 className="text-muted">No incoming connections defined</h6>}
                            </div>
                        </div>
                    </div>
                </div>
            );
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
            return (
                <div className="card">
                    <h5 className="card-header">{this.props.deployment.app.name}</h5>
                    <div className="card-block">
                        <h3>
                            <span className={"label label-"+this.envClass[this.props.deployment.env]}>{this.props.deployment.env.toUpperCase()}</span>
                            <span className="m-x-1">{this.props.deployment.name}</span>
                            <div className="btn-group m-x-1">
                            {this.props.deployment.servers.map((s)=><a className="btn btn-secondary text-primary" key={s.id} href={urlTemplates.server.replace('serverId', s.id)}>{s.name}</a> )}
                            </div>
                            <div className="btn-group-vertical pull-md-right" role="group">
                                <button type="button" className="btn btn-primary-outline">Edit</button> 
                                <button type="button" className="btn btn-danger-outline">Delete</button>
                            </div>
                        </h3>
                        <p>{this.props.deployment.info}</p>
                    </div>
                </div>
            );
        }
    });
    
    window.ConnectionCard = React.createClass({
        getDefaultProps: function(){
            return {
                scope: "outbound"
            };
        },
        
        render: function(){
            var c = this.props.connection;
            var partner = this.props.scope == 'inbound' ? c.client_app : c.server_app;
            
            return (
            <div className="card">
                <h5 className="card-header">{c.name}</h5>
                <div className="card-block">
                    <div className="btn-group-vertical pull-md-right" role="group">
                        <button type="button" className="btn btn-primary-outline">Edit</button> 
                        <button type="button" className="btn btn-danger-outline">Delete</button>
                    </div>
                    <h3 className="card-title">
                        {this.props.scope == "outbound" ? "\u2192" : null} <a href={urlTemplates.app.replace('appId', partner.id)}>{partner.name}</a>
                        <span className="label label-default m-l-1">{partner.type}</span> {this.props.scope == "inbound" ? "\u2192" : null}
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
                    <h3>{this.props.subtitle}</h3>
                    {this.props.children}
                </div>
            );
        }
    });
})(window, React, urlTemplates);