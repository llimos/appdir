<?php

namespace AppBundle\DTO;

use AppBundle\Entity\Server as ServerEntity;

class Server
{
    public $id;
    public $name;
    public $ip;
    public $info;
    
    public $deployments = [];
    
    public function __construct(ServerEntity $server, $expand = [])
    {
        $this->id = $server->getId();
        $this->name = $server->getName();
        $this->type = $server->getIp();
        $this->info = $server->getInfo();
        
        foreach ($server->getDeployments() as $deployment) {
            if (in_array('deployments', $expand)) {
                $childExpand = Utils::getChildExpand($expand, 'deployments');
                $childExpand[] = 'app';
                $this->deployments[] = new Deployment($deployment, $childExpand);
            } else {
                $this->deployments[] = $deployment->getId();
            }
        }
    }
}
