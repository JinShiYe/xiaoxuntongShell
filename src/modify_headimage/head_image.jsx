import React, {Component} from 'react';
import '../App2.css';
import {Icon, Avatar,message,Upload,Button,Row,Col} from 'antd';
import storekeyname from '../storeKeyName';
import Store from '../store';
import myUtils from '../myUtils';
import desEncrypt from "../encrypt/des";
import qiniuUtils from "../qiniuUtils";
import * as qiniuse from "qiniu"
import * as qiniu from "qiniu-js"

//本地文件转base64
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
//上传头像组件
class PicturesWall extends React.Component {
    constructor(props){
        super(props);
        this.subscriptionList = []//上传线程，用于点击取消上传按钮时，结束上传动作
        this.state = {
            canUpload:true,//防止按钮多次点击
            isNew: false,//是否是原来的头像
            previewImage: '',//当前头像地址
            fileList:"", //待上传文件
            imgMaxSize: 2, //单张图片限制大小 M
            accept: ".bmp,.png,.gif,.jpg,.jpeg", //上传文件格式限制
            listType: "picture",//预览类型
        };
    }
    componentDidMount() {
        let personal=Store.get(storekeyname.personIfo);
        if(personal&&personal.user){
            this.setState({
                previewImage:personal.user.img_url+"?imgid="+myUtils.uid()
            })
        }
    }
    //注销组件
    componentWillUnmount() {
        let list = this.subscriptionList;
        list.map((itemAsyn, index) => { //结束正在上传的线程
                itemAsyn.unsubscribe() // 上传取消
                list.splice(index, 1)
            }
        )
        this.setState(preState => ({
                fileList: "",
                canUpload:true,
                isNew:false
            })
        )
    }
    //检查文件是否符合限定要求
    checkFile = file => {
        const isImg2M = file.size / 1024 / 1024 < this.state.imgMaxSize;
        let fileName = file.name;
        let index = fileName.split(".");
        fileName = "."+index[index.length-1];
        let jsonStr = ""
        if (fileName == ".bmp" || fileName == ".png" || fileName == ".gif" || fileName == ".jpg" || fileName == ".jpeg") {
            if (isImg2M) {
                jsonStr = "{\"msg\":\"\",\"fileType\":\"img\",\"canUpload\":true}"
            } else {
                jsonStr = "{\"msg\":\"图片文件最大不能超过" + this.state.imgMaxSize + "M\",\"fileType\":\"img\",\"canUpload\":false}"
            }
        }
        return JSON.parse(jsonStr)
    }
    // 上传之前事件
    beforeUpload = (file) => {
        let jsonStr = this.checkFile(file);
        if (jsonStr.canUpload) {
            let fileList = file;
            this.setState(preState => ({
                fileList: fileList
            }))
        } else {
            message.error(jsonStr.msg);
            return false
        }
        return false;
    }
    // 文件上传改变事件
    onChange =async (info) => {
        let file=info.fileList[info.fileList.length-1];
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        this.setState({
            previewImage:file.url || file.preview,
            isNew:true
        });
    }
    //文件上传 头像
    onUploadImg=()=>{
        let that=this;
        if(this.state.canUpload&&this.state.isNew){
            this.setState({
                canUpload:false,
            })
            //获取七牛token
            let file=this.state.fileList;
            let datas=[];
            let data= {"bucket":storekeyname.QNPUBSPACE,"key":storekeyname.XXTNOTICE+file.name,"pops":"","notifyUrl":""}
            datas.push(data);
            let params={
                AppID: 4,
                Param: desEncrypt(storekeyname.QNPUBXXT, JSON.stringify(datas))
            }
            qiniuUtils.post(storekeyname.QNGETUPLOADTOKEN, params, res => {
                if(res.Status==1){
                    res.Data.map(item=>{
                        let p_key=item.P_Key;
                        if((storekeyname.XXTNOTICE+file.name)==p_key){
                            let key=item.Key;
                            let uploadToken=item.Token;
                            let domain=item.Domain;
                            const observable = qiniu.upload(file, key, uploadToken, new qiniuse.form_up.PutExtra(), null);//开始上传
                            const subscription = observable.subscribe(function (res) {
                            }, function (err) {
                                console.log(err)
                                message.error("头像上传异常!")
                            }, function (res) {
                                // let obj={fileName:file.name,url:domain+key}
                                // console.log(JSON.stringify(obj))
                                let comData1 = {
                                    platform_code: storekeyname.PLATFORMCODE, //平台代码
                                    app_code: storekeyname.APPCODE, //应用系统代码
                                    type:"uico",//修改类型
                                    val:domain+key,//值
                                    access_token: Store.get(storekeyname.personIfo).access_token //用户令牌
                                }
                                myUtils.post(0, 'api/user/upUserInfo', comData1, res1 => {
                                    if (res1.code === '0000') {
                                        message.success("头像上传成功!")
                                        let personal=Store.get(storekeyname.personIfo);
                                        if(personal&&personal.user){
                                            personal.user.img_url=domain+key;
                                            Store.set(storekeyname.personIfo,personal);
                                        }
                                        that.setState({
                                            canUpload:true,
                                            isNew:false
                                        })
                                        that.props.onImgChange(domain+key);
                                    }else{
                                        message.success("头像上传失败!")
                                    }
                                });
                            })
                            subscription.uid = file.uid;//将上传文件的唯一表示与上传订阅绑定
                            this.subscriptionList.push(subscription);//缓存上传订阅，用于取消动作
                        }
                    })
                }else{
                    message.error("获取七牛token上传异常!")
                }
            });
        }
    }

    render() {
        return (
            <Row style={{textAlign:"center"}}>
                <Col>
                    <Upload
                        accept={this.state.accept}
                        action={this.state.action}   //上传文件地址
                        beforeUpload={this.beforeUpload}   //上传之前触发事件
                        onChange={this.onChange}
                        listType={this.state.listType}>
                        <Avatar shape="square" size={256} icon="user"
                                src={this.state.previewImage}
                                style={{textAlign:"center",border:"solid 1px RGBA(210,210,210,30)",borderRadius:"10px"}}/>
                    </Upload>
                </Col>
                <Col>
                    <Button type="primary" style={{marginTop:15}}   onClick={this.onUploadImg}>
                        <Icon type="upload" />保存头像
                    </Button>
                </Col>
            </Row>
        );
    }
}
export default PicturesWall;
