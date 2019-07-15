import React, {Component} from 'react';
import {Layout, Menu, Breadcrumb, Icon, Avatar,message, Dropdown, Popconfirm,Modal} from 'antd';
import {BrowserRouter,HashRouter, Route, Switch, withRouter} from 'react-router-dom';
import './App2.css';
import storekeyname from './storeKeyName';
import Store from './store';
import Iframe from 'react-iframe';
import myUtils from './myUtils';
import Home from './test1';
import App11 from './test2';
import ModifyHeadImg from "./modify_headimage/head_image";

var tempV = Store.get(storekeyname.personIfo);
console.log('tempV:' + JSON.stringify(tempV));

const {SubMenu} = Menu;
const {Header, Content, Sider} = Layout;

class MyIframe extends  Component{
    constructor(props){
        super(props);
        this.url="https://www.baidu.com";
    }
    setUrl=url=>{
        this.url=url
        console.log(this.url)
        document.getElementById('myId').src = this.url;
    }
    // componentDidMount() {
    //     window.addEventListener('resize', this.changeWindow);
    // }
    // changeWindow=()=>{
    //     let ifm= document.getElementById("myId");
    //     ifm.height=(document.documentElement.clientHeight-200);
    // }
    render() {
        return (
            <Iframe src={this.url}
            frameBorder='0'
                    width="100%"
                    height="700"
                    id="myId"
                    onLoad={this.changeWindow}
                    allowFullScreen={true}
                    className="myClassname"
                    display="initial"
                    position="relative"/>
        )
    }
}
// const onClick = ({ key }) => {
//     console.log('key:'+key);
//     if (key === 'modifyPW') {
//         fra.setUrl('http://localhost:3000/indexP');
//     }
//   };
//   function confirm(e) {
//     console.log(e);
//     message.success('Click on Yes');
//     let taa = this.props.history;
//     taa.push('/test1');
//   }

//   function cancel(e) {
//     console.log(e);
//     message.error('Click on No');
//   }

//   const menu = (
//     <Menu onClick={onClick}>
//       <Menu.Item key="modifyPW">修改密码</Menu.Item>
//       <Menu.Item key="return">
//       <Popconfirm
//     title="确认退出吗？"
//     onConfirm={confirm}
//     onCancel={cancel}
//     okText="是"
//     cancelText="否"
//   >
//     <a href="#">退出</a>
//   </Popconfirm>
//       </Menu.Item>
//     </Menu>
//   );



let fra=null;
class indexP extends Component {
    constructor(props) {
        super(props);
        this.state = {
            headImg:Store.get(storekeyname.personIfo).user.img_url+'?'+Math,//头像
            menusList:[],
            iframeName:'首页',
            type:"iframe",
        };
    }
    componentDidMount() {
        window.addEventListener('message', function(ev) {
            // if (ev.source !== window.parent) {return;}
            console.log('ev.source:'+ev.source);
            console.log('window.parent:'+window.parent);
            var data = ev.data;
            console.info('message from parent indexP:', data);
        }, false);

        var comData1 = {
            platform_code: storekeyname.PLATFORMCODE, //平台代码
            app_code: storekeyname.APPCODE, //应用系统代码
            access_token: Store.get(storekeyname.personIfo).access_token //用户令牌
        }
        let that =this;
        // console.log('comData11111111:' + JSON.stringify(comData1));
        myUtils.post(0, 'api/acl/menu', comData1, res1 => {
            if (res1.code === '0000') {
                if (res1.data.length>0) {
                    for (var index = 0; index < res1.data.length; index++) {
                        const element = res1.data[index];
                        for (let a = 0; a < element.childList.length; a++) {
                            const tempM0 = element.childList[a];
                            if (!tempM0.childList) {
                                tempM0.childList = [];
                            }
                            for (let b = 0; b < tempM0.childList.length; b++) {
                                const tempM1 = tempM0.childList[b];
                                if (!tempM1.childList) {
                                    tempM1.childList = [];
                                }
                            }
                        }
                    }
                    this.setState({
                        menusList: res1.data[0].childList
                      });
                } else {
                    const modal = Modal.error({
                        title: '当前账号无权限',
                        onOk:that.confirm()
                      });

                }
            } else {
                message.error(res1.msg);
            }
        });
    }

