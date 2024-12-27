import { Control, customElements, ControlElement } from "@ijstech/components";
import { addLib, addFile, getFileModel, updateFile, LanguageType, initMonaco, Monaco } from "./monaco";
import * as IMonaco from "./editor.api";
import "./index.css";
import { ThemeType } from "./interface";

type onChangeCallback = (target: ScomCodeEditor, event: Event) => void;
type onKeyEventCallback = (target: ScomCodeEditor, event: KeyboardEvent) => void;

export interface ScomCodeEditorElement extends ControlElement {
  theme?: ThemeType;
  language?: LanguageType;
  onChange?: onChangeCallback;
  onKeyDown?: onKeyEventCallback;
  onKeyUp?: onKeyEventCallback;
  onAddAction?: (editor: IMonaco.editor.IStandaloneCodeEditor) => void;
};
declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["i-scom-code-editor"]: ScomCodeEditorElement;
    }
  }
};

@customElements('i-scom-code-editor')
export class ScomCodeEditor extends Control {
  private _editor: IMonaco.editor.IStandaloneCodeEditor;
  private _language: LanguageType;
  private _fileName: string;
  private _value: string;
  private _theme: ThemeType;
  private _options: IMonaco.editor.IEditorOptions;
  public onChange: onChangeCallback;
  public onKeyDown: onKeyEventCallback;
  public onKeyUp: onKeyEventCallback;
  public onAddAction: (editor: IMonaco.editor.IStandaloneCodeEditor) => void;

  public static addLib = addLib;
  public static addFile = addFile;
  public static getFileModel = getFileModel;
  public static updateFile = updateFile;

  get monaco(): Monaco {
    return (window as any).monaco as Monaco; ``
  }

  get editor(): IMonaco.editor.IStandaloneCodeEditor {
    return this._editor;
  };

  get value(): string {
    if (this._editor)
      return this._editor.getValue()
    else
      return this._value;
  };
  set value(value: string) {
    this._value = value;
    if (this._editor) {
      this._editor.setValue(value);
      this._editor.setScrollTop(0);
    }
    else
      this.loadContent();
  };

  get language(): LanguageType {
    return this._language;
  };
  set language(value: LanguageType) {
    this._language = value;
    if (!this.editor) {
      this.loadContent();
    }
    else {
      const model = this.editor.getModel();
      if (model) {
        this.monaco.editor.setModelLanguage(model, value);
      }
    }
  };

  get designMode() {
    return this._designMode;
  }
  set designMode(value: boolean) {
    this._designMode = value;
    if (this.editor)
      this.editor.updateOptions({ ...this.editor.getOptions(), readOnly: value });
  }

  get theme() {
    return this._theme || 'dark';
  }
  set theme(value: ThemeType) {
    this._theme = value || 'dark';
    const themeVal = value === 'light' ? 'vs' : 'vs-dark';
    this.monaco?.editor?.setTheme(themeVal);
  }

  async init() {
    super.init();
    const language = this.getAttribute("language", true);
    if (language) this.language = language;
    const theme = this.getAttribute("theme", true);
    if (theme) this.theme = theme;
    this.style.display = "inline-block";
    if (this.language)
      await this.loadContent(undefined, this.language);
  };

  focus(): void {
    this._editor.focus();
  };

  setCursor(line: number, column: number) {
    this.editor.setPosition({ lineNumber: line, column: column });
  };

  getErrors() {
    const markers = this.monaco.editor.getModelMarkers({ resource: this._editor.getModel()?.uri });
    return markers.filter((marker) => marker.severity === this.monaco.MarkerSeverity.Error);
  }

