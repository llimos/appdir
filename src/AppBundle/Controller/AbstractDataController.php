<?php

namespace AppBundle\Controller;

use FOS\RestBundle\Controller\FOSRestController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;

abstract class AbstractDataController extends FOSRestController
{
    protected $type;

    public function cgetAction()
    {
        $type = $this->type;
        $items = $this->get('doctrine')->getManager()->getRepository("AppBundle\\Entity\\$type")->findAll();
        $dtoClass = "\\AppBundle\\DTO\\$type";
        $collection = array_map(function($item) use($dtoClass){return new $dtoClass($item);}, $items);
        $view = $this->view($collection);
        return $this->handleView($view);
    }

    public function getAction($slug)
    {
        $type = $this->type;
        $item = $this->get('doctrine')->getManager()->find("AppBundle\\Entity\\$type", $slug);
        if (!$item) {
            throw $this->createNotFoundException("Resource not found");
        }
        $dtoClass = "\\AppBundle\\DTO\\$type";
        $dto = new $dtoClass($item);
        $view = $this->view($dto);
        return $this->handleView($view);
    }

    public function postAction(Request $request)
    {
        $em = $this->get('doctrine')->getManager();
        $type = $this->getType();
        $object = new $type;
        $form = $this->getForm($object)
            ->handleRequest($request);
        if ($form->isValid()) {
            $em->persist($object);
            $em->flush();
            $view = $this->view($object, 201, [
                'Location' => $this->generateUrl('api_get_'.strtolower($this->type), ['slug' => $object->getId()], true)
            ]);
            return $this->handleView($view);
        }

        return $this->handleView($this->view($form, 400));
    }

    protected function getType()
    {
        return "AppBundle\\Entity\\".$this->type;
    }

    /**
     * @return \Symfony\Component\Form\FormInterface
     */
    protected function getForm($object)
    {
        $formType = "\\AppBundle\\Form\\".$this->type."Type";
        return $this->createForm($formType, $object);
    }
}
