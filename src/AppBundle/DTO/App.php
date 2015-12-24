<?php

namespace AppBundle\DTO;

use AppBundle\Entity\App as AppEntity;

class App
{
    public $id;
    public $name;
    public $type;
    public $info;
    
    public $connections = [];
    public $inbound_connections = [];
    public $deployments = [];
    
    public function __construct(AppEntity $app, $expand = [])
    {
        $this->id = $app->getId();
        $this->name = $app->getName();
        $this->type = $app->getType();
        $this->info = $app->getInfo();
        
        foreach ($app->getConnections() as $connection) {
            if (in_array('connections', $expand)) {
                $childExpand = Utils::getChildExpand($expand, 'connections');
                $childExpand[] = 'server_app';
                $this->connections[] = new AppConnection($connection, $childExpand);
            } else {
                $this->connections[] = $connection->getId();
            }
        }
        
        foreach ($app->getInboundConnections() as $connection) {
            if (in_array('inbound_connections', $expand)) {
                $childExpand = Utils::getChildExpand($expand, 'inbound_connections');
                $childExpand[] = 'client_app';
                $this->inbound_connections[] = new AppConnection($connection, $childExpand);
            } else {
                $this->inbound_connections[] = $connection->getId();
            }
        }
        
        foreach ($app->getDeployments() as $deployment) {
            if (in_array('deployments', $expand)) {
                $childExpand = Utils::getChildExpand($expand, 'deployments');
                $this->deployments[] = new Deployment($deployment, $childExpand);
            } else {
                $this->deployments[] = $deployment->getId();
            }
        }
    }
}
