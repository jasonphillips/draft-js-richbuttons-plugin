import StyleButton from './StyleButton';
import BlockButton from './BlockButton';
import { RichUtils, EditorState } from 'draft-js';
import { MAX_LIST_DEPTH, INLINE_STYLES, BLOCK_TYPES } from './config/types';

import decorateComponentWithProps from 'decorate-component-with-props';

const richButtonsPlugin = () => {
  const store = {
    getEditorState: undefined,
    setEditorState: undefined,
    currentState: undefined,

    onChange: function onChange(newState) {
      if (newState!==this.currentState) {
        this.currentState = newState;
        this.notifyBound();
      }
      return newState;
    },

    // buttons must be subscribed explicitly to ensure rerender
    boundComponents: [],
    bindToState: function bindToState(component, remove) {
      if (remove) {
        this.boundComponents = this.boundComponents.filter((registered) =>
          registered!==component
        );
      } else {
        this.boundComponents.push(component);
      }
    },
    notifyBound: function notifyBound() {
      this.boundComponents.forEach((component) => component.forceUpdate());
    },

    toggleInlineStyle: function toggleInlineStyle(inlineStyle) {
      const state = this.getEditorState();
      const newState = RichUtils.toggleInlineStyle(
        state,
        inlineStyle
      );
      this.setEditorState(
        newState
      );
    },

    toggleBlockType: function toggleBlockType(blockType) {
      const state = this.getEditorState();
      const newState = RichUtils.toggleBlockType(
        state,
        blockType
      );
      this.setEditorState(
        EditorState.forceSelection(
          newState, newState.getCurrentContent().getSelectionAfter()
        )
      );
    }
  };

  const configured = {
    initialize: ({ getEditorState, setEditorState }) => {
      store.currentState = getEditorState();
      store.getEditorState = () => store.currentState;
      store.setEditorState = (newState) => {
        store.onChange(newState);
        setEditorState(newState);
      };
    },

    handleKeyCommand: (editorState, command) => {
      return RichUtils.handleKeyCommand(editorState, command);
    },

    onTab: (event, editor) => {
      return RichUtils.onTab(event, editor.getEditorState(), MAX_LIST_DEPTH);
    },

    onChange: (newState) => store.onChange(newState)
  };

  INLINE_STYLES.forEach((inlineStyle) => {
    configured[`${inlineStyle.label}Button`] = decorateComponentWithProps(
      StyleButton, {
        store,
        bindToState: store.bindToState.bind(store),
        label: inlineStyle.label,
        inlineStyle: inlineStyle.style
      }
    );
  });

  BLOCK_TYPES.forEach((blockType) => {
    configured[`${blockType.label}Button`] = decorateComponentWithProps(
      BlockButton, {
        store,
        bindToState: store.bindToState.bind(store),
        label: blockType.label,
        blockType: blockType.style
      }
    );
  });

  configured.createBlockButton = ({type, label}) => decorateComponentWithProps(
    BlockButton, {
      store,
      bindToState: store.bindToState.bind(store),
      label: label,
      blockType: type
    }
  );

  configured.createStyleButton = ({style, label}) => decorateComponentWithProps(
    StyleButton, {
      store,
      bindToState: store.bindToState.bind(store),
      label: label,
      inlineStyle: style
    }
  );

  return configured;
};

export default richButtonsPlugin;
