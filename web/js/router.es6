(function router(page, document, headerContainer, contentContainer, navContainer, appData, ReactDOM, $){
    var renderApp = function renderApp (title, header, content, activeMenu){
        // Title
        document.title = (title ? title + " :: " : "") + "Application Directory";
        // Header
        ReactDOM.render(header, headerContainer);
        // Content
        ReactDOM.render(content, contentContainer);
        // Active menu item
        ReactDOM.render(<NavBar active={activeMenu}/>, navContainer);
    };
    
    // Routing
    
    // Transition on all pages
    page('*', function(ctx, next){
        // If only the hash changed, don't apply transition
        if (ctx.init) {
            next();
        } else {
            contentContainer.classList.add('transition');
            headerContainer.classList.add('transition');
            setTimeout(function(){
                contentContainer.classList.remove('transition');
                headerContainer.classList.remove('transition');
                next();
            }, 150);
        }
    });
    
    // Homepage
    page('/', function(ctx, next){
        renderApp(null, <PageHeader title="Application Directory"/>, <Homepage/>, null);
        ctx.handled = true;
        next();
    });
    
    // App list
    page('/app/', function(ctx, next){
        // Convert app list to array
        var apps = [];
        for (var id in appData.app) {
            apps.push(appData.app[id]);
        }
        renderApp('Apps', <PageHeader title="Apps" button={function(){}} buttonText="+ Add"/>, <AppList apps={apps}/>, 'Apps');
        ctx.handled = true;
        next();
    });
    
    // App info
    page('/app/:appId', function(ctx, next){
        var app = appData.app[ctx.params.appId];
        var hash = window.location.hash.substring(1);
        var activeTab;
        if (hash && hash.substr(0, 11) === 'deployment-') {
            activeTab = 'deployments';
        }
        else if (hash && hash.substr(0, 11) === 'connection-') {
            activeTab = 'connections';
        }
        else {
            activeTab = hash;
        }
        renderApp(
            app.name,
            <PageHeader title={app.name} label={app.type} button={function(){}} subtitle={app.info}/>,
            <AppInfo app={app} activeTab={activeTab}/>,
            'Apps'
        );
        ctx.handled = true;
        next();
    });
    
    // Server list
    page('/server/', function(ctx, next){
        // Convert servers list to array
        var servers = [];
        for (var id in appData.server) {
            servers.push(appData.server[id]);
        }
        renderApp('Servers', <PageHeader title="Servers" button={function(){}} buttonText="+ Add"/>, <ServerList servers={servers}/>, 'Servers');
        ctx.handled = true;
        next();
    });
        
    // Server info
    page('/server/:serverId', function(ctx, next){
        var server = appData.server[ctx.params.serverId];
        renderApp(
            server.name,
            <PageHeader title={server.name} button={function(){}} subtitle={server.ip}/>,
            <ServerInfo server={server}/>,
            'Servers'
        );
        ctx.handled = true;
        next();
    });
    
    // After rendering, de-linkify all links that are to the current page
    page('*', function(ctx, next) {
        $('a.unlink').removeClass('unlink');
        $('a[href="' + ctx.canonicalPath + '"], a[href="' + ctx.canonicalPath.split('#')[0] + '"]').addClass('unlink');
        next();
    });
    
    // Go forth young router
    page();
})(page, document, document.getElementById('page-header'), document.getElementById('page-content'), document.getElementById('nav-bar'), app.data, ReactDOM, jQuery);
