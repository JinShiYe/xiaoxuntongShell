
const key =1;
//公共参数
const storeKeyName={
    sha1key : "jsy309",//sha1 加密的秘钥
    salt : "#H_20190606_H#",//md5 加密的盐
    timeout:15*1000,//post 连接超时时间
    publicKey:'',//公钥
    qiniuSpacePrivate:false,//七牛空间是否是私有空间
    qiniuAccessKey : 'PbkUIuunZ43RmqRWKhBxmdciWuhSMgKnjz5qE2AN',//七牛 AK
    qiniuSecretKey : 'yYfeYPW-6jUysfR9ZGNx_LD6z6m4drUiU70hs8jX',//七牛 SK
    personIfo:'personInfo1111',//存放登录的个人信息
    sysName : '校讯通',
    footerDescription1 : 'Copyright © 2004 - 2019 goldeneyes. All Rights Reserved',
    footerDescription2 : '山东金视野 提供技术支持.  鲁ICP备09042772号-6',
    noticeUrl:'http://192.168.1.203:3000',//学校通知urlz
};
switch (storeKeyName.qiniuSpacePrivate) {
    case true:
        storeKeyName.qiniuUrl= 'http://psxcbxub2.bkt.clouddn.com/';//七牛上传地址
        storeKeyName.qiniuUrl= 'http://psxcbxub2.bkt.clouddn.com/';//七牛上传地址
        storeKeyName.qiniuBucket="reacrtest"//七牛私有空间
        break;
    case false:
        storeKeyName.qiniuUrl= 'http://psz1v05tn.bkt.clouddn.com/';//七牛上传地址
        storeKeyName.qiniuBucket="reactttt";//七牛公有空间
        break;
    default:
        break;
}
switch (key) {
    case 0:
        storeKeyName.INTERFACEGU = 'https://jsypay.jiaobaowang.net/useradminwebapi/api/data/'; //顾工接口
        storeKeyName.INTERFACEZENG = 'http://139.129.252.49:8080/sup/'; //系统接口
        storeKeyName.INTERFACEMENG = 'http://139.129.252.49:8080/sys/'; //系统接口
        storeKeyName.requestUrl="http://www.baidu.com";
        storeKeyName.PLATFORMCODE = 'PT0001'; //平台代码
		storeKeyName.APPCODE = 'schInfoApp'; //应用系统代码
        break;
    case 1:
        storeKeyName.INTERFACEGU = 'https://jsypay.jiaobaowang.net/useradminwebapi/api/data/'; //顾工接口
        storeKeyName.INTERFACEZENG = 'http://139.129.252.49:8080/sup/'; //系统接口
        storeKeyName.INTERFACEMENG = 'http://139.129.252.49:8080/sys/'; //系统接口
        storeKeyName.requestUrl="http://192.168.1.121:8070/notice/getList";//API 地址
        storeKeyName.PLATFORMCODE = 'PT0001'; //平台代码
		storeKeyName.APPCODE = 'schInfoApp'; //应用系统代码
        break;
    default:
        break;
}
export default storeKeyName;
