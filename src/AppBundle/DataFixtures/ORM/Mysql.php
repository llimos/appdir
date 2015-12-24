<?php

namespace AppBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\AbstractFixture;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use AppBundle\Entity\App;
use AppBundle\Entity\Deployment;
use AppBundle\Entity\Server;

class Mysql extends AbstractFixture implements OrderedFixtureInterface
{
    public function load(ObjectManager $manager)
    {
        // App
        $app = new App('MySQL', App::TYPE_VENDOR, 'Database');
        $manager->persist($app);
        $this->addReference('mysql-app', $app);
        
        // Deployments
        $masterDeployment = $app->createDeployment('Master Ecommerce', Deployment::ENV_PROD, 'Main database for all Ecommerce apps');
        $slaveDeployment = $app->createDeployment('Slave Ecommerce', Deployment::ENV_PROD, 'Reporting database for all Ecommerce apps');
        
        // Servers
        $proddb2 = new Server('master db', 'prod-db2.greensmoke.com', '10.2.36.33');
        $manager->persist($proddb2);
        $masterDeployment->addServer($proddb2);
        $this->addReference('mysql-master', $masterDeployment);
        
        $proddb1 = new Server('slave db', 'prod-db1.greensmoke.com', '10.2.36.32');
        $manager->persist($proddb1);
        $masterDeployment->addServer($proddb1);
        $this->addReference('mysql-slave', $slaveDeployment);

        $manager->flush();
    }
    
    public function getOrder()
    {
        return 1;
    }
}