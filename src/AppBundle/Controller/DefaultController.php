<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class DefaultController extends Controller
{
    public function dataAction()
    {
        $em = $this->get('doctrine')->getManager();
        
        $types = ['Server', 'App', 'AppConnection', 'Deployment', 'DeploymentConnection'];
        $data = [];
        foreach ($types as $type) {
            $items = $em->getRepository("AppBundle\\Entity\\$type")->findAll();
            $dtoClass = "\\AppBundle\\DTO\\$type";
            $collection = [];
            foreach ($items as $item) {
                $collection[$item->getId()] = new $dtoClass($item);
            }
            $data[lcfirst($type)] = $collection;
        }
        
        // Render the template (which has extra JS to map the objects)
        return $this->render('default/data.js.twig', array(
            'data' => $data
        ));
    }
    
    /**
     * @Route("/{url}", name="singlePage", defaults={"url"="index"}, requirements={"url"=".+"}) Match everything
     */
    public function singlePageAction()
    {
        return $this->render('single-page.html.twig');
    }
}
