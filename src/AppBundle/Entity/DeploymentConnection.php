<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(uniqueConstraints={@ORM\UniqueConstraint(name="unq_dep_conn", columns={"client_deployment_id", "connection_id"})})
 */
class DeploymentConnection
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue
     */
    protected $id;
    
    /**
     * @var Deployment The deployment that initiates the connection
     * @ORM\ManyToOne(targetEntity="Deployment", inversedBy="connections")
     * @ORM\JoinColumn(nullable=false)
     */
    protected $clientDeployment;
    
    /**
     * @var Connection The type of connection
     * @ORM\ManyToOne(targetEntity="AppConnection")
     * @ORM\JoinColumn(nullable=false)
     */
    protected $connection;
    
    /**
     * @var Deployment The deployment that is connected to
     * @ORM\ManyToOne(targetEntity="Deployment", inversedBy="inboundConnections")
     * @ORM\JoinColumn(nullable=false)
     */
    protected $serverDeployment;
    
    /** @ORM\Column(type="string") */
    protected $info;
    
    public function __construct(Deployment $clientDeployment, AppConnection $connection, Deployment $serverDeployment, $info = null)
    {
        $this->clientDeployment = $clientDeployment;
        $this->connection = $connection;
        $this->serverDeployment = $serverDeployment;
        $this->info = $info;
    }
    
    protected function validate()
    {
        // Make sure the app types match what the connection expects
        $clientAppId = $this->clientDeployment->getApp()->getId();
        $serverAppId = $this->serverDeployment->getApp()->getId();
        
        return $this->connection->getClientApp()->getId() == $clientAppId && $this->connection->getServerApp()->getId() == $serverAppId;
    }
    
    public function getId()
    {
        return $this->id;
    }
    
    public function getClientDeployment()
    {
        return $this->clientDeployment;
    }
    
    public function getConnection()
    {
        return $this->connection;
    }
    
    public function getServerDeployment()
    {
        return $this->serverDeployment;
    }
    
    public function getInfo()
    {
        return $this->info;
    }
}