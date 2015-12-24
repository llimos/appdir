<?php

namespace AppBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 */
class Deployment
{
    const ENV_PROD = 'prod';
    const ENV_STAGING = 'staging';
    const ENV_QA = 'qa';
    const ENV_DEV = 'dev';
    
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue
     */
    protected $id;
    
    /**
     * @var App
     * @ORM\ManyToOne(targetEntity="App", inversedBy="deployments")
     * @ORM\JoinColumn(nullable=false)
     */
    protected $app;
    
    /** @ORM\Column(type="string", nullable=false) */
    protected $name;
    
    /** @ORM\Column(type="string", nullable=false) */
    protected $env;
    
    /** @ORM\Column(type="string") */
    protected $info;

    /**
     * @var Doctrine\Common\Collections\Collection
     * @ORM\ManyToMany(targetEntity="Server", inversedBy="deployments")
     */
    protected $servers;
    
    /**
     * @var Doctrine\Common\Collections\Collection
     * @ORM\OneToMany(targetEntity="DeploymentConnection", mappedBy="clientDeployment", cascade={"all"})
     */
    protected $connections;
    
    /**
     * @var Doctrine\Common\Collections\Collection
     * @ORM\OneToMany(targetEntity="DeploymentConnection", mappedBy="serverDeployment")
     */
    protected $inboundConnections;
    
    public function __construct(App $app, $name, $env, $info = null)
    {
        $this->app = $app;
        $this->name = $name;
        $this->env = $env;
        $this->info = $info;
        $this->servers = new ArrayCollection;
        $this->connections = new ArrayCollection;
        $this->inboundConnections = new ArrayCollection;
    }
    
    public function getId()
    {
        return $this->id;
    }
    
    public function getApp()
    {
        return $this->app;
    }
    
    public function getName()
    {
        return $this->name;
    }
    
    public function getEnv()
    {
        return $this->env;
    }
    
    public function getInfo()
    {
        return $this->info;
    }
    
    public function addServer(Server $server)
    {
        $this->servers->add($server);
        return $this;
    }
    
    public function getServers()
    {
        return $this->servers->toArray();
    }
    
    public function addConnection(DeploymentConnection $connection)
    {
        $this->connections->add($connection);
        return $this;
    }
    
    public function getConnections()
    {
        return $this->connections->toArray();
    }
    
    public function getInboundConnections()
    {
        return $this->inboundConnections->toArray();
    }
}