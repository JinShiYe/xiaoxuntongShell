
import {Alert, Select, Form, Input, Radio, Row, Col, Icon, Button, LocaleProvider, locales, Steps, message, Typography} from 'antd';
import React, {Component} from 'react';
// import {Button} from 'antd';
import './App2.css';
// import ReactDOM from 'react-dom';
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
const DemoBox = props => <p className={`height-${props.value}`}>{props.children}</p>;

var userTypeArr = [{"v":"YHLX0003","label":"教师"},{"v":"YHLX0004","label":"家长"},{"v":"YHLX0005","label":"学生"}];
    var typeTeacher = 'YHLX0003'; // 老师类型代码
    var typeParents = 'YHLX0004'; // 家长代码
    var typeStudent = 'YHLX0005'; // 学生代码
    var loginUrl = "/schbackend/login";

class firstForm extends React.Component {

    state = {
        loading: false,
        confirmDirty: false,
        visible: false,
        isOk: false,
        msg: null,
        dataList: [],
        userType: '',
        nameLabel: '用户姓名',
        phoneLabel: '手机号码',
    };

    userTypeChange = (userType) => {
        if (userType.target.value === typeTeacher) {
            this.setState({
                userType: userType.target.value,
                nameLabel: "用户姓名",
                phoneLabel: "手机号码",
            });
        } else {
            this.setState({
                userType: userType.target.value,
                nameLabel: "学生姓名",
                phoneLabel: "家长手机号",
            });
        }
    }

    showMsg = (isOk, msg, millisecond, callback) => {
        this.setState({
            isOk,
            msg,
            visible: true
        });

        setTimeout(() => {
            this.setState({
                visible: false,
                msg: null
            });
            if (typeof callback === 'function') {
                callback();
            }
        }, millisecond);
    }

    toggleLoading = () => {
        this.setState({loading: !this.state.loading});
    }

    handleChangeState = (state) => {
        console.log(this.props)
        this.props.onSetState(state);
    }

    onSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return;
            }
            this.toggleLoading();
            console.log('register,values:'+JSON.stringify(values));
            var comData0 = {
                user_type: values.userType, //用户类型
                name: values.name, //姓名，注册老师的时候输入老师的姓名，注册学生和家长时输入学生姓名
                phone: values.phone //电话，注册老师的时候输入老师的姓名，注册学生和家长时输入家长电话
            }
            console.log('register,comData0:'+JSON.stringify(comData0));
            myUtils.post(1, 'api/register/userInfo', comData0, res1 => {
                this.toggleLoading();
                if (res1.code === '0000') {
                    this.handleChangeState({userAttrs: res1.data, stage: 1});
                } else {
                    this.showMsg(false, res1.msg, 3000);
                }
            });
            // $.ajax({
            //     type: 'POST',
            //     dataType: 'json',
            //     url: '/schbackend/registerUserInfo',
            //     data: {
            //         ...values,
            //     },
            //     success: (data) => {
            //         this.toggleLoading();
            //         if (data.state == 'ok') {
            //            this.handleChangeState({userAttrs: data.data, stage: 1});
            //         } else {
            //             this.showMsg(false, data.msg, 3000);
            //         }
            //     }
            // });
        });
    }

    handleInputChange = (event) => {
        event.target.value = event.target.value.replace(/[^\d]/g, '')
    }

    render() {
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 18},
        };
        const tailformItemLayout = {
            wrapperCol: {offset: 6, span: 18},
        };
        const {getFieldDecorator} = this.props.form;
        return (
            <Form className="jn-ajax-form" onSubmit={this.onSubmit}>
                <Form.Item {...formItemLayout} label="用户类型">
                    {getFieldDecorator('userType', {
                        initialValue: userTypeArr[0] ? userTypeArr[0].v : null,
                        rules: [{required: true, message: '请选择用户类型！'}]
                    })(
                        <Radio.Group onChange={(value) => this.userTypeChange(value)}>
                            {userTypeArr.map(userType =>
                                <Radio value={userType.v}>{userType.label}</Radio>
                            )}
                        </Radio.Group>
                    )}
                </Form.Item>
                <Form.Item {...formItemLayout} label={this.state.nameLabel}>
                    {getFieldDecorator('name', {
                        rules: [
                            {required: true, message: `请输入${this.state.nameLabel}！`},
                        ]
                    })(
                        <Input maxLength={20} autocomplete="off" placeholder={`请输入${this.state.nameLabel}`}/>
                    )}
                </Form.Item>
                <Form.Item {...formItemLayout} label={this.state.phoneLabel}>
                    {getFieldDecorator('phone', {
                        rules: [
                            {required: true, message: `请输入11位${this.state.phoneLabel}！`},
                            {pattern: /^1[34578]\d{9}$/, message: `请输入正确的11位${this.state.phoneLabel}！`}
                        ]
                    })(
                        <Input maxLength={11} onChange={this.handleInputChange}
                               placeholder={`请输入11位${this.state.phoneLabel}`}/>
                    )}
                </Form.Item>
                <Form.Item className="btn-box" {...tailformItemLayout}>
                    <Button type="primary" disabled={this.state.loading} htmlType="submit">下一步</Button>
                </Form.Item>
                {!this.state.visible ? null :
                    <Alert type={this.state.isOk ? 'info' : 'error'} message={this.state.msg} showIcon banner/>
                }
            </Form>
        );
    }
}

