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
        this.codeEditor.loadContent(`import "@stdlib/deploy";

        message Add {
            amount: Int as uint32;
        }

        contract SampleTactContract with Deployable {

            owner: Address;
            counter: Int as uint32;

            init(owner: Address) {
                self.owner = owner;
                self.counter = 0;
            }

            fun add(v: Int) {
                
                // Check sender
                let ctx: Context = context();
                require(ctx.sender == self.owner, "Invalid sender");
                
                // Update counter
                self.counter += v;
            }

            receive(msg: Add) {
                self.add(msg.amount);
            }

            receive("increment") {
                self.add(1);
                self.reply("incremented".asComment());
            }

            get fun counter(): Int {
                return self.counter;
            }
        }`);
        this.codeDiffEditor.loadContent(0, '<h1>Hello</h1>')
        this.codeDiffEditor.loadContent(1, '<h1>Hi</h1>')
    }


    render() {
        return (
            <i-vstack width="100%" height="100%">
                <i-scom-code-editor
                    id="codeEditor"
                    language='tact'
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