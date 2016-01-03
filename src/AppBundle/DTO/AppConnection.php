<?php

namespace AppBundle\DTO;

use AppBundle\Entity\AppConnection as AppConnectionEntity;

class AppConnection
{
    public $id;
    public $name;
    public $client_app;
    public $server_app;
    public $info;
    public $data_to_server;
    public $data_to_client;
    
    public function __construct(AppConnectionEntity $connection, $expand = [])
    {
        $this->id = $connection->getId();
        $this->name = $connection->getName();
        $this->info = $connection->getInfo();
        $this->data_to_server = $connection->getDataToServer();
        $this->data_to_client = $connection->getDataToClient();
        
        
        if (in_array('client_app', $expand)) {
            $childExpand = Utils::getChildExpand($expand, 'client_app');
            $this->client_app = new App($connection->getClientApp(), $childExpand);
        } else {
            $this->client_app = $connection->getClientApp()->getId();
        }
        
        if (in_array('server_app', $expand)) {
            $childExpand = Utils::getChildExpand($expand, 'server_app');
            $this->server_app = new App($connection->getServerApp(), $childExpand);
        } else {
            $this->server_app = $connection->getServerApp()->getId();
        }
    }
}
