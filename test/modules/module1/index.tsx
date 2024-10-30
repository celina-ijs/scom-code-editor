import { Module, customModule, Container } from '@ijstech/components';
import { ScomCodeEditor, ScomCodeDiffEditor } from '@scom/scom-code-editor';

@customModule
export default class Module1 extends Module {
    private codeEditor: ScomCodeEditor;
    private codeDiffEditor: ScomCodeDiffEditor;

    constructor(parent?: Container, options?: any) {
        super(parent, options);
    }

    async init() {
        await super.init();
        this.codeEditor.loadContent('<h1>Hi</h1>')
        this.codeDiffEditor.loadContent(0, '<h1>Hello</h1>')
        this.codeDiffEditor.loadContent(1, '<h1>Hi</h1>')
    }


    render() {
        return (
            <i-vstack width="100%" height="100%">
                <i-scom-code-editor
                    id="codeEditor"
                    language='typescript'
                    display='block'
                    height={'50%'}
                ></i-scom-code-editor>
                <i-scom-code-diff-editor
                    id="codeDiffEditor"
                    language='typescript'
                    display='block'
                    height={'50%'}
                ></i-scom-code-diff-editor>
            </i-vstack>
        )
    }
}