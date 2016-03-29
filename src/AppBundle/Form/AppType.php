<?php

namespace AppBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type;
use AppBundle\Entity\App as Entity;

class AppType extends AbstractType
{
    /**
     * @param FormBuilderInterface $builder
     * @param array $options
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('id', Type\HiddenType::class)
            ->add('name', Type\TextType::class)
            ->add('type', Type\ChoiceType::class, [
                'choices' => [
                    'Internal' => Entity::TYPE_INTERNAL,
                    'Vendor'   => Entity::TYPE_VENDOR,
                    'Cloud'    => Entity::TYPE_CLOUD
                ]
            ])
            ->add('info', Type\TextType::class)
        ;
    }
    
    /**
     * @param OptionsResolver $resolver
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => Entity::class,
            'csrf_protection' => false
        ));
    }
}
