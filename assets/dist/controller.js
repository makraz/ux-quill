import { Controller } from '@hotwired/stimulus';
import Quill from 'quill';
export default class extends Controller {
  static targets = ['input', 'editorContainer'];
  static values = {
    options: {
      type: Object,
      default: {}
    }
  };
  quillInstance = null;
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
    const rawValue = this.inputTarget.value;
    if (rawValue) {
      this.quillInstance.root.innerHTML = rawValue;
    }
    this.quillInstance.on('text-change', () => {
      this.syncData();
    });
    this.dispatchEvent('connect', this.quillInstance);
  }
  disconnect() {
    this.quillInstance = null;
  }
  buildConfig() {
    const {
      theme,
      placeholder,
      readOnly,
      toolbar,
      minHeight
    } = this.optionsValue;
    const config = {
      theme: theme ?? 'snow',
      placeholder: placeholder ?? 'Start writing...',
      readOnly: readOnly ?? false,
      modules: {
        toolbar: toolbar ?? [[{
          header: [1, 2, 3, false]
        }], ['bold', 'italic', 'underline', 'strike'], [{
          list: 'ordered'
        }, {
          list: 'bullet'
        }], ['blockquote', 'code-block'], ['link', 'image'], ['clean']]
      }
    };
    if (minHeight) {
      config.minHeight = minHeight;
    }
    return config;
  }
  toCssValue(value) {
    return typeof value === 'number' ? `${value}px` : value;
  }
  applyMinHeight(minHeight) {
    const val = this.toCssValue(minHeight);
    const style = document.createElement('style');
    const scopeId = `quill-${Math.random().toString(36).slice(2, 9)}`;
    this.editorContainerTarget.setAttribute('data-quill-scope', scopeId);
    style.textContent = `[data-quill-scope="${scopeId}"] .ql-editor { min-height: ${val}; }`;
    this.editorContainerTarget.appendChild(style);
  }
  syncData() {
    if (!this.quillInstance) {
      return;
    }
    const html = this.quillInstance.root.innerHTML;
    this.inputTarget.value = html === '<p><br></p>' ? '' : html;
    this.inputTarget.dispatchEvent(new Event('input', {
      bubbles: true
    }));
    this.inputTarget.dispatchEvent(new Event('change', {
      bubbles: true
    }));
    this.dispatchEvent('change', {
      html
    });
  }
  dispatchEvent(name, payload = {}) {
    this.dispatch(name, {
      detail: payload,
      prefix: 'quill'
    });
  }
}