class thirdForm extends React.Component {

    state = {
        loading: false,
        confirmDirty: false,
        src: storekeyname.INTERFACEZENG+'Admin/Public/verifyCode',
        visible: false,
        isOk: false,
        msg: null,
        dataList: [],

    };

    verifyCode = () => {
        const src = storekeyname.INTERFACEZENG+'Admin/Public/verifyCode?r=' + Math.random();
        this.setState({src});
        this.props.form.setFieldsValue({
            verify_code: null
        });
    }

    showMsg = (isOk, msg, millisecond, callback) => {
        this.setState({
            isOk,
            msg,
            visible: true
        });

        setTimeout(() => {
            this.setState({
                visible: false,
                msg: null
            });
            if (typeof callback === 'function') {
                callback();
            }
        }, millisecond);
    }

    toggleLoading = () => {
        this.setState({loading: !this.state.loading});
    }

    handleConfirmBlur = (e) => {
        this.setState({confirmDirty: this.state.confirmDirty || !!e.target.value});
    }

    handleChangeState = (state) => {
        console.log(this.props)
        this.props.onSetState(state);
    }

    compareToFirstPassword = (rule, value, callback) => {
        if (value && value !== this.props.form.getFieldValue('password')) {
            callback('输入密码与确认密码不一致!');
        } else {
            callback();
        }
    }

    validateToNextPassword = (rule, value, callback) => {
        if (value && this.state.confirmDirty) {
            this.props.form.validateFields(['confirm'], {force: true});
        }
        callback();
    }

    /**
     * 验证用户名是否存在
     * @param rule
     * @param value
     * @param callback
     */
    handleisUserExist = (rule, value, callback) => {
        console.log('register,values:'+JSON.stringify(value));
            var comData0 = {
                platform_code:storekeyname.PLATFORMCODE,//平台代码
                app_code: storekeyname.APPCODE, //应用系统代码
                login_name: value //登录名
            }
            console.log('register,comData0:'+JSON.stringify(comData0));
            myUtils.post(0, 'api/user/isUserExist', comData0, res1 => {
                console.log('isUserExist:'+JSON.stringify(res1));
                // this.toggleLoading();
                if (res1.code === '0000') {
                    // this.handleChangeState({userAttrs: res1.data, stage: 1});
                } else {
                    // this.showMsg(false, res1.msg, 3000);
                }
            });
        // $.ajax({
        //     type: 'POST',
        //     dataType: 'json',
        //     url: '/schbackend/isUserExist',
        //     data: {
        //         loginName: value,
        //     },
        //     success: (data) => {
        //         if (data.state == 'ok') {
        //             if (data.data) {
        //                 callback('用户名被占用');
        //             } else {
        //                 callback();
        //             }
        //         }
        //     }
        // })
    }

    onSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return;
            }

            this.toggleLoading();
            console.log('register,values:'+JSON.stringify(values));
            var params = {
                platform_code: storekeyname.PLATFORMCODE
            }
            // myUtils.post(0, 'api/login/getEncryptKey', params, res => {
                // if (res.code === '0000') {
                    // const tempPass = MD5(res.data.encryptKey + values.password).toString();
                    // var comData0 = {
                    //     app_code: storekeyname.APPCODE, //应用系统代码
                    //     user_id: this.props.attrs[this.props.schNum].userid, //用户id
                    //     user_type: this.props.attrs[this.props.schNum].usertype, //用户类型
                    //     name: this.props.attrs[this.props.schNum].name, //姓名
                    //     phone: this.props.attrs[this.props.schNum].phone, //电话
                    //     login_name: values.login_name, //登录名
                    //     password: tempPass, //密码,秘钥+密码再MD5加密
                    // }
                    // console.log('register,comData0:'+JSON.stringify(comData0));
                    // myUtils.post(1, 'api/register', comData0, res1 => {
                        // this.toggleLoading();
                        // if (res1.code === '0000') {
                            this.handleChangeState({stage: 3});
                        // } else {
                        //     if (res1.code == 'NOT_UNIQUE') {
                        //         this.state.dataList = res1.data;
                        //     }
                        //     this.showMsg(false, res1.msg, 3000);
                        //     setTimeout(() => {
                        //         this.verifyCode();
                        //     }, 500);
                        // }
                    // });
                // } else {
                //     message.error(res.msg);
                // }
            // });
            
            // $.ajax({
            //     type: 'POST',
            //     dataType: 'json',
            //     url: '/schbackend/register',
            //     data: {
            //         ...values,
            //         name: this.props.attrs[this.props.schNum].name,
            //         user_id: this.props.attrs[this.props.schNum].userid,
            //         user_type: this.props.attrs[this.props.schNum].usertype,
            //         phone: this.props.attrs[this.props.schNum].phone,
            //         password: $.md5('#@_JFnice_@#' + values.password),
            //         confirm: $.md5('#@_JFnice_@#' + values.confirm),
            //     },
            //     success: (data) => {
            //         this.toggleLoading();
                    // if (data.state == 'ok') {
                    //     this.handleChangeState({stage: 3});
                    // } else {
                    //     if (data.code == 'NOT_UNIQUE') {
                    //         this.state.dataList = data.data;
                    //     }
                    //     this.showMsg(false, data.msg, 3000);
                    //     setTimeout(() => {
                    //         this.verifyCode();
                    //     }, 500);
                    // }
            //     }
            // });
        });
    }

    render() {
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 18},
        };
        const tailformItemLayout = {
            wrapperCol: {offset: 6, span: 18},
        };
        var showInfo = '';
        if (this.props.attrs[this.props.schNum].usertype === typeTeacher) {
            showInfo = 'none';
        }
        const {getFieldDecorator} = this.props.form;

        return (
            <Form className="third-form" onSubmit={this.onSubmit} style={{marginTop: 10 + 'px'}}>
                <div id="perInfo" style={{display: showInfo, marginTop: 10 + 'px'}}>
                    <Row>
                        <Col span={12}><h3>学校名称:{this.props.attrs[this.props.schNum].schname}</h3></Col>
                        <Col span={6} offset={3}><h3>年级:{this.props.attrs[this.props.schNum].grdname}</h3></Col>
                    </Row>
                    <Row>
                        <Col span={12}><h3>班级:{this.props.attrs[this.props.schNum].clsname}</h3></Col>
                        <Col span={8} offset={3}><h3>姓名:{this.props.attrs[this.props.schNum].name}</h3></Col>
                    </Row>
                </div>
                <Form.Item {...formItemLayout} label="登录帐号">
                    {getFieldDecorator('login_name', {
                        rules: [
                            {required: true, message: '请输入登录帐号！'},
                            {pattern: /^[A-Za-z0-9]{4,20}$/, message: '请输入4-20位字母或数字的登录账号！'},
                            // {validator: this.handleisUserExist}
                        ]
                    })(
                        <Input maxLength={20} autocomplete="off"/>
                    )}
                </Form.Item>
                <Form.Item {...formItemLayout} label="输入密码">
                    {getFieldDecorator('password', {
                        rules: [
                            {required: true, message: '请输入登录密码！'},
                            {pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,18}$/, message: '请输入6-18位字母数字组合的密码！'},
                            {validator: this.validateToNextPassword}
                        ]
                    })(
                        <Input type="password" autocomplete="off"/>
                    )}
                </Form.Item>
                <Form.Item {...formItemLayout} label="确认密码">
                    {getFieldDecorator('confirm', {
                        rules: [
                            {required: true, message: '请输入确认密码！'},
                            {validator: this.compareToFirstPassword}
                        ]
                    })(
                        <Input type="password" autocomplete="off" onBlur={this.handleConfirmBlur}/>
                    )}
                </Form.Item>
                <Form.Item labelCol={{span: 6}} wrapperCol={{span: 18}} label="验证码">
                    {getFieldDecorator('verify_code', {
                        rules: [{required: true, message: '请输入验证码！'}]
                    })(
                        <Input className="verify-code-input" autocomplete="off" maxLength={4} placeholder="验证码"/>
                    )}
                    <img className="verify-code" onClick={this.verifyCode} src={this.state.src}/>
                </Form.Item>
                <Form.Item className="btn-box" {...tailformItemLayout}>
                    <Col span={8} offset={2}>
                        <Button type="primary" disabled={this.state.loading} htmlType="submit">注册</Button>
                    </Col>
                    <Col span={8} offset={2}>
                        <Button href={loginUrl}>取消</Button>
                    </Col>
                </Form.Item>
                {!this.state.visible ? null :
                    <Alert type={this.state.isOk ? 'info' : 'error'} message={this.state.msg} showIcon banner/>
                }
            </Form>
        );
    }
}

