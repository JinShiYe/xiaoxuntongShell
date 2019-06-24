import axios from "axios";
import storekeyname from "./storeKeyName";
import {
    HmacSHA1,
    enc
} from 'crypto-js';
const myUtils = {
    // 获取url params参数
    getUrlSearch: () => {
        var urlcan = decodeURIComponent(window.location.search);
        urlcan = urlcan.split("?")[1]; //数组
        if (urlcan) {
            urlcan = urlcan.replace(/\s/g, "");
            var arr = urlcan.split("&"); //数组
            var obj = {};
            for (var i = 0; i < arr.length; i++) {
                var arritem = arr[i].split("=");
                if (arritem[1]) {
                    obj[arritem[0]] = arritem[1];
                } else {
                    obj[arritem[0]] = "";
                }
            }
        }
        return obj;
    },
    //POST 请求公共方法
    post: (flag,requestUrl, params, callback) => {
        var signTemp = myUtils.post222(params);
        let signT = HmacSHA1(signTemp, storekeyname.sha1key).toString(enc.Base64);
        params.sign = signT;
        axios.defaults.timeout = storekeyname.timeout;
        var url = storekeyname.INTERFACEZENG + requestUrl;
        if (flag === 1) {
            url = storekeyname.INTERFACEMENG + requestUrl;
        } else if (flag === 2) {
            url = storekeyname.INTERFACEGU + requestUrl;
        }
        console.log('url:'+url);
        axios.post(url, params).then(function (response) {
            console.log('responseUrl:'+requestUrl+',data:'+JSON.stringify(response.data));
            callback(response.data);
        }).catch(function (error) {
            // console.log('error:'+requestUrl+',data:'+JSON.stringify(error));
            console.log(error);
            // callback(error);
        });
    },
    //POST 请求公共方法
    post222: (params) => {
        var arr1 = [];
        for (var item in params) {
            if (params[item] instanceof Array) {
                arr1.push(item + '=' + JSON.stringify(params[item]) + '');
            } else {
                arr1.push(item + '=' + params[item]);
            }
        }
        //拼接登录需要的签名
        var signTemp = arr1.sort().join('&');
        return signTemp;
    }
};
export default myUtils;