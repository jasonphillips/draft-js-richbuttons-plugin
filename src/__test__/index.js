import { jsdom } from 'jsdom';
import React from 'react';
import { mount } from 'enzyme';
import { EditorState, ContentState } from 'draft-js';
import DraftPasteProcessor from 'draft-js/lib/DraftPasteProcessor';
import chai from 'chai';
const expect = chai.expect;

import createRichButtonsPlugin from '../index';
import { MAX_LIST_DEPTH, INLINE_STYLES, BLOCK_TYPES } from '../config/types';

process.env.NODE_ENV = 'test';

const exposedProperties = ['window', 'navigator', 'document'];
const blankEvent = {preventDefault: () => null}

global.document = jsdom('');
global.window = document.defaultView;
Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});

// chaiEnzyme needs to be initialised here, so that canUseDOM is set
// to true when react-dom initialises (which chai-enzyme depends upon)
const chaiEnzyme = require('chai-enzyme');
chai.use(chaiEnzyme());

describe('Draft RichButtons Plugin', () => {
  const createEditorStateFromHTML = (html) => {
    const blocks = DraftPasteProcessor.processHTML(html);
    const contentState = ContentState.createFromBlockArray(blocks);
    return EditorState.createWithContent(contentState);
  };

  const getCurrentBlockType = (editorState) => {
    const selection = editorState.getSelection();
    return editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey())
      .getType();
  };

  let richButtonsPlugin;

  describe('style buttons', () => {
    richButtonsPlugin = createRichButtonsPlugin();
    const html = '<p>Some normal text<p>';
    let editorState = createEditorStateFromHTML(html);

    richButtonsPlugin.initialize({
      getEditorState: () => editorState,
      setEditorState: (newState) => {
        editorState = newState;
        return editorState;
      }
    });

    const {
      ItalicButton, BoldButton, MonospaceButton, UnderlineButton,
      createStyleButton,
    } = richButtonsPlugin;

    describe('default buttons', () => {
      // render with refs for iteration
      class ButtonsBar extends React.Component {
        render() {
          return (
            <div>
              <BoldButton ref="Bold"/>
              <ItalicButton ref="Italic"/>
              <MonospaceButton ref="Monospace"/>
              <UnderlineButton ref="Underline"/>
            </div>
          );
        }
      }
      const buttons = mount(<ButtonsBar/>);

      INLINE_STYLES.forEach(({ label, style }) => {
        describe(`${label}Button`, () => {

          it('renders with default labels', () => {
            expect(buttons.ref(label)).to.have.text(label);
          });

          it('toggles current style on and off', () => {
            expect(editorState.getCurrentInlineStyle().has(style)).to.be.false;
            buttons.ref(label).simulate('click');
            expect(editorState.getCurrentInlineStyle().has(style)).to.be.true;
            buttons.ref(label).simulate('click');
            expect(editorState.getCurrentInlineStyle().has(style)).to.be.false;
          });

        });
      });
    })

    describe('custom inline style with createStyleButton()', () => {
      // create a custom inline style button 
      const BarStyleButton = createStyleButton({style: 'bar', label:'Bar'});

      // render with refs for iteration
      class ButtonsBar extends React.Component {
        render() {
          return (
            <div>
              <BarStyleButton ref="BarButton"/>
            </div>
          );
        }
      }
      const buttons = mount(<ButtonsBar/>);

      it('renders with correct label', () => {
        expect(buttons.ref('BarButton')).to.have.text('Bar');
      });

      it('toggles custom inline style on and off', () => {
        expect(editorState.getCurrentInlineStyle().has('bar')).to.be.false;
        buttons.ref('BarButton').simulate('click');
        expect(editorState.getCurrentInlineStyle().has('bar')).to.be.true;
        buttons.ref('BarButton').simulate('click');
        expect(editorState.getCurrentInlineStyle().has('bar')).to.be.false;
      });
    });

    describe('custom buttons', () => {
      // render with refs for iteration
      class CustomButtonsBar extends React.Component {
        render() {
          return (
            <div>
              <BoldButton>
                <div ref="BoldChild"/>
              </BoldButton>
              <ItalicButton>
                <div ref="ItalicChild"/>
              </ItalicButton>
              <MonospaceButton>
                <div ref="MonospaceChild"/>
              </MonospaceButton>
              <UnderlineButton>
                <div ref="UnderlineChild"/>
              </UnderlineButton>
            </div>
          );
        }
      }
      const buttons = mount(<CustomButtonsBar/>);

      INLINE_STYLES.forEach(({ label, style }) => {
        describe(`Custom ${label}Button`, () => {
          const childWithProps = buttons.ref(`${label}Child`);

          it('passes properties to child component', () => {
            expect(childWithProps.prop('label')).to.be.a.string;
            expect(childWithProps.prop('inlineStyle')).to.be.a.string;
            expect(childWithProps.prop('toggleInlineStyle')).to.be.a.function;
          });

          it('toggles isActive prop of child', () => {
            expect(childWithProps.prop('isActive')).to.be.false;

            childWithProps.prop('toggleInlineStyle')(blankEvent);
            expect(editorState.getCurrentInlineStyle().has(style)).to.be.true;
            expect(childWithProps.prop('isActive')).to.be.true;

            childWithProps.prop('toggleInlineStyle')(blankEvent);
            expect(childWithProps.prop('isActive')).to.be.false;
          });

        });
      });
    });
  });

  describe('block buttons', () => {
    richButtonsPlugin = createRichButtonsPlugin();
    const html = '<p>Some normal text<p>';
    let editorState = createEditorStateFromHTML(html);

    richButtonsPlugin.initialize({
      getEditorState: () => editorState,
      setEditorState: (newState) => {
        editorState = newState;
        return editorState;
      }
    });

    const {
      ParagraphButton, BlockquoteButton, CodeButton, OLButton, ULButton,
      H1Button, H2Button, H3Button, H4Button, H5Button, H6Button,
      createBlockButton,
    } = richButtonsPlugin;

    describe('default buttons', () => {
      // render with refs for iteration
      class ButtonsBar extends React.Component {
        render() {
          return (
            <div>
              <ParagraphButton ref="Paragraph"/>
              <BlockquoteButton ref="Blockquote"/>
              <CodeButton ref="Code"/>
              <OLButton ref="OL"/>
              <ULButton ref="UL"/>
              <H1Button ref="H1"/>
              <H2Button ref="H2"/>
              <H3Button ref="H3"/>
              <H4Button ref="H4"/>
              <H5Button ref="H5"/>
              <H6Button ref="H6"/>
            </div>
          );
        }
      }
      const buttons = mount(<ButtonsBar/>);

      BLOCK_TYPES.forEach(({ label, style }) => {
        describe(`${label}Button`, () => {

          it('renders with default labels', () => {
            expect(buttons.ref(label)).to.have.text(label);
          });

          it('toggles current block style on and off', () => {
            if (label=='Paragraph') return;

            expect(getCurrentBlockType(editorState)).to.not.equal(style);
            buttons.ref(label).simulate('click');
            expect(getCurrentBlockType(editorState)).to.equal(style);
            buttons.ref(label).simulate('click');
            expect(getCurrentBlockType(editorState)).to.not.equal(style);
          });
        });
      });
    });

    describe('custom block with createBlockButton()', () => {
      // create a custom block type 
      const FooBlockButton = createBlockButton({type: 'foo', label:'Foo'});

      // render with refs for iteration
      class ButtonsBar extends React.Component {
        render() {
          return (
            <div>
              <FooBlockButton ref="FooButton"/>
            </div>
          );
        }
      }
      const buttons = mount(<ButtonsBar/>);

      it('renders with correct label', () => {
        expect(buttons.ref('FooButton')).to.have.text('Foo');
      });

      it('toggles custom block type on and off', () => {
        expect(getCurrentBlockType(editorState)).to.not.equal('foo');
        buttons.ref('FooButton').simulate('click');
        expect(getCurrentBlockType(editorState)).to.equal('foo');
        buttons.ref('FooButton').simulate('click');
        expect(getCurrentBlockType(editorState)).to.not.equal('foo');
      });
    });

    describe('custom buttons', () => {
      // render with refs for iteration
      class CustomButtonsBar extends React.Component {
        render() {
          return (
            <div>
              <ParagraphButton>
                <div ref="ParagraphChild"/>
              </ParagraphButton>
              <BlockquoteButton>
                <div ref="BlockquoteChild"/>
              </BlockquoteButton>
              <CodeButton>
                <div ref="CodeChild"/>
              </CodeButton>
              <OLButton>
                <div ref="OLChild"/>
              </OLButton>
              <ULButton>
                <div ref="ULChild"/>
              </ULButton>
              <H1Button>
                <div ref="H1Child"/>
              </H1Button>
              <H2Button>
                <div ref="H2Child"/>
              </H2Button>
              <H3Button>
                <div ref="H3Child"/>
              </H3Button>
              <H4Button>
                <div ref="H4Child"/>
              </H4Button>
              <H5Button>
                <div ref="H5Child"/>
              </H5Button>
              <H6Button>
                <div ref="H6Child"/>
              </H6Button>
            </div>
          );
        }
      }
      const buttons = mount(<CustomButtonsBar/>);

      BLOCK_TYPES.forEach(({ label, style }) => {
        describe(`Custom ${label}Button`, () => {
          const childWithProps = buttons.ref(`${label}Child`);

          it('passes properties to child component', () => {
            expect(childWithProps.prop('label')).to.be.a.string;
            expect(childWithProps.prop('blockType')).to.be.a.string;
            expect(childWithProps.prop('toggleBlockType')).to.be.a.function;
          });

          it('toggles isActive prop of child', () => {
            if (label=='Paragraph') return;

            expect(getCurrentBlockType(editorState)).to.not.equal(style);
            expect(childWithProps.prop('isActive')).to.be.false;

            childWithProps.prop('toggleBlockType')();
            expect(getCurrentBlockType(editorState)).to.equal(style);
            expect(childWithProps.prop('isActive')).to.be.true;

            childWithProps.prop('toggleBlockType')();
            expect(getCurrentBlockType(editorState)).to.not.equal(style);
            expect(childWithProps.prop('isActive')).to.be.false;
          });

        });
      });
    });
  });

});