    handleClick=e=>{
        console.log('e.key:'+e.key);
        this.setState({
            type:"iframe"
        })
        let that=this;
        // setTimeout(function () {
            console.log(fra)
            for (let index = 0; index < that.state.menusList.length; index++) {
                const element = that.state.menusList[index];
                // console.log('element:'+JSON.stringify(element));
                if (element.url == null) {
                    for (let a = 0; a < element.childList.length; a++) {
                        const element1 = element.childList[a];
                        console.log('e.key:'+e.key+',element1.id:'+element1.id);
                        if (e.key.toString() === 'item1') {
                            fra.setUrl('https://www.baidu.com');
                            that.setState({
                                iframeName:'默认百度首页'
                            });
                        }else if (e.key.toString() === element1.id.toString()) {
                            let url = element1.url + '?access_token='+ Store.get(storekeyname.personIfo).access_token;
                            console.log('url:'+url);
                            fra.setUrl(url);

                            setTimeout(() => {
                                console.log('settimeout1111');
                                let ifm= document.getElementById("myId");
                                ifm.contentWindow.postMessage(JSON.stringify(Store.get(storekeyname.personIfo)),'*');
                                // window.postMessage('123','*');
                                // window.postMessage(JSON.stringify(Store.get(storekeyname.personIfo)),'*');
                            }, 500);
                            // window.postMessage(JSON.stringify(Store.get(storekeyname.personIfo)),storekeyname.noticeUrl);
                            // window.parent.postMessage('12312312312', '*'); // 触发父页面的message事件
                            // parent.postMessage(JSON.stringify(Store.get(storekeyname.personIfo)),'http://localhost:3000');
                            that.setState({
                                iframeName:element1.name
                            });
                        }
                    }
                } else if(e.key.toString() === element.id.toString()){
                    let url = element.url + '?access_token='+ Store.get(storekeyname.personIfo).access_token;
                            console.log('url:'+url);
                            fra.setUrl(url);

                            setTimeout(() => {
                                console.log('settimeout1111');
                                let ifm= document.getElementById("myId");
                                ifm.contentWindow.postMessage(JSON.stringify(Store.get(storekeyname.personIfo)),'*');
                            }, 2000);
                            that.setState({
                                iframeName:element.name
                            });
                }

            }
        // },500)
    }
    confirm=e=>{
        console.log(e);
        Store.set(storekeyname.personIfo, {});
        let taa = this.props.history;
        taa.push('/');
      }

      cancel=e=> {
        console.log(e);
        // message.error('Click on No');
      }
      onClickModify = ({ key }) => {
          console.log('key:'+key);
          if (key === 'iframe') {
              this.setState({
                  type:"iframe"
              })
          }
         if (key === 'modifyPW') {
                this.setState({
                    type:"modifyPW"
                })
         }
          if (key === 'modifyHeadImg') {
              this.setState({
                  type:"modifyHeadImg"
              })
          }
      }

      onImgChange=(url)=>{
          this.setState({
              headImg:url+'?imgid='+Math,
              type:"iframe"
          })
      }

