import React from "react";
import MonacoEditor from "react-monaco-editor";

export default class Editor extends React.Component {

  componentDidMount = () => {
    this.currentCode = this.props.code;
    this.saveHandlder = (e) => {
      let keyCode = e.keyCode || e.which || e.charCode;
      let ctrlKey = e.ctrlKey || e.metaKey;
      if (ctrlKey && keyCode === 83) {

        const { setConfigValue } = this.props;
        setConfigValue && setConfigValue(this.currentCode);
        e.preventDefault();
        return false;
      }
    }
    window.addEventListener(
      'keydown',
      this.saveHandlder,
      false
    );
  }
  componentWillUnmount = () => {
    window.removeEventListener('keydown', this.saveHandlder);
  }

  editorDidMount = (editor, monaco) => {
    const { code, language } = this.props;
    if (language === 'json') {
      try {
        const modelUri = monaco.Uri.parse("json://grid/settings.json");
        const jsonModel = monaco.editor.createModel(code, "json", modelUri);
        monaco.editor.setModelLanguage(jsonModel, 'json');
      } catch (e) { }
    }
    editor.getModel().updateOptions({
      tabSize: 2, 
      selectOnLineNumbers: true,
      wordWrap: "wordWrapColumn",
      wordWrapColumn: 60,
      wordWrapMinified: true,
      wrappingIndent: "indent",
      lineNumbers: "off",
      scrollBeyondLastLine: false
    });
    editor.focus();
  };

  onChange = (newValue, e) => {
    this.currentCode = newValue;
    // this.timmer && clearTimeout(this.timmer);
    // this.timmer = setTimeout(() => {
    //   const { setConfigValue } = this.props;
    //   setConfigValue && setConfigValue(newValue);
    // }, 500);
  };

  render() {
    const { code, language = "yaml", height, defaultValue, width = '100%' } = this.props;
    const options = {

    };
    return (
      <MonacoEditor
        height={height}
        width={width}
        language={language}
        theme="vs-dark"
        value={code}
        defaultValue={defaultValue}
        options={options}
        onChange={this.onChange}
        editorDidMount={this.editorDidMount}
      />
    );
  }
}
