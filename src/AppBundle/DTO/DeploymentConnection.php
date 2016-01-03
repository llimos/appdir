<?php

namespace AppBundle\DTO;

use AppBundle\Entity\DeploymentConnection as DeploymentConnectionEntity;

class DeploymentConnection
{
    public $id;
    public $client_deployment;
    public $connection;
    public $server_deployment;
    public $info;
    
    public function __construct(DeploymentConnectionEntity $connection, $expand = [])
    {
        $this->id = $connection->getId();
        $this->info = $connection->getInfo();
        
        if (in_array('client_deployment', $expand)) {
            $childExpand = Utils::getChildExpand($expand, 'client_deployment');
            $this->client_deployment = new Deployment($connection->getClientDeployment(), $childExpand);
        } else {
            $this->client_deployment = $connection->getClientDeployment()->getId();
        }
        
        if (in_array('connection', $expand)) {
            $childExpand = Utils::getChildExpand($expand, 'connection');
            $this->connection = new AppConnection($connection->getConnection(), $childExpand);
        } else {
            $this->connection = $connection->getConnection()->getId();
        }
        
        if (in_array('server_deployment', $expand)) {
            $childExpand = Utils::getChildExpand($expand, 'server_deployment');
            $this->server_deployment = new Deployment($connection->getServerDeployment(), $childExpand);
        } else {
            $this->server_deployment = $connection->getServerDeployment()->getId();
        }
    }
}