const WrappedAjaxForm = Form.create()(firstForm);
const ThirdAjaxForm = Form.create()(thirdForm);
const Step = Steps.Step;

class Register extends React.Component {
    constructor() {
        super()
        this.state = {
            stage: 0,
            userAttrs: [],
            schNum: 0,
        }
    }

    handleClosediv = () => {
        // JnCloseModal();
    }

    closeWindow = () => {
        document.body.removeChild(this.container);
    }

    renderTeacher = () => {
        return (
            <div>
                {this.state.userAttrs.map((userattr, index) => (
                    <div key={index} style={{margin: '10px'}}>

                        <Row>
                            <Col span={7} offset={3}><h2>{userattr.schname}</h2></Col>
                            <Col span={7} offset={4}><h2>{this.teacherStatus(userattr.loginname, index)}</h2></Col>
                        </Row>

                    </div>
                ))}
            </div>
        );
    }

    teacherStatus = (scStatus, index) => {
        if (scStatus !== "" && scStatus !== null) {
            return "已注册";
        } else {
            return <button value={index} onClick={() => {
                this.choiceSch(index)
            }}>注册</button>
        }
    }

    choiceSch = (index) => {
        this.handleSetState({schNum: index, stage: 2});
    }

    handleSetState = (state) => {
        this.setState({...state})
    }

    handleStage = () => {
        if (this.state.stage > 0 && this.state.stage !== 3) {
            this.handleSetState({stage: --this.state.stage});
        }
    }

    render() {
        var showback = '';

        if (this.state.stage == 0 || this.state.stage == 3) {
            showback = 'none';
        } else {
            showback = '';
        }
        return (
            <div className="jn-content">
                <div style={{width: '80%', alignItems: 'center', margin: 'auto'}}>
                    <Steps current={this.state.stage}>
                        <Step title="输入资料" description=""/>
                        <Step title="确认学校" description=""/>
                        <Step title="填写注册资料" description=""/>
                        <Step title="完成" description=""/>
                    </Steps>
                </div>
                <Row><Col span={7} offset={17}>
                    <div className="comeback" style={{marginTop: '75px', display: showback}}>
                        <a href='#' onClick={() => {
                            this.handleStage()
                        }}>返回</a>
                    </div>
                </Col></Row>
                <Row>
                    <Col span={12} offset={6}>
                        {this.state.stage === 0 &&
                        <WrappedAjaxForm wrappedComponentRef={form => this.ajaxForm = form}
                                         attrs={this.state.userAttrs} onSetState={this.handleSetState}/>}
                        {this.state.stage === 1 && this.renderTeacher()}
                        {this.state.stage === 2 && <ThirdAjaxForm wrappedComponentRef={form => this.ajaxForm = form}
                                                                  attrs={this.state.userAttrs}
                                                                  schNum={this.state.schNum}
                                                                  onSetState={this.handleSetState}/>}
                    </Col>
                </Row>
                {this.state.stage === 3 &&
                <div style={{width: '100%', alignItems: 'center', marginLeft: 'auto', marginTop: '75px'}}>
                    <Row>
                        <Col span={8} offset={9}>
                            <h1>恭喜您注册成功!</h1>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8} offset={10}>
                            <Button onClick={this.props.handleOk}>关闭</Button>
                        </Col>
                    </Row>
                </div>
                }
            </div>
        );
    }
}

export default Register;

// ReactDOM.render(<LocaleProvider locale={locales.zh_CN}><App/></LocaleProvider>, document.getElementById('app'));
