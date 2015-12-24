<?php

namespace AppBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 */
class Server
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue
     */
    protected $id;
    
    /** @ORM\Column(type="string", nullable=false) */
    protected $name;
    
    /** @ORM\Column(type="string") */
    protected $ip;
    
    /** @ORM\Column(type="string", nullable=true) */
    protected $info;
    
    /**
     * @var Doctrine\Common\Collections\Collection
     * @ORM\ManyToMany(targetEntity="Deployment", mappedBy="servers")
     */
    protected $deployments;
    
    public function __construct($name, $hostname = null, $ip = null, $info = null)
    {
        $this->name = $name;
        $this->hostname = $hostname;
        $this->ip = $ip;
        $this->info = $info;
        $this->deployments = new ArrayCollection;
    }
    
    public function getId()
    {
        return $this->id;
    }
    
    public function getName()
    {
        return $this->name;
    }
    
    public function getIp()
    {
        return $this->ip;
    }
    
    public function getInfo()
    {
        return $this->info;
    }
    
    public function getDeployments()
    {
        return $this->deployments->toArray();
    }
    
}