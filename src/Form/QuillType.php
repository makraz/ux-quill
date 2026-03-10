<?php

namespace Makraz\QuillBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\Form\FormView;
use Symfony\Component\OptionsResolver\OptionsResolver;

class QuillType extends AbstractType
{
    public function buildView(FormView $view, FormInterface $form, array $options): void
    {
        $quillOptions = $options['quill_options'];

        // Symfony 8 compatibility: callable defaults are no longer auto-resolved
        if (\is_callable($quillOptions)) {
            $extraResolver = new OptionsResolver();
            self::configureQuillOptions($extraResolver);
            $quillOptions($extraResolver);
            $quillOptions = $extraResolver->resolve([]);
        }

        $view->vars['attr']['data-quill-options'] = json_encode($quillOptions);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'label' => false,
            'error_bubbling' => true,
            'quill_options' => static function (OptionsResolver $extraResolver) {
                self::configureQuillOptions($extraResolver);
            },
        ]);

        $resolver->setAllowedTypes('quill_options', ['array', 'callable']);
    }

    private static function configureQuillOptions(OptionsResolver $resolver): void
    {
        $resolver
            ->setDefault('theme', 'snow')
            ->setAllowedValues('theme', ['snow', 'bubble'])
        ;
        $resolver
            ->setDefault('placeholder', 'Start writing...')
            ->setAllowedTypes('placeholder', 'string')
        ;
        $resolver
            ->setDefault('readOnly', false)
            ->setAllowedTypes('readOnly', 'bool')
        ;
        $resolver
            ->setDefault('toolbar', [
                [['header' => [1, 2, 3, false]]],
                ['bold', 'italic', 'underline', 'strike'],
                [['list' => 'ordered'], ['list' => 'bullet']],
                ['blockquote', 'code-block'],
                ['link', 'image'],
                ['clean'],
            ])
            ->setAllowedTypes('toolbar', ['array', 'bool', 'string'])
        ;
        $resolver
            ->setDefault('minHeight', null)
            ->setAllowedTypes('minHeight', ['null', 'int', 'string'])
        ;
    }

    public function getBlockPrefix(): string
    {
        return 'quill';
    }

    public function getParent(): string
    {
        return HiddenType::class;
    }
}
