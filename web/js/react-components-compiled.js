(function (window, React, Routing) {
    'use strict';

    var AppCard = props => React.createElement(
        'div',
        { className: 'col-md-4' },
        React.createElement(
            'a',
            { href: Routing.generate('app', { id: props.app.id }) },
            React.createElement(
                'div',
                { className: 'card' },
                React.createElement(
                    'div',
                    { className: 'card-block' },
                    React.createElement(
                        'h4',
                        { className: 'card-title' },
                        props.app.name
                    ),
                    React.createElement(
                        'p',
                        { className: 'card-text' },
                        props.app.info
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'card-block' },
                    React.createElement(
                        'h5',
                        null,
                        props.app.deployments.length,
                        ' deployments'
                    )
                )
            )
        )
    );

    var AppList = props => React.createElement(
        'div',
        { className: 'row' },
        props.apps.map(a => React.createElement(AppCard, { app: a, key: a.id }))
    );

    var ServerCard = props => React.createElement(
        'div',
        { className: 'col-md-4' },
        React.createElement(
            'a',
            { href: Routing.generate('server', { id: props.server.id }) },
            React.createElement(
                'div',
                { className: 'card' },
                React.createElement(
                    'div',
                    { className: 'card-block' },
                    React.createElement(
                        'h4',
                        { className: 'card-title' },
                        props.server.name,
                        ' ',
                        React.createElement(
                            'small',
                            { className: 'text-muted' },
                            props.server.ip
                        )
                    ),
                    React.createElement(
                        'p',
                        { className: 'card-text' },
                        props.server.info
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'card-block' },
                    React.createElement(
                        'h5',
                        null,
                        props.server.deployments.length,
                        ' deployments'
                    )
                )
            )
        )
    );

    var ServerList = props => React.createElement(
        'div',
        { className: 'row' },
        props.servers.map(s => React.createElement(ServerCard, { server: s, key: s.id }))
    );

    var ServerInfo = props => React.createElement(
        'div',
        null,
        React.createElement(
            'p',
            null,
            props.server.info
        ),
        React.createElement(
            'h1',
            null,
            'Deployments'
        ),
        React.createElement(
            'div',
            null,
            props.server.deployments.map(d => React.createElement(DeploymentCard, { key: d.id, deployment: d }))
        )
    );

    var AppInfo = props => React.createElement(
        TabSet,
        { useHash: true, activeTab: props.activeTab },
        React.createElement(
            TabContent,
            { name: 'deployments', title: 'Deployments' },
            React.createElement(
                'h1',
                { className: 'm-b-1' },
                'Deployments',
                React.createElement(
                    'button',
                    { type: 'button', className: 'btn btn-primary pull-md-right' },
                    '+'
                )
            ),
            React.createElement(
                'div',
                null,
                props.app.deployments.map(d => React.createElement(DeploymentCard, { key: d.id, deployment: d }))
            )
        ),
        React.createElement(
            TabContent,
            { name: 'connections', title: 'Connections' },
            React.createElement(
                'h1',
                { className: 'm-b-1' },
                'Connections',
                React.createElement(
                    'button',
                    { type: 'button', className: 'btn btn-primary pull-md-right' },
                    '+'
                )
            ),
            React.createElement(
                'h3',
                { className: 'm-t-1' },
                'Outgoing'
            ),
            React.createElement(
                'div',
                null,
                props.app.connections.length ? props.app.connections.map(c => React.createElement(ConnectionCard, { key: c.id, connection: c })) : React.createElement(
                    'h6',
                    { className: 'text-muted' },
                    'No outgoing connections defined'
                )
            ),
            React.createElement(
                'h3',
                { className: 'm-t-1' },
                'Incoming'
            ),
            React.createElement(
                'div',
                null,
                props.app.inbound_connections.length ? props.app.inbound_connections.map(c => React.createElement(ConnectionCard, { key: c.id, connection: c })) : React.createElement(
                    'h6',
                    { className: 'text-muted' },
                    'No incoming connections defined'
                )
            )
        )
    );

    var TabSet = React.createClass({
        displayName: 'TabSet',

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
                activeTab = React.Children.toArray(this.props.children).find(tab => tab.props.name == this.props.activeTab);
            }
            if (!activeTab) {
                // Use the first one
                activeTab = React.Children.toArray(this.props.children).shift();
            }

            var active = activeTab ? activeTab.props.name : null;

            return React.createElement(
                'div',
                null,
                React.createElement(
                    'ul',
                    { className: 'nav nav-tabs', role: 'tablist' },
                    this.props.children.map(t => React.createElement(
                        'li',
                        { className: 'nav-item', key: t.props.name },
                        React.createElement(
                            'a',
                            { className: "nav-link" + (active == t.props.name ? " active" : ""), href: "#" + t.props.name, 'data-toggle': this.props.useHash ? undefined : "tab", role: 'tab' },
                            t.props.title
                        )
                    ))
                ),
                React.createElement(
                    'div',
                    { className: 'tab-content p-t-2' },
                    this.props.children.map(t => React.createElement(
                        'div',
                        { key: t.props.name, className: "tab-pane" + (active == t.props.name ? " active" : ""), id: t.props.name, role: 'tabpanel' },
                        t
                    ))
                )
            );
        }
    });

    var TabContent = props => React.createElement(
        'div',
        null,
        props.children
    );

    var DeploymentCard = React.createClass({
        displayName: 'DeploymentCard',

        envClass: {
            'prod': 'danger',
            'staging': 'warning',
            'qa': 'primary',
            'dev': 'info'
        },

        render() {
            // Put together connection info
            var deployment = this.props.deployment;
            var outgoing = deployment.app.connections.map(c => ({
                app: c,
                dep: deployment.connections.find(test => test.connection === c)
            }));
            var incoming = deployment.inbound_connections.map(c => ({
                app: c.connection,
                dep: c
            }));

            return React.createElement(
                'div',
                { className: 'card', id: "deployment-" + this.props.deployment.id },
                React.createElement(
                    'h5',
                    { className: 'card-header' },
                    React.createElement(
                        'a',
                        { href: Routing.generate('app', { id: this.props.deployment.app.id }) },
                        this.props.deployment.app.name
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'card-block' },
                    React.createElement(
                        'h3',
                        null,
                        React.createElement(
                            'span',
                            { className: "label label-" + this.envClass[this.props.deployment.env] },
                            this.props.deployment.env.toUpperCase()
                        ),
                        React.createElement(
                            'span',
                            { className: 'm-x-1' },
                            this.props.deployment.name
                        ),
                        React.createElement(
                            'div',
                            { className: 'btn-group m-x-1' },
                            this.props.deployment.servers.map(s => React.createElement(
                                'a',
                                { className: 'btn btn-info-outline', key: s.id, href: Routing.generate('server', { id: s.id }) },
                                s.name
                            ))
                        ),
                        React.createElement(
                            'div',
                            { className: 'btn-group-vertical pull-md-right', role: 'group' },
                            React.createElement(
                                'button',
                                { type: 'button', className: 'btn btn-primary-outline' },
                                'Edit'
                            ),
                            React.createElement(
                                'button',
                                { type: 'button', className: 'btn btn-danger-outline' },
                                'Delete'
                            )
                        )
                    ),
                    React.createElement(
                        'p',
                        null,
                        this.props.deployment.info
                    ),
                    React.createElement(
                        'h5',
                        { className: 'card-title' },
                        React.createElement(
                            'a',
                            { 'data-toggle': 'collapse', 'data-target': "#d" + this.props.deployment.id + "-connections" },
                            'Connections'
                        )
                    ),
                    React.createElement(
                        'div',
                        { className: 'collapse m-t-2', id: "d" + this.props.deployment.id + "-connections" },
                        React.createElement(
                            'h5',
                            null,
                            'Outbound'
                        ),
                        outgoing.length ? React.createElement(
                            'table',
                            { className: 'table' },
                            React.createElement(
                                'thead',
                                null,
                                React.createElement(
                                    'tr',
                                    null,
                                    React.createElement(
                                        'th',
                                        null,
                                        'Connection'
                                    ),
                                    React.createElement(
                                        'th',
                                        null,
                                        'Deployment'
                                    ),
                                    React.createElement(
                                        'th',
                                        null,
                                        'Info'
                                    ),
                                    React.createElement('th', null)
                                )
                            ),
                            React.createElement(
                                'tbody',
                                null,
                                outgoing.map(c => React.createElement(
                                    'tr',
                                    { key: c.app.id },
                                    React.createElement(
                                        'td',
                                        null,
                                        c.app.name,
                                        ' (',
                                        React.createElement(
                                            'a',
                                            { href: Routing.generate('app', { id: c.app.server_app.id }) },
                                            c.app.server_app.name
                                        ),
                                        ')'
                                    ),
                                    React.createElement(
                                        'td',
                                        null,
                                        c.dep ? React.createElement(
                                            'span',
                                            null,
                                            React.createElement(
                                                'a',
                                                { href: Routing.generate('app', { id: c.dep.server_deployment.app.id }) + "#deployment-" + c.dep.server_deployment.id },
                                                c.dep.server_deployment.name
                                            ),
                                            ' ',
                                            React.createElement(
                                                'div',
                                                { className: 'btn-group' },
                                                c.dep.server_deployment.servers.map(s => React.createElement(
                                                    'a',
                                                    { className: 'btn btn-sm btn-info-outline', key: s.id, href: Routing.generate('server', { id: s.id }) },
                                                    s.name
                                                ))
                                            )
                                        ) : null
                                    ),
                                    React.createElement(
                                        'td',
                                        null,
                                        c.dep ? c.dep.info : null
                                    ),
                                    React.createElement(
                                        'td',
                                        null,
                                        React.createElement(
                                            'button',
                                            { type: 'button', className: 'btn btn-primary btn-sm' },
                                            'Edit'
                                        ),
                                        ' '
                                    )
                                ))
                            )
                        ) : React.createElement(
                            'span',
                            { className: 'text-muted' },
                            'No connections'
                        ),
                        React.createElement(
                            'h5',
                            { className: 'm-t-1' },
                            'Inbound'
                        ),
                        incoming.length ? React.createElement(
                            'table',
                            { className: 'table' },
                            React.createElement(
                                'thead',
                                null,
                                React.createElement(
                                    'tr',
                                    null,
                                    React.createElement(
                                        'th',
                                        null,
                                        'Connection'
                                    ),
                                    React.createElement(
                                        'th',
                                        null,
                                        'Deployment'
                                    ),
                                    React.createElement(
                                        'th',
                                        null,
                                        'Info'
                                    )
                                )
                            ),
                            React.createElement(
                                'tbody',
                                null,
                                incoming.map(c => React.createElement(
                                    'tr',
                                    { key: c.dep.id },
                                    React.createElement(
                                        'td',
                                        null,
                                        c.app.name,
                                        ' (',
                                        React.createElement(
                                            'a',
                                            { href: Routing.generate('app', { id: c.app.client_app.id }) },
                                            c.app.client_app.name
                                        ),
                                        ')'
                                    ),
                                    React.createElement(
                                        'td',
                                        null,
                                        c.dep ? React.createElement(
                                            'span',
                                            null,
                                            React.createElement(
                                                'a',
                                                { href: Routing.generate('app', { id: c.dep.client_deployment.app.id }) + "#deployment-" + c.dep.client_deployment.id },
                                                c.dep.client_deployment.name
                                            ),
                                            ' ',
                                            React.createElement(
                                                'div',
                                                { className: 'btn-group' },
                                                c.dep.client_deployment.servers.map(s => React.createElement(
                                                    'a',
                                                    { className: 'btn btn-sm btn-info-outline', key: s.id, href: Routing.generate('server', { id: s.id }) },
                                                    s.name
                                                ))
                                            )
                                        ) : null
                                    ),
                                    React.createElement(
                                        'td',
                                        null,
                                        c.dep ? c.dep.info : null
                                    )
                                ))
                            )
                        ) : React.createElement(
                            'span',
                            { className: 'text-muted' },
                            'No connections'
                        )
                    )
                )
            );
        }
    });

    var ConnectionCard = props => React.createElement(
        'div',
        { className: 'card' },
        React.createElement(
            'h5',
            { className: 'card-header' },
            props.connection.name
        ),
        React.createElement(
            'div',
            { className: 'card-block' },
            React.createElement(
                'div',
                { className: 'btn-group-vertical pull-md-right', role: 'group' },
                React.createElement(
                    'button',
                    { type: 'button', className: 'btn btn-primary-outline' },
                    'Edit'
                ),
                React.createElement(
                    'button',
                    { type: 'button', className: 'btn btn-danger-outline' },
                    'Delete'
                )
            ),
            React.createElement(
                'h3',
                { className: 'card-title' },
                React.createElement(
                    'span',
                    { className: 'label label-default m-r-1' },
                    props.connection.client_app.type
                ),
                React.createElement(
                    'a',
                    { href: Routing.generate('app', { id: props.connection.client_app.id }) + "#connections" },
                    props.connection.client_app.name
                ),
                ' ',
                "\u2192",
                ' ',
                React.createElement(
                    'a',
                    { href: Routing.generate('app', { id: props.connection.server_app.id }) + "#connections" },
                    props.connection.server_app.name
                ),
                React.createElement(
                    'span',
                    { className: 'label label-default m-l-1' },
                    props.connection.server_app.type
                )
            ),
            React.createElement(
                'p',
                null,
                props.connection.info
            )
        )
    );

    var PageHeader = props => React.createElement(
        'div',
        null,
        React.createElement(
            'h1',
            { className: 'display-4' },
            props.title,
            ' ',
            props.label ? React.createElement(
                'span',
                { className: 'label label-default' },
                props.label
            ) : null,
            props.button ? React.createElement(
                'button',
                { type: 'button', onClick: props.button, className: 'btn btn-primary-outline btn-lg pull-md-right' },
                props.buttonText ? props.buttonText : 'Edit info'
            ) : null
        ),
        React.createElement(
            'h3',
            { className: 'text-muted' },
            props.subtitle
        ),
        props.children
    );

    var NavBar = class NavBar extends React.Component {
        constructor() {
            super();
            this.defaultProps = { active: null };

            var items = {
                'Servers': Routing.generate('server'),
                'Apps': Routing.generate('app')
            };

            this.render = function () {
                return React.createElement(
                    'nav',
                    { className: 'navbar navbar-dark navbar-full bg-info' },
                    React.createElement(
                        'a',
                        { className: 'navbar-brand', href: Routing.generate('single-page') },
                        React.createElement('img', { src: '/connections.png', height: '32', style: { display: "inline-block" } }),
                        ' ',
                        React.createElement(
                            'strong',
                            { style: { color: "black" } },
                            'Application Directory'
                        )
                    ),
                    React.createElement(
                        'ul',
                        { className: 'nav navbar-nav' },
                        Object.keys(items).map(item => React.createElement(
                            'li',
                            { key: item, className: "nav-item" + (this.props.active == item ? " active" : "") },
                            React.createElement(
                                'a',
                                { className: 'nav-link', href: items[item] },
                                item
                            )
                        ))
                    )
                );
            };
        }
    };

    var Homepage = props => React.createElement(
        'div',
        null,
        React.createElement(
            'h1',
            { className: 'm-b-1' },
            'How to use Application Directory'
        ),
        React.createElement(
            'p',
            null,
            'An ',
            React.createElement(
                'strong',
                null,
                'application'
            ),
            ' can have multiple ',
            React.createElement(
                'strong',
                null,
                'deployments'
            ),
            ', each of which can reside on zero or more ',
            React.createElement(
                'strong',
                null,
                'servers'
            ),
            '.'
        ),
        React.createElement(
            'p',
            null,
            React.createElement(
                'strong',
                null,
                'Applications'
            ),
            ' can be defined as ',
            React.createElement(
                'em',
                null,
                'internal'
            ),
            ', ',
            React.createElement(
                'em',
                null,
                'vendor'
            ),
            ' or ',
            React.createElement(
                'em',
                null,
                'cloud'
            ),
            '.'
        ),
        React.createElement(
            'p',
            null,
            React.createElement(
                'strong',
                null,
                'Deployments'
            ),
            ' can be defined as ',
            React.createElement(
                'em',
                null,
                'prod'
            ),
            ', ',
            React.createElement(
                'em',
                null,
                'QA'
            ),
            ', ',
            React.createElement(
                'em',
                null,
                'staging'
            ),
            ' or ',
            React.createElement(
                'em',
                null,
                'dev'
            ),
            '.'
        ),
        React.createElement(
            'p',
            null,
            'An ',
            React.createElement(
                'strong',
                null,
                'application connection'
            ),
            ' defines when an ',
            React.createElement(
                'strong',
                null,
                'application'
            ),
            ' needs to connect to another ',
            React.createElement(
                'strong',
                null,
                'application'
            ),
            '.'
        ),
        React.createElement(
            'p',
            null,
            'A ',
            React.createElement(
                'strong',
                null,
                'deployment connection'
            ),
            ' defines an instance of an ',
            React.createElement(
                'strong',
                null,
                'application connection'
            ),
            ', describing ',
            React.createElement(
                'em',
                null,
                'which'
            ),
            ' ',
            React.createElement(
                'strong',
                null,
                'deployment'
            ),
            ' of the client ',
            React.createElement(
                'strong',
                null,
                'application'
            ),
            ' connects to which ',
            React.createElement(
                'strong',
                null,
                'deployment'
            ),
            ' of the server ',
            React.createElement(
                'strong',
                null,
                'application'
            ),
            '.'
        )
    );

    var ModalDialog = class ModalDialog extends React.Component {
        constructor(props) {
            super(props);
            this.state = { message: null };
        }

        open(callback) {
            if (callback) {
                jQuery(this._dialog).on('shown.bs.modal', callback);
            }
            jQuery(this._dialog).modal('show');
        }

        close(callback) {
            if (callback) {
                jQuery(this._dialog).on('hidden.bs.modal', callback);
            }
            jQuery(this._dialog).modal('hide');
        }

        componentDidMount() {
            this.open();
        }

        componentDidUpdate() {
            this.open();
        }

        handleSubmit(event) {
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
            return React.createElement(
                'div',
                { id: 'modal', className: 'modal fade', ref: d => this._dialog = d },
                React.createElement(
                    'div',
                    { className: 'modal-dialog', role: 'document' },
                    React.createElement(
                        'div',
                        { className: 'modal-content' },
                        React.createElement(
                            'div',
                            { className: 'modal-header' },
                            React.createElement(
                                'button',
                                { type: 'button', className: 'close', onClick: close, 'aria-label': 'Close' },
                                React.createElement(
                                    'span',
                                    { 'aria-hidden': 'true' },
                                    '×'
                                )
                            ),
                            React.createElement(
                                'h4',
                                { className: 'modal-title' },
                                this.props.title
                            )
                        ),
                        React.createElement(
                            'div',
                            { className: 'modal-body' },
                            this.state.message ? React.createElement(
                                Alert,
                                { type: 'danger' },
                                this.state.message
                            ) : '',
                            this.props.children
                        ),
                        React.createElement(
                            'div',
                            { className: 'modal-footer' },
                            React.createElement(
                                'button',
                                { type: 'button', className: 'btn btn-secondary', onClick: close },
                                'Close'
                            ),
                            React.createElement('input', { type: 'submit', className: 'btn btn-primary', value: 'Save', onClick: '' })
                        )
                    )
                )
            );
        }
    };

    var AppForm = class AppForm extends React.Component {
        handleSubmit(event) {
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
            return React.createElement(
                'form',
                { onSubmit: handleSubmit },
                React.createElement(FormInput, { name: 'name', value: app.name, formName: 'app', label: 'Name' }),
                React.createElement(FormSelect, { name: 'type', value: app.type, formName: 'app', label: 'Type', options: { internal: "Internal", vendor: "Vendor", cloud: "Cloud", wrong: "Invalid" } }),
                React.createElement(FormInput, { name: 'info', value: app.info, formName: 'app', label: 'Extra info' })
            );
        }
    };

    var FormInput = class FormInput extends React.Component {
        render() {
            var props = this.props;
            var id = props.formName + '-' + props.name;
            return React.createElement(
                'fieldset',
                { className: 'form-group' },
                React.createElement(
                    'label',
                    { labelFor: id },
                    props.label
                ),
                React.createElement('input', { type: props.type, className: 'form-control', name: name, id: id, defaultValue: this.props.value })
            );
        }
    };
    FormInput.defaultProps = { type: "text", value: null };

    var FormSelect = class FormSelect extends React.Component {
        render() {
            var props = this.props;
            var id = props.formName + '-' + props.name;
            return React.createElement(
                'fieldset',
                { className: 'form-group' },
                React.createElement(
                    'label',
                    { labelFor: id },
                    props.label
                ),
                React.createElement(
                    'select',
                    { className: 'form-control', name: name, id: id },
                    Object.keys(props.options).map(value => React.createElement(
                        'option',
                        { key: value, value: value },
                        props.options[value]
                    ))
                )
            );
        }
    };

    var Alert = props => React.createElement(
        'div',
        { className: "alert alert-dismissable fade in alert-" + props.type, role: 'alert' },
        React.createElement(
            'button',
            { type: 'button', className: 'close', 'data-dismiss': 'alert', 'aria-label': 'Close' },
            React.createElement(
                'span',
                { 'aria-hidden': 'true' },
                '×'
            )
        ),
        props.children
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

//# sourceMappingURL=react-components-compiled.js.map