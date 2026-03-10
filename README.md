# Quill Bundle for Symfony using Symfony UX

Symfony UX Bundle implementing [Quill](https://quilljs.com/) — a modern WYSIWYG rich text editor that outputs clean HTML.

Also working out of the box with EasyAdmin.

If you need a lightweight rich text editor (with no complex configuration) in a Symfony project, this is what you need.

* [Installation](#installation)
* [Basic Usage](#basic-usage)
* [Toolbar Configuration](#toolbar-configuration)
* [Themes](#themes)
* [Editor Options](#editor-options)
* [EasyAdmin Integration](#easyadmin-integration)
* [Data Format](#data-format)
* [JavaScript Events](#javascript-events)

## Installation

### Step 1: Require the bundle

```sh
composer require makraz/ux-quill
```

If you are using the **AssetMapper** component, install the Quill package:

```sh
php bin/console importmap:require quill
```

### Step 2: JavaScript dependencies (Webpack Encore only)

If you are using **Webpack Encore** (skip this step if using AssetMapper):

```sh
yarn install --force && yarn watch
```

Or with npm:

```sh
npm install --force && npm run watch
```

That's it. You can now use `QuillType` in your Symfony forms.

## Basic Usage

In a form, use `QuillType`. It works like a classic form type with additional options:

```php
use Makraz\QuillBundle\Form\QuillType;

public function buildForm(FormBuilderInterface $builder, array $options): void
{
    $builder
        ->add('content', QuillType::class)
    ;
}
```

By default, the editor comes with a toolbar including headers, bold, italic, underline, strike, lists, blockquote, code block, link, image, and a clean button.

You can add as many Quill fields on a single page as you need, just like any normal form field.

## Toolbar Configuration

The toolbar is configured as a nested array where each sub-array represents a button group:

```php
$builder->add('content', QuillType::class, [
    'quill_options' => [
        'toolbar' => [
            [['header' => [1, 2, 3, false]]],
            ['bold', 'italic', 'underline', 'strike'],
            [['list' => 'ordered'], ['list' => 'bullet']],
            ['blockquote', 'code-block'],
            [['color' => []], ['background' => []]],
            [['align' => []]],
            ['link', 'image', 'video'],
            ['clean'],
        ],
    ],
]);
```

### Available Toolbar Formats

**Inline formats:**

| Format | Description |
|--------|-------------|
| `'bold'` | Bold text |
| `'italic'` | Italic text |
| `'underline'` | Underlined text |
| `'strike'` | Strikethrough text |
| `['color' => []]` | Text color picker |
| `['background' => []]` | Background color picker |
| `['font' => []]` | Font family selector |
| `['size' => ['small', false, 'large', 'huge']]` | Font size selector |
| `'link'` | Hyperlink |
| `'code'` | Inline code |

**Block formats:**

| Format | Description |
|--------|-------------|
| `['header' => 1]` | Heading level 1 button |
| `['header' => 2]` | Heading level 2 button |
| `['header' => [1, 2, 3, false]]` | Heading dropdown |
| `'blockquote'` | Blockquote |
| `'code-block'` | Code block |
| `['list' => 'ordered']` | Ordered list |
| `['list' => 'bullet']` | Bullet list |
| `['indent' => '-1']` | Decrease indent |
| `['indent' => '+1']` | Increase indent |
| `['align' => []]` | Text alignment dropdown |
| `['direction' => 'rtl']` | Text direction (RTL) |

**Embeds:**

| Format | Description |
|--------|-------------|
| `'image'` | Image embed |
| `'video'` | Video embed |
| `'formula'` | Formula (requires KaTeX) |

**Utility:**

| Format | Description |
|--------|-------------|
| `'clean'` | Remove all formatting |

### Toolbar Presets

**Minimal toolbar:**

```php
'toolbar' => [
    ['bold', 'italic', 'underline'],
    ['link'],
    ['clean'],
],
```

**Full toolbar:**

```php
'toolbar' => [
    [['header' => [1, 2, 3, 4, 5, 6, false]]],
    ['bold', 'italic', 'underline', 'strike'],
    [['color' => []], ['background' => []]],
    [['list' => 'ordered'], ['list' => 'bullet']],
    [['indent' => '-1'], ['indent' => '+1']],
    [['align' => []]],
    ['blockquote', 'code-block'],
    ['link', 'image', 'video'],
    ['clean'],
],
```

**Disable toolbar entirely:**

```php
'toolbar' => false,
```

## Themes

Quill comes with two built-in themes:

### Snow (default)

A traditional toolbar-based theme. The toolbar sits above the content area.

```php
$builder->add('content', QuillType::class, [
    'quill_options' => [
        'theme' => 'snow',
    ],
]);
```

### Bubble

A tooltip-based theme. The formatting toolbar appears as a floating bubble when text is selected.

```php
$builder->add('content', QuillType::class, [
    'quill_options' => [
        'theme' => 'bubble',
    ],
]);
```

## Editor Options

Use the `quill_options` parameter to configure global editor behavior:

```php
$builder->add('content', QuillType::class, [
    'quill_options' => [
        'theme' => 'snow',
        'placeholder' => 'Start writing your article...',
        'readOnly' => false,
        'minHeight' => 300,
        'toolbar' => [
            [['header' => [1, 2, 3, false]]],
            ['bold', 'italic', 'underline'],
            [['list' => 'ordered'], ['list' => 'bullet']],
            ['link', 'image'],
            ['clean'],
        ],
    ],
]);
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `theme` | `string` | `'snow'` | Editor theme: `'snow'` (toolbar) or `'bubble'` (tooltip) |
| `placeholder` | `string` | `'Start writing...'` | Placeholder text shown in an empty editor |
| `readOnly` | `bool` | `false` | Set the editor to read-only mode |
| `toolbar` | `array\|bool\|string` | *(default toolbar)* | Toolbar configuration — array of button groups, `false` to disable, or a CSS selector string for a custom toolbar element |
| `minHeight` | `int\|string\|null` | `null` | Minimum height of the editor — integer for pixels, string for CSS values (e.g. `'20rem'`, `'50vh'`) |

## EasyAdmin Integration

The bundle provides a dedicated `QuillAdminField` for seamless EasyAdmin integration:

```php
use Makraz\QuillBundle\Form\QuillAdminField;

public function configureFields(string $pageName): iterable
{
    yield QuillAdminField::new('content');
}
```

To customize the options, use `setFormTypeOptions`:

```php
yield QuillAdminField::new('content')
    ->setFormTypeOptions([
        'quill_options' => [
            'theme' => 'snow',
            'placeholder' => 'Write your content here...',
            'minHeight' => 400,
            'toolbar' => [
                [['header' => [1, 2, 3, false]]],
                ['bold', 'italic', 'underline', 'strike'],
                [['list' => 'ordered'], ['list' => 'bullet']],
                ['blockquote', 'code-block'],
                ['link', 'image'],
                ['clean'],
            ],
        ],
    ])
;
```

The field automatically registers the Twig form theme and works with both AssetMapper and Webpack Encore.

## Data Format

Quill outputs HTML. The value stored in your entity will be an HTML string:

```html
<h2>Hello World</h2>
<p>This is a paragraph with <strong>bold</strong> and <em>italic</em> text.</p>
<ul>
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
</ul>
```

When the editor is empty, the stored value is an empty string (the Stimulus controller normalizes Quill's default `<p><br></p>` to `''`).

### Rendering in Twig

To display Quill content in your templates, render the HTML directly:

```twig
{{ myEntity.content|raw }}
```

Since Quill outputs standard HTML, no parsing or conversion is needed.

## JavaScript Events

The Stimulus controller dispatches events you can listen to for custom behavior:

```javascript
// Fired before the editor initializes — modify config here
document.addEventListener('quill:options', (event) => {
    const config = event.detail;
    // Add custom modules, modify toolbar, etc.
    config.modules.history = { maxStack: 100 };
});

// Fired when the editor is ready
document.addEventListener('quill:connect', (event) => {
    const quillInstance = event.detail;
    console.log('Quill is ready!', quillInstance);
});

// Fired on every content change
document.addEventListener('quill:change', (event) => {
    const { html } = event.detail;
    console.log('Content changed:', html);
});
```

| Event | Detail | Description |
|-------|--------|-------------|
| `quill:options` | `QuillConfig` | Dispatched before initialization. Modify the config object to add modules or change settings. |
| `quill:connect` | `Quill` | Dispatched when the editor is fully initialized and ready. |
| `quill:change` | `{ html: string }` | Dispatched whenever the editor content changes. |

## Symfony Live Component Compatibility

The editor is wrapped in a `data-live-ignore` container, so it works correctly with Symfony Live Components without being destroyed on re-render.

## Requirements

- PHP >= 8.1
- Symfony 6.4, 7.x, or 8.x
- `symfony/stimulus-bundle` >= 2.9.1

## License

MIT
