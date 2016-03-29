<?php

namespace AppBundle\Controller;

use AppBundle\Entity\App;
use AppBundle\Entity\Server;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use AppBundle\Form\AppType;
use AppBundle\Form\ServerType;

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
            'data' => $data,
            'templates' => [
                'app' => new \AppBundle\DTO\App(new \AppBundle\Entity\App),
                'server' => new \AppBundle\DTO\Server(new \AppBundle\Entity\Server),
            ]
        ));
    }

    public function singlePageAction()
    {
        return $this->render('single-page.html.twig');
    }

    /**
     * Returns a React representation of the forms
     */
    public function formsAction()
    {
        $forms = [
            'app' => $this->createForm(AppType::class, new App)->createView(),
            'server' => $this->createForm(ServerType::class, new Server)->createView()
        ];
        return $this->render('default/forms.jsx.twig', ['forms' => $forms, 'form'=>$forms['app']]);
    }
}
