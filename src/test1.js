// import React from 'react';
// import logo from './logo.svg';
import React, {Component} from 'react';
// import {Button} from 'antd';
import './App2.css';
// import ReactDOM from 'react-dom';
import {Form, Input, Icon, Button, Card, message,Row,Col,Modal} from 'antd';
// 由于 antd 组件的默认文案是英文，所以需要修改为中文
// import zhCN from 'antd/lib/locale-provider/zh_CN';
import 'antd/dist/antd.css';
// import Axios from 'axios';
import { MD5} from 'crypto-js';
import myUtils from './myUtils';
import storekeyname from './storeKeyName';
import {BrowserRouter,HashRouter, Route, Switch, withRouter,Link} from 'react-router-dom';
import MainPage from './test3';
import Store from './store';
import Register from './register';

function Home(props) {
    return (<div className="login-wrapper">
        <div className="sys-name-wrapper">{storekeyname.sysName}</div>
        <Card className="login-card" title="欢迎登录">
            <WrappedNormalLoginForm/>
        </Card>
        <div className="footer-wrapper">
            <div className="footer-description">{storekeyname.footerDescription1}</div>
            <div className="footer-description">{storekeyname.footerDescription2}</div>
        </div>
    </div>);
}

class NormalLoginForm extends React.Component {
    state = {
        loading: false,
        src: storekeyname.INTERFACEZENG+'Admin/Public/verifyCode',
        visible: false,
        isOk: false,
        msg: null
    };
    verifyCode = () => {
        const src = storekeyname.INTERFACEZENG+'Admin/Public/verifyCode?r=' + Math.random();
        this.setState({src});
        this.props.form.setFieldsValue({
            verify_code: null
        });
    }
    showModal = () => {
        this.setState({
          visible: true,
        });
      }
      handleOk = e => {
        console.log(e);
        this.setState({
          visible: false,
        });
      };
    
      handleCancel = e => {
        console.log(e);
        this.setState({
          visible: false,
        });
      };
    submit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                var params = {
                    platform_code: storekeyname.PLATFORMCODE
                }
                myUtils.post(0, 'api/login/getEncryptKey', params, res => {
                    if (res.code === '0000') {
                        const tempPass = MD5(res.data.encryptKey + values.password).toString();
                        var comData1 = {
                            password: tempPass, //秘钥+密码再MD5加密
                            platform_code: storekeyname.PLATFORMCODE, //平台代码
                            app_code: storekeyname.APPCODE, //应用系统代码
                            unit_code: '-1',//单位代码，如应用系统需限制本单位用户才允许登录，则传入单位代码，否则传“-1”
                            // verify_code:values.verify_code,//验证码，手机APP登录没有验证码则不传
                            verify_code:'',//验证码，手机APP登录没有验证码则不传
                            login_name: values.login_name //登录名
                        }
                        myUtils.post(0, 'api/login', comData1, res1 => {
                            if (res1.code === '0000') {
                                Store.set(storekeyname.personIfo, res1.data);
                                let taa = this.props.history;
                                taa.push('/test3');
                                window.postMessage(JSON.stringify(comData1),'*');
                            } else {
                                message.error(res1.msg);
                            }
                        });
                    } else {
                        message.error(res.msg);
                    }
                });
            }
        });
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit}>
                <Form.Item>
                    {getFieldDecorator('login_name', {
                        rules: [{required: true, message: '请输入帐号！'}]
                    })(
                        <Input prefix={<Icon type="user"/>} placeholder="帐号" autoFocus/>
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('password', {
                        rules: [{required: true, message: '请输入密码！'}]
                    })(
                        <Input type="password" autoComplete="off" prefix={<Icon type="lock"/>} placeholder="密码"/>
                    )}
                </Form.Item>
                <Form.Item labelCol={{ span: 6}} wrapperCol={{ span: 18 }} label="验证码">
                    <Row gutter={8}>
                        <Col span={12}>{getFieldDecorator('verify_code', {
                            rules: [{ required: true, message: '请输入验证码！' }],})(<Input className="verify-code-input" autoComplete="off" maxLength={4} placeholder="验证码" />)}
                        </Col>
                        <Col span={6}>
                        <img className="verify-code" onClick={this.verifyCode} src={this.state.src} />
                        </Col>
                    </Row>
                </Form.Item>
                {/* <Form.Item>
		            {getFieldDecorator('verify_code', {
								rules: [{ required: true, message: '请输入验证码！' }]
							})(
								<Input className="verify-code-input" autoComplete="off" maxLength={4} placeholder="验证码" />
							)}
			  <img className="verify-code" onClick={this.verifyCode} src={this.state.src} />
		  </Form.Item> */}
                <Form.Item>
                    <Button className="login-btn" type="primary" disabled={this.state.loading}
                            onClick={this.submit}>登录</Button>
                    {/* <Link to='/register'><Button className="login-btn" type="primary" >登录</Button></Link> */}
                    <a className="login-btn" type="primary" onClick={this.showModal}>注册</a>
                    <Modal
          title="注册页面"
          visible={this.state.visible}
          footer={null}
          width={900}
          maskClosable={false}
          destroyOnClose={true}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Register handleOk={this.handleOk}></Register>
        </Modal>
                </Form.Item>
            </Form>
        );
    }
}

const WrappedNormalLoginForm = withRouter(Form.create({name: 'normal_login'})(NormalLoginForm));

// window.addEventListener('message', function(messageEvent) {
//     var data = messageEvent.data;// messageEvent: {source, currentTarget, data}
//     console.info('message from child testjieshou1:', data);
// }, false);

// const Main = () => (
//     <main className='divSum'>
//         <Switch>
//             <Route exact path='/' component={Home}/>
//             <Route path='/test3' component={MainPage}/>
//         </Switch>
//     </main>
// )

// function Acc(props) {
//     return (
//         <div className='divSum'>
//             <Main/>
//         </div>
//     )
// }

class App extends Component {
    render() {
        return (
            <HashRouter>
                <div className='divSum'>
                    <Switch>
                        <Route exact path='/' component={Home}/>
                        <Route path='/test3' component={MainPage}/>
                    </Switch>
                </div>
            </HashRouter>
        );
    }
}

// class App extends Component {
//     render() {
//         return (
//             <BrowserRouter>
//                 <Acc/>
//             </BrowserRouter>
//         );
//     }
// }

export default App;