  async loadContent(content?: string, language?: LanguageType, fileName?: string) {
    const monaco = await initMonaco();

    if (content == undefined)
      content = content || this._value || '';
    this._value = content;
    language = language || this._language || 'typescript';
    this._language = language;

    if (!this._editor) {
      const captionDiv = this.createElement("div", this);
      captionDiv.style.display = "inline-block";
      captionDiv.style.height = "100%";
      captionDiv.style.width = "100%";
      const customOptions = this._options || {};
      let options: IMonaco.editor.IStandaloneEditorConstructionOptions = {
        theme: this.theme === 'light' ? 'vs' : 'vs-dark',
        tabSize: 2,
        autoIndent: 'advanced',
        formatOnPaste: true,
        formatOnType: true,
        renderWhitespace: "none",
        automaticLayout: true,
        readOnly: this._designMode,
        minimap: {
          enabled: false
        },
        ...customOptions
      };
      this._editor = monaco.editor.create(captionDiv, options);
      if (typeof this.onAddAction === 'function') {
        this.onAddAction(this._editor);
      }
      this._editor.onDidChangeModelContent((event: any) => {
        if (typeof this.onChange === 'function')
          this.onChange(this, event);
      });
      this._editor.onKeyDown((event: any) => {
        if (typeof this.onKeyDown === 'function') {
          this.onKeyDown(this, event);
        }
      });
      this._editor.onKeyUp((event: any) => {
        if (typeof this.onKeyUp === 'function') {
          this.onKeyUp(this, event);
        }
      });
      this._editor.onMouseDown((event: any) => {
        if (typeof this.onMouseDown === 'function') {
          this.onMouseDown(this, event);
        }
      });
      this._editor.onContextMenu((event: any) => {
        if (typeof this.onContextMenu === 'function') {
          this.onContextMenu(this._editor as any, event);
        }
      });
      if (fileName) {
        let model = await getFileModel(fileName);
        if (model) {
          this._editor.setModel(model);
          model.setValue(content);
          return;
        }
      };
      if (language == 'typescript' || fileName?.endsWith('.tsx') || fileName?.endsWith('.ts')) {
        let model = monaco.editor.createModel(content || this._value || '', "typescript", fileName ? monaco.Uri.file(fileName) : undefined);
        this._editor.setModel(model);
      }
      else {
        let model = monaco.editor.createModel(content || this._value || '', language || this._language, fileName ? monaco.Uri.file(fileName) : undefined);
        this._editor.setModel(model);
      };
    }
    else {
      let model = this._editor.getModel();
      if (language == 'typescript' && model && fileName && this._fileName != fileName) {
        if (!this._fileName)
          model.dispose();
        model = await getFileModel(fileName);
        if (!model) {
          model = monaco.editor.createModel(content || this._value || '', "typescript", monaco.Uri.file(fileName));
        }
        this._editor.setModel(model);
        this._editor.setValue(content);
      }
      else {
        this._editor.setValue(content);
        if (language && model)
          monaco.editor.setModelLanguage(model, language);
      };
    };
    this._fileName = fileName || '';
    this._editor.setScrollTop(0);
  };

  saveViewState() {
    if (this._editor) {
      return this._editor.saveViewState();
    }
  }

  restoreViewState(state: IMonaco.editor.ICodeEditorViewState) {
    if (this._editor && state) {
      this._editor.restoreViewState(state);
    }
  }

  async updateFileName(oldValue: string, newValue: string) {
    let oldModel = await getFileModel(oldValue);
    if (oldModel) {
      if (!oldModel) {
        console.error('Model not found');
        return;
      }
      let newModel = await getFileModel(newValue);
      const newUri = this.monaco.Uri.parse(newValue);
      if (!newModel) newModel = this.monaco.editor.createModel(oldModel.getValue(), oldModel.getLanguageId(), newUri);
      newModel.setValue(oldModel.getValue());
      this.editor.setModel(newModel);
      oldModel.dispose();
    }
  }

  dispose() {
    if (this._editor) {
      this._editor.getModel()?.dispose();
    }
  }

  disposeEditor() {
    if (this._editor) {
      this._editor.getModel()?.dispose();
      this._editor.dispose();
      const domNode = this._editor.getDomNode();
      if (domNode) {
        if (this.contains(domNode)) this.removeChild(domNode);
        domNode.remove();
      }
    }
  }

  scrollToLine(line: number, column: number) {
    const topOffset = this._editor.getTopForPosition(line, column);
    this._editor.setScrollTop(topOffset);
  }

  async loadFile(fileName: string) {
    let model = await getFileModel(fileName);
    if (model) {
      if (!this._fileName)
        this._editor.getModel()?.dispose();
      this._fileName = fileName;
      this._editor.setModel(model);
    };
  };

  updateOptions(options: IMonaco.editor.IEditorOptions) {
    this._options = options;
    if (this._editor)
      this._editor.updateOptions(options);
  };
};