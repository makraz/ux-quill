<?php

namespace Makraz\QuillBundle\Tests;

use Makraz\QuillBundle\QuillBundle;
use PHPUnit\Framework\TestCase;

class QuillBundleTest extends TestCase
{
    public function testGetPath(): void
    {
        $bundle = new QuillBundle();

        $this->assertSame(\dirname(__DIR__), $bundle->getPath());
    }
}
