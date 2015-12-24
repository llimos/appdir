<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 */
class AppConnection
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue
     */
    protected $id;
    
    /** @ORM\Column(type="string", nullable=false) */
    protected $name;
    
    /**
     * @var Application
     * @ORM\ManyToOne(targetEntity="App", inversedBy="connections")
     * @ORM\JoinColumn(nullable=false)
     */
    protected $clientApp;
    
    /**
     * @var Application
     * @ORM\ManyToOne(targetEntity="App", inversedBy="inboundConnections")
     * @ORM\JoinColumn(nullable=false)
     */
    protected $serverApp;
    
    /** @ORM\Column(type="string") */
    protected $info;
    
    /** @ORM\Column(type="boolean") */
    protected $dataToServer = false;
    
    /** @ORM\Column(type="boolean") */
    protected $dataToClient = false;
    
    public function __construct($name, App $clientApp, App $serverApp, $info = null, $dataToServer = false, $dataToClient = false)
    {
        $this->name = $name;
        $this->clientApp = $clientApp;
        $this->serverApp = $serverApp;
        $this->info = $info;
        $this->dataToServer = $dataToServer;
        $this->dataToClient = $dataToClient;
    }
    
    public function getId()
    {
        return $this->id;
    }
    
    public function getName()
    {
        return $this->name;
    }
    
    public function getClientApp()
    {
        return $this->clientApp;
    }
    
    public function getServerApp()
    {
        return $this->serverApp;
    }
    
    public function getInfo()
    {
        return $this->info;
    }
    
    public function getDataToClient()
    {
        return $this->dataToClient;
    }
    
    public function getDataToServer()
    {
        return $this->dataToServer;
    }
}