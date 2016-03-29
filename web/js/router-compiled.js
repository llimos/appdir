$(function () {
    (function router(page, document, headerContainer, contentContainer, navContainer, modalContainer, alertsContainer, appData, ReactDOM, $) {

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
        var currentPage;

        // Transition on all pages
        page('*', function (ctx, next) {
            // If only the hash changed, don't apply transition
            if (ctx.init || ctx.path.split('#')[0] == currentPage) {
                next();
            } else {
                contentContainer.classList.add('transition');
                headerContainer.classList.add('transition');
                setTimeout(function () {
                    contentContainer.classList.remove('transition');
                    headerContainer.classList.remove('transition');
                    next();
                }, 150);
            }
        });

        // Homepage
        page('/', function (ctx, next) {
            renderApp(null, React.createElement(PageHeader, { title: "Application Directory" }), React.createElement(Homepage, null), null);
            ctx.handled = true;
            next();
        });

        // App list
        page('/app/', function (ctx, next) {
            // Convert app list to array
            var apps = [];
            for (var id in appData.app) {
                apps.push(appData.app[id]);
            }

            var add = function () {
                var modal; // The 'ref' will populate this

                var save = function (data) {
                    console.log(data);
                    data = { "app": data };
                    jQuery.post('/app_dev.php/api/app', data).done(function (response) {
                        // Close and unmount
                        modal.close(function () {
                            ReactDOM.unmountComponentAtNode(modalContainer);
                        });

                        // Display message
                        ReactDOM.render(React.createElement(
                            Alert,
                            { type: "success" },
                            "App created: ",
                            response.name
                        ), alertsContainer);
                    }).done(function (response) {
                        var id = response.id;
                        window.app.data.app[id] = response;
                    }).fail(function (jqxhr) {
                        var response = jqxhr.responseJSON;
                        // Display error message
                        console.log('Problem');
                        console.log(response);
                        modal.setState({ message: response.message });
                    });

                    // If failure
                    // Don't close
                    // Put error message in the form
                };

                // Open the modal for adding an app
                ReactDOM.render(React.createElement(
                    ModalDialog,
                    { title: "New app", onSave: save, ref: c => modal = c },
                    React.createElement(AppForm, { app: {} })
                ), modalContainer);
            };

            renderApp('Apps', React.createElement(PageHeader, { title: "Apps", button: add, buttonText: "+ Add" }), React.createElement(AppList, { apps: apps }), 'Apps');
            ctx.handled = true;
            next();
        });

        // App info
        page('/app/:appId', function (ctx, next) {
            var app = appData.app[ctx.params.appId];
            var hash = window.location.hash.substring(1);
            var activeTab;
            if (hash && hash.substr(0, 11) === 'deployment-') {
                activeTab = 'deployments';
            } else if (hash && hash.substr(0, 11) === 'connection-') {
                activeTab = 'connections';
            } else {
                activeTab = hash;
            }
            renderApp(app.name, React.createElement(PageHeader, { title: app.name, label: app.type, button: function () {}, subtitle: app.info }), React.createElement(AppInfo, { app: app, activeTab: activeTab }), 'Apps');
            ctx.handled = true;;
            next();
        });

        // Server list
        page('/server/', function (ctx, next) {
            // Convert servers list to array
            var servers = [];
            for (var id in appData.server) {
                servers.push(appData.server[id]);
            }
            renderApp('Servers', React.createElement(PageHeader, { title: "Servers", button: function () {}, buttonText: "+ Add" }), React.createElement(ServerList, { servers: servers }), 'Servers');
            ctx.handled = true;
            next();
        });

        // Server info
        page('/server/:serverId', function (ctx, next) {
            var server = appData.server[ctx.params.serverId];
            renderApp(server.name, React.createElement(PageHeader, { title: server.name, button: function () {}, subtitle: server.ip }), React.createElement(ServerInfo, { server: server }), 'Servers');
            ctx.handled = true;
            next();
        });

        // After rendering, de-linkify all links that are to the current page
        page('*', function (ctx, next) {
            $('a.unlink').removeClass('unlink');
            $('a[href="' + ctx.canonicalPath + '"], a[href="' + ctx.canonicalPath.split('#')[0] + '"]').addClass('unlink');
            next();
        });

        page('*', function (ctx, next) {
            currentPage = ctx.path.split('#')[0];
        });

        // Go forth young router
        page();
    })(page, document, document.getElementById('page-header'), document.getElementById('page-content'), document.getElementById('nav-bar'), document.getElementById('modal-container'), document.getElementById('alerts-container'), app.data, ReactDOM, jQuery);
});

//# sourceMappingURL=router-compiled.js.map