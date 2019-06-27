import React, {Component} from 'react';
import {Layout, Menu, Breadcrumb, Icon, Avatar,message, Dropdown, Popconfirm} from 'antd';
import {BrowserRouter,HashRouter, Route, Switch, withRouter} from 'react-router-dom';
import './App2.css';
import storekeyname from './storeKeyName';
import Store from './store';
import Iframe from 'react-iframe';
import myUtils from './myUtils';
import Home from './test1';
import App11 from './test2';

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
                    height="500px"
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
//         fra.setUrl('http://localhost:3000/test3');
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

window.addEventListener('message', function(ev) {
    // if (ev.source !== window.parent) {return;}
    var data = ev.data;
    console.info('message from parent test3:', data);
}, false);

let fra=null;
class test3 extends Component {
    constructor(props) {
        super(props);
        this.state = {menusList:[],iframeName:'首页',
            type:"iframe",
        };
    }
    componentDidMount() {
        var comData1 = {
            platform_code: storekeyname.PLATFORMCODE, //平台代码
            app_code: storekeyname.APPCODE, //应用系统代码
            access_token: Store.get(storekeyname.personIfo).access_token //用户令牌
        }
        console.log('comData11111111:' + JSON.stringify(comData1));
        myUtils.post(0, 'api/acl/menu', comData1, res1 => {
            if (res1.code === '0000') {
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
        setTimeout(function () {
            console.log(fra)
            for (let index = 0; index < that.state.menusList.length; index++) {
                const element = that.state.menusList[index];
                for (let a = 0; a < element.childList.length; a++) {
                    const element1 = element.childList[a];
                    console.log('e.key:'+e.key+',element1.id:'+element1.id);
                    if (e.key.toString() === 'item1') {
                        fra.setUrl('https://www.baidu.com');
                        that.setState({
                            iframeName:'首页'
                        });
                    }else if (e.key.toString() === element1.id.toString()) {
                        let url = element1.url + '?token='+ Store.get(storekeyname.personIfo).access_token;
                        console.log('url:'+url);
                        fra.setUrl(url);
                        // window.postMessage(JSON.stringify(Store.get(storekeyname.personIfo)),'http://localhost:3000');
                        window.parent.postMessage('12312312312', '*'); // 触发父页面的message事件
                        // parent.postMessage(JSON.stringify(Store.get(storekeyname.personIfo)),'http://localhost:3000');
                        that.setState({
                            iframeName:element1.name
                        });
                    }
                }
            }
        },500)
    }
    confirm=e=>{
        console.log(e);
        Store.set(storekeyname.personIfo, {});
        // message.success('Click on Yes');
        let taa = this.props.history;
        taa.push('/');
      }
      
      cancel=e=> {
        console.log(e);
        // message.error('Click on No');
      }
      onClickModify = ({ key }) => {
        console.log('key:'+key);
        if (key === 'modifyPW') {
            this.setState({
                type:"modifyPW"
            })
        }
      }

    render() {
        let type=this.state.type;
        let componment=null;
        if(type=="iframe"){
            componment=<MyIframe ref={(node)=>fra=node}/>;
        }else if(type=="modifyPW"){
            componment=<App11 ref={(node)=>fra=node}/>
        }
        return (
            <Layout style={{height:'100%'}}>
                <Header className="header">
                    <div className="logo"/>
                       <Avatar size="large" style={{marginTop: '-10px'}} src={Store.get(storekeyname.personIfo).user.img_url}/>
                       <span style={{marginLeft: '20px', fontSize: '25px',color:'white'}}>{Store.get(storekeyname.personIfo).user.school_name}</span>
                       <span style={{float:'right'}}> 
                            <Avatar size="large" style={{marginTop: '0px',width:'25px',height:'25px'}} src={Store.get(storekeyname.personIfo).user.img_url}/>
                            <Dropdown overlay={<Menu onClick={this.onClickModify}>
                                                    <Menu.Item key="modifyPW">修改密码</Menu.Item>
                                                    <Menu.Item key="return">
                                                        <Popconfirm title="确认退出吗？" onConfirm={this.confirm} onCancel={this.cancel} okText="是" cancelText="否"><a href="#">退出</a></Popconfirm>
                                                    </Menu.Item>
                                                </Menu>}>
                                <a className="ant-dropdown-link" style={{color:'white',marginLeft:'10px'}} href="#">欢迎，{Store.get(storekeyname.personIfo).user.name} 
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
                            onClick={this.handleClick}
                        >
                            {/* <SubMenu key='sub1' title={<span><Icon type="user"/>首页</span>}> */}
                                <Menu.Item key='item1'><span><Icon type="user"/>首页</span></Menu.Item>
                             {/* </SubMenu> */}
                            {this.state.menusList.map((listModel) =>
                                <SubMenu key={listModel.id} title={<span><Icon type="user"/>{listModel.name}</span>}>
                                    {listModel.childList.map((detailModel) =>
                                        <Menu.Item key={detailModel.id}>{detailModel.name}</Menu.Item>
                                    )}
                             </SubMenu>
                            )}
                        </Menu>
                    </Sider>
                    <Layout style={{padding: '0 24px 24px'}}>
                        <Breadcrumb style={{margin: '16px 0'}}>
                            <Breadcrumb.Item>{this.state.iframeName} {Store.get(storekeyname.personIfo).access_token}</Breadcrumb.Item>
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
  
const Main=withRouter(test3);

class MainPage extends Component {
    render() {
        return (
            <HashRouter>
                <main className='divSum'>
                    <Switch>
                        <Route exact path='/test3' component={Main}/>
                        <Route path='/' component={Home}/>
                    </Switch>
                </main>
            </HashRouter>
        );
    }
}
export default MainPage;