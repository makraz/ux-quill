import { Controller } from '@hotwired/stimulus';
import Quill from 'quill';

interface QuillOptions {
    theme?: string;
    placeholder?: string;
    readOnly?: boolean;
    toolbar?: any[] | boolean | string;
    minHeight?: number | string | null;
}

export default class extends Controller {
    declare readonly inputTarget: HTMLInputElement;
    declare readonly editorContainerTarget: HTMLDivElement;
    static targets = ['input', 'editorContainer'];

    declare readonly optionsValue: QuillOptions;
    static values = {
        options: {
            type: Object,
            default: {},
        },
    };

    private quillInstance: Quill | null = null;

    connect() {
        if (this.quillInstance) {
            return;
        }

        const config = this.buildConfig();

        this.dispatchEvent('options', config);

        if (config.minHeight) {
            this.applyMinHeight(config.minHeight);
            delete config.minHeight;
        }

        this.quillInstance = new Quill(this.editorContainerTarget, config);

        // Load initial content
        const rawValue = this.inputTarget.value;
        if (rawValue) {
            this.quillInstance.root.innerHTML = rawValue;
        }

        // Sync changes back to hidden input
        this.quillInstance.on('text-change', () => {
            this.syncData();
        });

        this.dispatchEvent('connect', this.quillInstance);
    }

    disconnect() {
        this.quillInstance = null;
    }

    private buildConfig(): any {
        const { theme, placeholder, readOnly, toolbar, minHeight } = this.optionsValue;

        const config: any = {
            theme: theme ?? 'snow',
            placeholder: placeholder ?? 'Start writing...',
            readOnly: readOnly ?? false,
            modules: {
                toolbar: toolbar ?? [
                    [{ header: [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    ['blockquote', 'code-block'],
                    ['link', 'image'],
                    ['clean'],
                ],
            },
        };

        if (minHeight) {
            config.minHeight = minHeight;
        }

        return config;
    }

    private toCssValue(value: number | string): string {
        return typeof value === 'number' ? `${value}px` : value;
    }

    private applyMinHeight(minHeight: number | string): void {
        const val = this.toCssValue(minHeight);
        const style = document.createElement('style');
        const scopeId = `quill-${Math.random().toString(36).slice(2, 9)}`;
        this.editorContainerTarget.setAttribute('data-quill-scope', scopeId);
        style.textContent = `[data-quill-scope="${scopeId}"] .ql-editor { min-height: ${val}; }`;
        this.editorContainerTarget.appendChild(style);
    }

    private syncData(): void {
        if (!this.quillInstance) {
            return;
        }

        const html = this.quillInstance.root.innerHTML;
        // Quill sets innerHTML to '<p><br></p>' when empty
        this.inputTarget.value = html === '<p><br></p>' ? '' : html;

        this.inputTarget.dispatchEvent(new Event('input', { bubbles: true }));
        this.inputTarget.dispatchEvent(new Event('change', { bubbles: true }));

        this.dispatchEvent('change', { html });
    }

    private dispatchEvent(name: string, payload: any = {}) {
        this.dispatch(name, { detail: payload, prefix: 'quill' });
    }
}
