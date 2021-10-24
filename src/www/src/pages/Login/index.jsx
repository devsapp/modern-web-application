import React from "react";
import "./index.scss";
import { Link } from "react-router-dom";
import { Form, Input, Button, Message } from "@b-design/ui";
import img from "../../assets/slogo.png";
import Translation from "../../components/Translation";
import SwitchLanguage from "./switch-button/index";
import { withTranslation } from "react-i18next";
import { bindKeydown, unbindKeydown } from "../../utils/common";
const FormItem = Form.Item;

class LoginCmp extends React.Component {
  handleSubmit = (values) => {
    console.log("Get form value:", values);
  };
  constructor(props) {
    super(props);
    this.state = {
      isLogin: true,
      userName: "",
      passWord: "",
      email: "",
    };
  }
  componentDidMount() {
    // this.input.focus();
    bindKeydown(async () => {
      this.login();
    });
  }

  componentWillUnmount() {
    unbindKeydown();
  }

  hasBeenLogin = async () => {

  };

  toSign = () => {
    this.props.history.push("/register");
  };

  login = async () => {

  };

  processResult = (result) => {
    const { status, data } = result;
    if (status === 200) {
      let isError = Object.keys(data)[0];
      if (isError === "Error") {
        let errorMessage = data["Error"]["Message"];
        Message.error({
          title: errorMessage,
        });
      } else {
        Message.success({
          title: "your log is success",
        });
      }
    }
  };

  getPassword = () => {
    this.props.history.push("/reset");
  };

  render() {
    const { t } = this.props;
    const { userName, email, passWord, isLogin } = this.state;

    return (
      <div className="bg-color">
        <div className="head-part">
          <div className="first-part">
            <div className="server-father">
              <img className="server-icon" src={img} alt="icon" />
            </div>
            <p className="title-desc">
              Serverless Dev <br></br> Tool
            </p>

            <p className="desc-part">
              <Translation>Thanks for your contribution</Translation>
            </p>
            <p className="desc-part">
              <Translation>
                That makes up for one giant leap for Serverless
              </Translation>
            </p>
            <p className="desc-part enter-appcenter">
              <Link to={{
                pathname: "/hubs",
              }}><Translation>Click to enter the application center</Translation></Link>

              <span><Translation>或者点击</Translation><a onClick={() => console.log(this.props.history.goBack())} text style={{cursor:'pointer',color:'#0064c8'}}>返回</a></span>


            </p>
          </div>
          <div className="second-login">
            <Form style={{ width: "300px" }}>
              <FormItem className="first-form">
                <div className="login-language">
                  <a href className={"sign-login"} onClick={this.toSign}>
                    <Translation>Sign up</Translation>
                  </a>
                  <a
                    href
                    className={`sign-login ${isLogin ? "is-sign" : null} `}
                  >
                    <Translation>Log in</Translation>
                  </a>
                  <div className="switch-language">
                    <SwitchLanguage></SwitchLanguage>
                  </div>
                </div>
                <p className="sign-desc" style={{ display: "block" }}>
                  <Translation>
                    Easily share your package via Serverless Devs tool to public
                    Git.
                  </Translation>
                </p>
              </FormItem>
              <FormItem
                className="form-item"
                style={{ marginBottom: "24px" }}
                hasFeedback
                required
              >
                <Input
                  className="login-input-part"
                  value={userName}
                  htmlType="text"
                  name="username"
                  ref={(input) => (this.input = input)}
                  placeholder={t("UserName")}
                  onChange={(e) => {
                    this.setState({
                      userName: e,
                    });
                  }}
                />
              </FormItem>

              <FormItem hasFeedback required>
                <Input
                  className="login-input-part"
                  value={passWord}
                  htmlType="Password"
                  name="basePass"
                  placeholder={t("Password")}
                  onChange={(e) => {
                    this.setState({
                      passWord: e,
                    });
                  }}
                />
              </FormItem>

              <FormItem className="login-button">
                <div className="login-head" style={{ display: "block" }}>
                  <Button className="is-log" onClick={this.login} type="primary">
                    <span className="login-sign-content">
                      <Translation>Log in</Translation>
                    </span>
                  </Button>
                  <a href onClick={this.getPassword} className="login-style">
                    <Translation>Forget your password</Translation>
                  </a>
                </div>
              </FormItem>
            </Form>
          </div>
          <footer className="footer-part">Powered by Serverless Devs</footer>
        </div>
      </div>
    );
  }
}
const Login = withTranslation()(LoginCmp);
export default Login;
