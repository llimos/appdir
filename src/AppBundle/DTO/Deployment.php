<?php

namespace AppBundle\DTO;

use AppBundle\Entity\Deployment as DeploymentEntity;

class Deployment
{
    public $id;
    public $app;
    public $name;
    public $env;
    public $info;
    
    public $servers = [];
    public $connections = [];
    public $inbound_connections = [];
    
    public function __construct(DeploymentEntity $deployment, $expand = [])
    {
        $this->id = $deployment->getId();
        $this->name = $deployment->getName();
        $this->env = $deployment->getEnv();
        $this->info = $deployment->getInfo();
        
        if (in_array('app', $expand)) {
            $this->app = new App($deployment->getApp());
        } else {
            $this->app = $deployment->getApp()->getId();
        }
        
        foreach ($deployment->getServers() as $server) {
            if (in_array('servers', $expand)) {
                $childExpand = Utils::getChildExpand($expand, 'servers');
                $this->servers[] = new Server($server, $childExpand);
            } else {
                $this->servers[] = $server->getId();
            }
        }
        
        foreach ($deployment->getConnections() as $connection) {
            if (in_array('connections', $expand)) {
                $childExpand = Utils::getChildExpand($expand, 'connections');
                $childExpand[] = 'server_deployment';
                $this->connections[] = new DeploymentConnection($connection, $childExpand);
            } else {
                $this->connections[] = $connection->getId();
            }
        }
        
        foreach ($deployment->getInboundConnections() as $connection) {
            if (in_array('inbound_connections', $expand)) {
                $childExpand = Utils::getChildExpand($expand, 'inbound_connections');
                $childExpand[] = 'client_deployment';
                $this->inbound_connections[] = new DeploymentConnection($connection, $childExpand);
            } else {
                $this->inbound_connections[] = $connection->getId();
            }
        }
    }
}
