<?php

use Makraz\QuillBundle\Form\QuillType;
use Symfony\Component\DependencyInjection\Loader\Configurator\ContainerConfigurator;

return static function (ContainerConfigurator $container): void {
    $container->services()
        ->set('form.ux_quill', QuillType::class)
            ->tag('form.type')
    ;
};