    render() {
        let type=this.state.type;
        let componment=null;
        if(type=="iframe"){
            componment=<MyIframe ref={(node)=>fra=node}/>;
        }else if(type=="modifyPW"){
            componment=<App11 ref={(node)=>fra=node}/>
        }else if(type=="modifyHeadImg"){
            componment=<ModifyHeadImg ref={(node)=>fra=node} onImgChange={this.onImgChange}/>
        }
        // console.log('storekeyname.personIfo:'+JSON.stringify(Store.get(storekeyname.personIfo)));
        var list = (array) => {
            // console.log('array:'+JSON.stringify(array));
            // array = this.state.menusList;
            var res = [];
            for(var i = 0; i < array.length; i++) {
                var listModel = array[i];
                // console.log('listModel:'+JSON.stringify(listModel));
                if (listModel.url==null) {
                    res.push(<SubMenu key={listModel.id} title={<span><Icon type="desktop"/>{listModel.name}</span>}>
                    {listModel.childList.map((detailModel) =>
                        <Menu.Item key={detailModel.id}>{detailModel.name}</Menu.Item>
                    )}
             </SubMenu>)
                } else {
                    res.push(<Menu.Item key={listModel.id}><span><Icon type="desktop"/>{listModel.name}</span></Menu.Item>)
                }
            }
            return res
          }
        return (
            <Layout style={{height:'100%'}}>
                <Header className="header">
                    <div className="logo"/>
                       <Avatar size="large" style={{marginTop: '-10px'}} src={this.state.headImg}/>
                       <span style={{marginLeft: '20px', fontSize: '25px',color:'white'}}>{Store.get(storekeyname.personIfo).user.school_name}</span>
                       <span style={{float:'right'}}>
                            <Avatar size="large" style={{marginTop: '0px',width:'25px',height:'25px'}} src={this.state.headImg}/>
                            <Dropdown overlay={
                                <Menu onClick={this.onClickModify}>
                                    <Menu.Item key="modifyHeadImg">上传头像</Menu.Item>
                                    <Menu.Item key="modifyPW">修改密码</Menu.Item>
                                    <Menu.Item key="return">
                                            <Popconfirm title="确认退出吗？" onConfirm={this.confirm} onCancel={this.cancel} okText="是" cancelText="否"><a href="#">退出</a></Popconfirm>
                                    </Menu.Item>
                                </Menu>}>
                                <a className="ant-dropdown-link" style={{color:'white',marginLeft:'10px'}}>欢迎，{Store.get(storekeyname.personIfo).user.name}
                                    <Icon type="down" />
                                </a>
                            </Dropdown>
                       </span>

                </Header>
                <Layout>
                    <Sider width={200} style={{background: '#fff'}}>
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={['item1']}
                            defaultOpenKeys={['sub1']}
                            style={{height: '100%', borderRight: 0}}
                            mode="inline"
                            theme="dark"
                            onClick={this.handleClick}
                        >
                            {/* <SubMenu key='sub1' title={<span><Icon type="desktop"/>首页</span>}> */}
                                <Menu.Item key='item1'><span><Icon type="desktop"/>首页</span></Menu.Item>
                             {/* </SubMenu> */}
                             {list(this.state.menusList)}
                            {/* {this.state.menusList.map((listModel) =>
                                <SubMenu key={listModel.id} title={<span><Icon type="desktop"/>{listModel.name}</span>}>
                                    {listModel.childList.map((detailModel) =>
                                        <Menu.Item key={detailModel.id}>{detailModel.name}</Menu.Item>
                                    )}
                             </SubMenu>
                            )} */}
                        </Menu>
                    </Sider>
                    <Layout style={{padding: '0 24px 24px'}}>
                        <Breadcrumb style={{margin: '16px 0'}}>
                            <Breadcrumb.Item>{this.state.iframeName}</Breadcrumb.Item>
                        </Breadcrumb>
                        <Content
                            style={{
                                background: '#fff',
                                padding: 24,
                                margin: 0,
                                minHeight: 280,
                            }}
                        >
                            {componment}
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        )
    }
}

const Main=withRouter(indexP);

class MainPage extends Component {
    render() {
        return (
            <HashRouter>
                <main className='divSum'>
                    <Switch>
                        <Route exact path='/indexP' component={Main}/>
                        <Route path='/' component={Home}/>
                    </Switch>
                </main>
            </HashRouter>
        );
    }
}
export default MainPage;
