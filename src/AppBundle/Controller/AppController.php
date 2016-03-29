<?php

namespace AppBundle\Controller;

use FOS\RestBundle\Controller\Annotations\RouteResource;
use Symfony\Component\Form\Extension\Core\Type;
use Symfony\Component\HttpFoundation\Request;

/**
 * Class AppController
 * @package AppBundle\Controller
 * @RouteResource("App", pluralize=false)
 */
class AppController extends AbstractDataController
{
    protected $type = 'App';
}
