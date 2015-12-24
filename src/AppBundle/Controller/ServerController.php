<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class ServerController extends Controller
{
    /**
     * @Route("/server/", name="serverList")
     */
    public function indexAction()
    {
        // List all the applications
        $em = $this->getDoctrine()->getManager();
        $servers = $em->getRepository('AppBundle\Entity\Server')->findAll();
        foreach ($servers as &$server) {
            $server = new \AppBundle\DTO\Server($server);
        }
        return $this->render('server/index.html.twig', ['servers' => $servers]);
    }
    
    /**
     * @Route("/server/{serverId}", name="server")
     */
    public function serverAction($serverId)
    {
        // Get the app
        $em = $this->getDoctrine()->getManager();
        $server = $em->find('AppBundle\Entity\Server', $serverId);
        if (!$server) {
            throw $this->createNotFoundException('The server does not exist');
        }
        
        $app = new \AppBundle\DTO\Server($server, ['deployments', 'deployments.app']);
        
        return $this->render('server/server.html.twig', ['server' => $server]);
    }
}
