<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class AppController extends Controller
{
    /**
     * @Route("/app/", name="appList")
     */
    public function indexAction()
    {
        // List all the applications
        $em = $this->getDoctrine()->getManager();
        $apps = $em->getRepository('AppBundle\Entity\App')->findAll();
        foreach ($apps as &$app) {
            $app = new \AppBundle\DTO\App($app);
        }
        return $this->render('app/index.html.twig', ['apps' => $apps]);
    }
    
    /**
     * @Route("/app/{appId}", name="app")
     */
    public function appAction($appId)
    {
        // Get the app
        $em = $this->getDoctrine()->getManager();
        $app = $em->find('AppBundle\Entity\App', $appId);
        if (!$app) {
            throw $this->createNotFoundException('The app does not exist');
        }
        
        $app = new \AppBundle\DTO\App($app, ['deployments', 'deployments.servers', 'deployments.app', 'connections', 'inbound_connections']);
        
        return $this->render('app/app.html.twig', ['app' => $app]);
    }
}
