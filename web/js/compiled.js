"use strict";

(function (window, React, urlTemplates, page) {
    window.AppCard = React.createClass({
        displayName: "AppCard",

        render: function render() {
            return React.createElement(
                "div",
                { className: "col-md-4" },
                React.createElement(
                    "a",
                    { href: urlTemplates.app.replace('appId', this.props.app.id) },
                    React.createElement(
                        "div",
                        { className: "card" },
                        React.createElement(
                            "div",
                            { className: "card-block" },
                            React.createElement(
                                "h4",
                                { className: "card-title" },
                                this.props.app.name
                            ),
                            React.createElement(
                                "p",
                                { className: "card-text" },
                                this.props.app.info
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "card-block" },
                            React.createElement(
                                "h5",
                                null,
                                this.props.app.deployments.length,
                                " deployments"
                            )
                        )
                    )
                )
            );
        }
    });

    window.AppList = React.createClass({
        displayName: "AppList",

        render: function render() {
            return React.createElement(
                "div",
                { className: "row" },
                this.props.apps.map(function (a) {
                    return React.createElement(AppCard, { app: a, key: a.id });
                })
            );
        }
    });

    window.AppInfo = React.createClass({
        displayName: "AppInfo",

        render: function render() {
            return React.createElement(
                TabSet,
                { useHash: true, defaultTab: "deployments" },
                React.createElement(
                    TabContent,
                    { name: "deployments", title: "Deployments" },
                    React.createElement(
                        "h1",
                        null,
                        "Deployments",
                        React.createElement(
                            "button",
                            { type: "button", className: "btn btn-primary pull-md-right" },
                            "+"
                        )
                    ),
                    React.createElement(
                        "div",
                        null,
                        this.props.app.deployments.map(function (d) {
                            return React.createElement(DeploymentCard, { key: d.id, deployment: d });
                        })
                    )
                ),
                React.createElement(
                    TabContent,
                    { name: "connections", title: "Connections" },
                    React.createElement(
                        "h1",
                        null,
                        "Connections",
                        React.createElement(
                            "button",
                            { type: "button", className: "btn btn-primary pull-md-right" },
                            "+"
                        )
                    ),
                    React.createElement(
                        "h3",
                        { className: "m-t-1" },
                        "Outgoing"
                    ),
                    React.createElement(
                        "div",
                        null,
                        this.props.app.connections.length ? this.props.app.connections.map(function (c) {
                            return React.createElement(ConnectionCard, { key: c.id, connection: c, scope: "outbound" });
                        }) : React.createElement(
                            "h6",
                            { className: "text-muted" },
                            "No outgoing connections defined"
                        )
                    ),
                    React.createElement(
                        "h3",
                        { className: "m-t-1" },
                        "Incoming"
                    ),
                    React.createElement(
                        "div",
                        null,
                        this.props.app.inbound_connections.length ? this.props.app.inbound_connections.map(function (c) {
                            return React.createElement(ConnectionCard, { key: c.id, connection: c, scope: "inbound" });
                        }) : React.createElement(
                            "h6",
                            { className: "text-muted" },
                            "No incoming connections defined"
                        )
                    )
                )
            );
        }
    });

    window.TabSet = React.createClass({
        displayName: "TabSet",

        getDefaultProps: function getDefaultProps() {
            return {
                useHash: false,
                defaultTab: null
            };
        },

        componentDidMount: function componentDidMount() {},

        switchTab: function switchTab(event) {
            $(this).tab('show');
        },

        getInitialState: function getInitialState() {
            var _this = this;

            // See if there's a hash in the URL
            var activeTab = null;
            if (this.props.useHash) {
                activeTab = React.Children.toArray(this.props.children).find(function (tab) {
                    return tab.props.name == window.location.hash.substring(1);
                });
            }
            if (!activeTab) {
                // Look for default one passed in
                activeTab = React.Children.toArray(this.props.children).find(function (tab) {
                    return tab.props.name == _this.props.defaultTab;
                });
            }
            if (!activeTab) {
                // Use the first one
                activeTab = React.Children.toArray(this.props.children).shift();
            }

            return { active: activeTab ? activeTab.props.name : null };
        },

        render: function render() {
            var _this2 = this;

            return React.createElement(
                "div",
                null,
                React.createElement(
                    "ul",
                    { className: "nav nav-tabs", role: "tablist" },
                    this.props.children.map(function (t) {
                        return React.createElement(
                            "li",
                            { className: "nav-item", key: t.props.name },
                            React.createElement(
                                "a",
                                { className: "nav-link" + (_this2.state.active == t.props.name ? " active" : ""), "data-toggle": "tab", href: "#" + t.props.name, role: "tab" },
                                t.props.title
                            )
                        );
                    })
                ),
                React.createElement(
                    "div",
                    { className: "tab-content p-t-2" },
                    this.props.children.map(function (t) {
                        return React.createElement(
                            "div",
                            { key: t.props.name, className: "tab-pane" + (_this2.state.active == t.props.name ? " active" : ""), id: t.props.name, role: "tabpanel" },
                            t
                        );
                    })
                )
            );
        }
    });

    window.TabContent = React.createClass({
        displayName: "TabContent",

        render: function render() {
            return React.createElement(
                "div",
                null,
                this.props.children
            );
        }
    });

    window.DeploymentCard = React.createClass({
        displayName: "DeploymentCard",

        envClass: {
            'prod': 'danger',
            'staging': 'warning',
            'qa': 'primary',
            'dev': 'info'
        },

        render: function render() {
            return React.createElement(
                "div",
                { className: "card" },
                React.createElement(
                    "h5",
                    { className: "card-header" },
                    this.props.deployment.app.name
                ),
                React.createElement(
                    "div",
                    { className: "card-block" },
                    React.createElement(
                        "h3",
                        null,
                        React.createElement(
                            "span",
                            { className: "label label-" + this.envClass[this.props.deployment.env] },
                            this.props.deployment.env.toUpperCase()
                        ),
                        React.createElement(
                            "span",
                            { className: "m-x-1" },
                            this.props.deployment.name
                        ),
                        React.createElement(
                            "div",
                            { className: "btn-group m-x-1" },
                            this.props.deployment.servers.map(function (s) {
                                return React.createElement(
                                    "a",
                                    { className: "btn btn-secondary text-primary", key: s.id, href: urlTemplates.server.replace('serverId', s.id) },
                                    s.name
                                );
                            })
                        ),
                        React.createElement(
                            "div",
                            { className: "btn-group-vertical pull-md-right", role: "group" },
                            React.createElement(
                                "button",
                                { type: "button", className: "btn btn-primary-outline" },
                                "Edit"
                            ),
                            React.createElement(
                                "button",
                                { type: "button", className: "btn btn-danger-outline" },
                                "Delete"
                            )
                        )
                    ),
                    React.createElement(
                        "p",
                        null,
                        this.props.deployment.info
                    )
                )
            );
        }
    });

    window.ConnectionCard = React.createClass({
        displayName: "ConnectionCard",

        getDefaultProps: function getDefaultProps() {
            return {
                scope: "outbound"
            };
        },

        render: function render() {
            var c = this.props.connection;
            var partner = this.props.scope == 'inbound' ? c.client_app : c.server_app;

            return React.createElement(
                "div",
                { className: "card" },
                React.createElement(
                    "h5",
                    { className: "card-header" },
                    c.name
                ),
                React.createElement(
                    "div",
                    { className: "card-block" },
                    React.createElement(
                        "div",
                        { className: "btn-group-vertical pull-md-right", role: "group" },
                        React.createElement(
                            "button",
                            { type: "button", className: "btn btn-primary-outline" },
                            "Edit"
                        ),
                        React.createElement(
                            "button",
                            { type: "button", className: "btn btn-danger-outline" },
                            "Delete"
                        )
                    ),
                    React.createElement(
                        "h3",
                        { className: "card-title" },
                        this.props.scope == "outbound" ? "→" : null,
                        " ",
                        React.createElement(
                            "a",
                            { href: urlTemplates.app.replace('appId', partner.id) },
                            partner.name
                        ),
                        React.createElement(
                            "span",
                            { className: "label label-default m-l-1" },
                            partner.type
                        ),
                        " ",
                        this.props.scope == "inbound" ? "→" : null
                    ),
                    React.createElement(
                        "p",
                        null,
                        c.info
                    )
                )
            );
        }
    });

    window.PageHeader = React.createClass({
        displayName: "PageHeader",

        render: function render() {
            return React.createElement(
                "div",
                null,
                React.createElement(
                    "h1",
                    { className: "display-4" },
                    this.props.title,
                    " ",
                    this.props.label ? React.createElement(
                        "span",
                        { className: "label label-default" },
                        this.props.label
                    ) : null,
                    this.props.button ? React.createElement(
                        "button",
                        { type: "button", onClick: this.props.button, className: "btn btn-primary-outline btn-lg pull-md-right" },
                        this.props.buttonText ? this.props.buttonText : 'Edit info'
                    ) : null
                ),
                React.createElement(
                    "h3",
                    null,
                    this.props.subtitle
                ),
                this.props.children
            );
        }
    });

    window.NavBar = React.createClass({
        displayName: "NavBar",

        items: {
            'Servers': '/server',
            'Apps': '/app'
        },

        getDefaultProps: function getDefaultProps() {
            return { active: null };
        },

        render: function render() {
            var _this3 = this;

            return React.createElement(
                "nav",
                { className: "navbar navbar-dark navbar-full bg-info" },
                React.createElement(
                    "a",
                    { className: "navbar-brand", href: page.base() + "/" },
                    React.createElement("img", { src: "/connections.png", height: "32", style: { display: "inline-block" } }),
                    " ",
                    React.createElement(
                        "strong",
                        { style: { color: "black" } },
                        "Application Directory"
                    )
                ),
                React.createElement(
                    "ul",
                    { className: "nav navbar-nav" },
                    Object.keys(this.items).map(function (item) {
                        return React.createElement(
                            "li",
                            { key: item, className: "nav-item" + (_this3.props.active == item ? " active" : "") },
                            React.createElement(
                                "a",
                                { className: "nav-link", href: page.base() + _this3.items[item] },
                                item
                            )
                        );
                    })
                )
            );
        }
    });
})(window, React, { app: page.base() + "/app/appId", server: page.base() + "/server/serverId" }, page);
(function (page, document, headerContainer, contentContainer, navContainer, appData, ReactDOM) {
    var renderApp = function renderApp(title, header, content, activeMenu) {
        // Title
        document.title = (title ? title + " :: " : "") + "Application Directory";
        // Header
        ReactDOM.render(header, headerContainer);
        // Content
        ReactDOM.render(content, contentContainer);
        // Active menu item
        ReactDOM.render(React.createElement(NavBar, { active: activeMenu }), navContainer);
    };

    // Routing
    page('/', function () {
        renderApp(null, React.createElement(PageHeader, { title: "Application Directory" }), React.createElement(
            "p",
            null,
            "Welcome to Application Directory"
        ), null);
    });

    page('/app/', function () {
        // Convert app list to array
        var apps = [];
        for (var id in appData.app) {
            apps.push(appData.app[id]);
        }
        renderApp('Apps', React.createElement(PageHeader, { title: "Apps" }), React.createElement(AppList, { apps: apps }), 'Apps');
    });

    page('/app/:appId', function (ctx) {
        var app = appData.app[ctx.params.appId];
        renderApp(app.name, React.createElement(PageHeader, { title: app.name, label: app.type, button: function () {}, subtitle: app.info }), React.createElement(AppInfo, { app: app }), 'Apps');
    });

    page();
})(page, document, document.getElementById('page-header'), document.getElementById('page-content'), document.getElementById('nav-bar'), app.data, ReactDOM);