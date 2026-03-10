<?php

namespace Makraz\QuillBundle;

use Symfony\Component\HttpKernel\Bundle\Bundle;

class QuillBundle extends Bundle
{
    public function getPath(): string
    {
        return \dirname(__DIR__);
    }
}
