import React, { Component } from 'react';
import PropTypes from 'prop-types';

class BlockButton extends Component {

  static propTypes = {
    store: PropTypes.object,
    bindToState: PropTypes.func,
    label: PropTypes.string,
    blockType: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.componentWillMount = this.componentWillMount.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);
  }

  // register with store updates to ensure rerender
  componentWillMount() {
    this.props.bindToState(this);
  }

  componentWillUnmount() {
    this.props.bindToState(this, true);
  }

  render() {
    const { store, blockType, label, children } = this.props;
    const toggleBlockType = store.toggleBlockType.bind(store, blockType);
    let isActive = undefined;

    if (store.getEditorState) {
      const editorState = store.getEditorState();
      const selection = editorState.getSelection();
      const currentType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();
      isActive = currentType == blockType;
    } else {
      // editor not yet available / initialized
      isActive = false;
    }

    if (children && typeof children == 'object') {
      const ChildInput = React.cloneElement(children, {
        toggleBlockType,
        isActive,
        label,
        blockType
      });

      return ChildInput;
    }

    const spanStyle = {
      color: isActive ? '#900' : '#999',
      cursor: 'pointer',
      display: 'inline-block',
      marginRight: '1em'
    }

    return (
      <span onClick={ toggleBlockType } style={spanStyle}>
        { label }
      </span>
    );
  }
}

export default BlockButton;
