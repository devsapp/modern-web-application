import React, { PureComponent } from "react";
const HeaderElementMap = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
};
class HeaderBlock extends PureComponent {
  static propTypes = {};

  static defaultProps = {
    level: 1,
  };

  renderHtml = () => {
    const { level = 1, children } = this.props;
    if (children[0] && children[0].props && children[0].props.nodeKey) {
      const nodeValue = children[0].props.nodeKey;
      return React.createElement(
        HeaderElementMap[`h${level}`],
        { id: nodeValue },
        children
      );
    } else {
      return React.createElement(
        HeaderElementMap[`h${level}`],
        { id: Date.now() },
        children
      );
    }

  };

  render() {
    return this.renderHtml();
  }
}
export default HeaderBlock;
