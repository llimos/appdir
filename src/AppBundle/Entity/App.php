<?php

namespace AppBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;


/**
 * @ORM\Entity
 */
class App
{
    const TYPE_INTERNAL = 'internal';
    const TYPE_VENDOR   = 'vendor';
    const TYPE_CLOUD    = 'cloud';
    
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue
     */
    protected $id;
    
    /** @ORM\Column(type="string", nullable=false) */
    protected $name;
    
    /** @ORM\Column(type="string", nullable=false) */
    protected $type;
    
    /** @ORM\Column(type="string") */
    protected $info;
    
    /**
     * @var Doctrine\Common\Collections\Collection
     * @ORM\OneToMany(targetEntity="Deployment", mappedBy="app", cascade="all", orphanRemoval=true)
     */
    protected $deployments;
    
    /**
     * @var Doctrine\Common\Collections\Collection
     * @ORM\OneToMany(targetEntity="AppConnection", mappedBy="clientApp", cascade="all", orphanRemoval=true)
     */
    protected $connections;
    
    /**
     * @var Doctrine\Common\Collections\Collection
     * @ORM\OneToMany(targetEntity="AppConnection", mappedBy="serverApp", cascade="all", orphanRemoval=true)
     */
    protected $inboundConnections;
    
    public function __construct($name = null, $type = self::TYPE_INTERNAL, $info = null)
    {
        $this->name = $name;
        $this->type = $type;
        $this->info = $info;
        $this->deployments = new ArrayCollection;
        $this->connections = new ArrayCollection;
        $this->inboundConnections = new ArrayCollection;
    }
    
    public function getId()
    {
        return $this->id;
    }
    
    public function getName()
    {
        return $this->name;
    }
    
    public function setName($name)
    {
        $this->name = $name;
        return $this;
    }
    
    public function getType()
    {
        return $this->type;
    }
    
    public function setType($type)
    {
        if (!in_array($type, [self::TYPE_INTERNAL, self::TYPE_VENDOR, self::TYPE_CLOUD])) {
            throw new Exception(sprintf('Invalid type - must be one of %s, %s or %s', self::TYPE_INTERNAL, self::TYPE_VENDOR, self::TYPE_CLOUD));
        }
        $this->type = $type;
        return $this;
    }
    
    public function getInfo()
    {
        return $this->info;
    }
    
    public function setInfo($info)
    {
        $this->info = $info;
        return $this;
    }
    
    public function getDeployments()
    {
        return $this->deployments->toArray();
    }
    
    public function createDeployment($name, $env = null, $info = null)
    {
        $deployment = new Deployment($this, $name, $env, $info);
        $this->deployments->add($deployment);
        return $deployment;
    }
    
    public function getConnections()
    {
        return $this->connections->toArray();
    }
    
    public function addConnection(AppConnection $connection)
    {
        $this->connections->add($connection);
        return $this;
    }
    
    public function removeConnection(AppConnection $connection)
    {
        $this->connections->removeElement($connection);
        return $this;
    }
    
    public function getInboundConnections()
    {
        return $this->inboundConnections->toArray();
    }
}
