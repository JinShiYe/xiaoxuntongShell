
const key =1;
//公共参数
const storeKeyName={
    sha1key : "jsy309",//sha1 加密的秘钥
    salt : "#H_20190606_H#",//md5 加密的盐
    timeout:15*1000,//post 连接超时时间
    publicKey:'',//公钥
    personIfo:'personInfo1111',//存放登录的个人信息
    sysName : '支撑系统',
    footerDescription1 : 'Copyright © 2004 - 2019 goldeneyes. All Rights Reserved',
    footerDescription2 : '山东金视野 提供技术支持.  鲁ICP备09042772号-6',
    noticeUrl:'http://192.168.1.203:3000',//学校通知urlz
    //七牛
    QINIUAPPID:4,//七牛APPID 由管理员分配
    QNPUBSPACE : "pb", //七牛公开空间
    QNPRISPACE : "pv", //七牛私有空间
    XXTNOTICE : 'notice/', //笔校讯通、通知
    QNPUBXXT : "jsy@180526",//校讯通
};
switch (key) {
    case 0:
        storeKeyName.INTERFACEGU = 'https://jsypay.jiaobaowang.net/useradminwebapi/api/data/'; //顾工接口
        storeKeyName.INTERFACEZENG = 'http://139.129.252.49:8080/sup2/'; //系统接口
        storeKeyName.INTERFACEMENG = 'http://139.129.252.49:8080/sys/'; //系统接口
        storeKeyName.requestUrl="http://www.baidu.com";
        storeKeyName.PLATFORMCODE = 'PT0001'; //平台代码
		storeKeyName.APPCODE = 'support#'; //应用系统代码
        break;
    case 1:
        storeKeyName.INTERFACEGU = 'https://jsypay.jiaobaowang.net/useradminwebapi/api/data/'; //顾工接口
        storeKeyName.INTERFACEZENG = 'http://139.129.252.49:8080/sup2/'; //系统接口
        storeKeyName.INTERFACEMENG = 'http://139.129.252.49:8080/sys/'; //系统接口
        storeKeyName.requestUrl="http://192.168.1.121:8070/notice/getList";//API 地址
        storeKeyName.QNGETUPLOADTOKEN ="https://jbyc.jiaobaowang.net:8504/Api/QiNiu/GetUpLoadToKen";//七牛token获取接口
        storeKeyName.PLATFORMCODE = 'PT0001'; //平台代码
		storeKeyName.APPCODE = 'support#'; //应用系统代码
        break;
    default:
        break;
}
export default storeKeyName;
