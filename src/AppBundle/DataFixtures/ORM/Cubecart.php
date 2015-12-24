<?php

namespace AppBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\AbstractFixture;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use AppBundle\Entity\App;
use AppBundle\Entity\AppConnection;
use AppBundle\Entity\Deployment;
use AppBundle\Entity\DeploymentConnection;
use AppBundle\Entity\Server;

class Cubecart extends AbstractFixture implements OrderedFixtureInterface
{
    public function load(ObjectManager $manager)
    {
        // App
        $app = new App('Cubecart', App::TYPE_INTERNAL, 'Obsolete piece of rubbish');
        
        // DB connection
        $dbConnection = new AppConnection('Main DB', $app, $this->getReference('mysql-app'), 'Read-write database connection');
        $app->addConnection($dbConnection);
        $slaveDbConnection = new AppConnection('Reporting DB', $app, $this->getReference('mysql-app'), 'Reporting (read-only) database connection');
        $app->addConnection($slaveDbConnection);
        
        // Deployments
        $internalDeployment = $app->createDeployment('internal', Deployment::ENV_PROD, 'For inside the office');
        $externalDeployment = $app->createDeployment('public', Deployment::ENV_PROD, 'For the outside world');
        
        // Servers
        $web13 = new Server('web13', 'web13.greensmoke.com', '10.2.36.60');
        $manager->persist($web13);
        
        $web16 = new Server('web16', 'web16.greensmoke.com', '10.2.41.17');
        $manager->persist($web16);
        
        $web18 = new Server('web18', 'web18.greensmoke.com', '10.2.41.18');
        $manager->persist($web18);
        
        $internalDeployment->addServer($web13);
        $externalDeployment->addServer($web16)->addServer($web18);
        
        $manager->persist($app);
        
        // Deployment connections
        $masterDepConn = new DeploymentConnection($internalDeployment, $dbConnection, $this->getReference('mysql-master'), 'Database: greensmo_cc');
        $internalDeployment->addConnection($masterDepConn);
        $slaveDepConn = new DeploymentConnection($internalDeployment, $slaveDbConnection, $this->getReference('mysql-slave'), 'Database: greensmo_cc');
        $internalDeployment->addConnection($slaveDepConn);
        
        $extMasterDepConn = new DeploymentConnection($externalDeployment, $dbConnection, $this->getReference('mysql-master'), 'Database: greensmo_cc');
        $externalDeployment->addConnection($extMasterDepConn);
        $extSlaveDepConn = new DeploymentConnection($externalDeployment, $slaveDbConnection, $this->getReference('mysql-slave'), 'Database: greensmo_cc');
        $externalDeployment->addConnection($extSlaveDepConn);

        $manager->flush();
    }
    
    public function getOrder()
    {
        return 10;
    }
}