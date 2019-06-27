import React, {Component} from 'react';
import './App2.css';
import {Form, Input, Icon, Button, Card, message} from 'antd';
// 由于 antd 组件的默认文案是英文，所以需要修改为中文
// import zhCN from 'antd/lib/locale-provider/zh_CN';
import 'antd/dist/antd.css';
import { MD5} from 'crypto-js';
import myUtils from './myUtils';
import storekeyname from './storeKeyName';
import {BrowserRouter, Route, Switch, withRouter} from 'react-router-dom';
import Store from './store';

var sysName = '校讯通';
var footerDescription1 = 'Copyright © 2004 - 2019 goldeneyes. All Rights Reserved';
var footerDescription2 = '山东金视野 提供技术支持.  鲁ICP备09042772号-6';


// function Home(props) {
//     return (<div className="login-wrapper">
//         <div className="sys-name-wrapper">{sysName}</div>
//         <Card className="login-card" title="修改密码">
//             <WrappedNormalLoginForm/>
//         </Card>
//         <div className="footer-wrapper">
//             <div className="footer-description">{footerDescription1}</div>
//             <div className="footer-description">{footerDescription2}</div>
//         </div>
//     </div>);
// }

// class NormalLoginForm extends React.Component {
//     state = {
//         loading: false,
//         src: '/emsys/Admin/Public/verifyCode',
//         visible: false,
//         isOk: false,
//         msg: null
//     };
//     verifyCode = () => {
//         const src = '/emsys/Admin/Public/verifyCode?r=' + Math.random();
//         this.setState({src});
//         this.props.form.setFieldsValue({
//             verify_code: null
//         });
//     }
//     showMsg = (isOk, msg, millisecond, callback) => {
//         this.setState({
//             isOk,
//             msg,
//             visible: true
//         });

//         setTimeout(() => {
//             this.setState({
//                 visible: false,
//                 msg: null
//             });
//             if (typeof callback === 'function') {
//                 callback();
//             }
//         }, millisecond);
//     }
//     toggleLoading = () => {
//         this.setState({loading: !this.state.loading});
//     }
//     submit = e => {
//         e.preventDefault();
//         console.log('tempm:' + MD5('123456'));
//         this.props.form.validateFields((err, values) => {
//             if (!err) {
//                 // alert('222props:'+JSON.stringify(values));
//                 var params = {
//                     platform_code: storekeyname.PLATFORMCODE
//                 }
//                 myUtils.post(0, 'api/login/getEncryptKey', params, res => {
//                   console.log('res.data.encryptKey:' + res.data.encryptKey);
//                   const oldPW = MD5(res.data.encryptKey + values.password).toString();
//                   const newPW = MD5(res.data.encryptKey + values.password).toString();
//                   console.log('tempPass:' + tempPass);
//                   var comData1 = {
//                       old_password: oldPW, //原密码，秘钥+原密码再MD5加密
//                       new_password: newPW, //新密码，秘钥+新密码再MD5加密
//                       access_token: Store.get(storekeyname.personIfo).access_token //用户令牌
//                   }
//                   console.log('comData11111111:' + JSON.stringify(comData1));
//                   myUtils.post(0, 'api/user/updPwd', comData1, res1 => {
//                       console.log('444props:' + JSON.stringify(res1));
//                       if (res1.code === '0000') {
//                           // Store.set(storekeyname.personIfo, res1.data);
//                       } else {
//                           message.error(res1.msg);
//                       }
//                   });
//                 });
//             }
//         });
//     };

//     render() {
//         const {getFieldDecorator} = this.props.form;
//         return (
//             <Form onSubmit={this.handleSubmit}>
//                 <Form.Item>
//                     {getFieldDecorator('password', {
//                         rules: [{required: true, message: '请输入原密码'}]
//                     })(
//                         <Input prefix={<Icon type="password"/>} placeholder="请输入原密码" autoFocus/>
//                     )}
//                 </Form.Item>
//                 <Form.Item>
//                     {getFieldDecorator('password', {
//                         rules: [{required: true, message: '请输入新密码'}]
//                     })(
//                         <Input type="password" autoComplete="off" prefix={<Icon type="lock"/>} placeholder="请输入新密码"/>
//                     )}
//                 </Form.Item>
//                 <Form.Item>
//                     {getFieldDecorator('password1', {
//                         rules: [{required: true, message: '请再次输入新密码'}]
//                     })(
//                         <Input type="password" autoComplete="off" prefix={<Icon type="lock"/>} placeholder="请再次输入新密码"/>
//                     )}
//                 </Form.Item>
//                 <Form.Item>
//                     <Button className="login-btn" type="primary" disabled={this.state.loading} onClick={this.submit}>登录</Button>
//                 </Form.Item>
//             </Form>
//         );
//     }
// }

// const WrappedNormalLoginForm = withRouter(Form.create({name: 'normal_login'})(NormalLoginForm));    

class App11 extends Component {
    render() {
        return (
            <div>ksjfg;lisdf;glsjf;dij</div>
            // <BrowserRouter>
            //     <div className='divSum'>
            //         <Switch>
            //             <Route exact path='/test2' component={Home}/>
            //         </Switch>
            //     </div>
            // </BrowserRouter>
        );
    }
}

export default App11;