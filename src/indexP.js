import React, {Component} from 'react';
import {Layout, Menu, Breadcrumb, Icon, Avatar,message, Dropdown, Popconfirm,Modal,Row,Col} from 'antd';
import {BrowserRouter,HashRouter, Route, Switch, withRouter} from 'react-router-dom';
import './App2.css';
import storekeyname from './storeKeyName';
import Store from './store';
import Iframe from 'react-iframe';
import myUtils from './myUtils';
import Home from './test1';

import App11 from './test2';
import ModifyHeadImg from "./modify_headimage/head_image";
import ChangeSchool from "./changeSchool";

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
            platName:Store.get(storekeyname.personIfo).user.platform_name,//平台名称
            schoolName:Store.get(storekeyname.personIfo).user.school_name,//学校名称
            headImg:Store.get(storekeyname.personIfo).user.img_url+'?'+Math,//头像
            menusList:[],
            detailList:[],
            iframeName:'首页',
            type:"iframe",
            MenuKey:'1',
            detailMenuKey:'1',
        };
    }
    componentDidMount() {
        let that =this;
        window.addEventListener('message', function(ev) {
            var data = ev.data;
            console.info('message from parent indexP:', data);
            
            if (Store.get(storekeyname.personIfo).modifyFlag === 1) {
                let tempInfo = Store.get(storekeyname.personIfo);
                tempInfo.modifyFlag = 9;//1切换单位，2切换平台
                Store.set(storekeyname.personIfo, tempInfo);
                that.setState({
                    platName:Store.get(storekeyname.personIfo).user.platform_name,//平台名称
                    schoolName:Store.get(storekeyname.personIfo).user.school_name,//学校名称
                });
                window.location.reload(true);
            } else if (Store.get(storekeyname.personIfo).modifyFlag === 2) {
                
            }
        }, false);

        // 获取菜单
        this.getMenusList();
    }
    getMenusList = ()=>{
        var comData1 = {
            platform_code: storekeyname.PLATFORMCODE, //平台代码
            app_code: storekeyname.APPCODE, //应用系统代码
            unit_code:Store.get(storekeyname.personIfo).user.school_code, //单位代码
            access_token: Store.get(storekeyname.personIfo).access_token //用户令牌
        }
        console.log('comData11111111:' + JSON.stringify(comData1));
        myUtils.post(0, 'api/acl/menu', comData1, res1 => {
            if (res1.code === '0000') {
                if (res1.data.length>0) {
                    this.setState({
                        menusList: res1.data[0].childList,
                        detailList: res1.data[0].childList[0].childList,
                        MenuKey:res1.data[0].childList[0].id.toString(),
                        detailMenuKey:'item1'
                    });
                } else {
                    Modal.error({
                        title: '当前账号无权限'
                      });

                }
            } else {
                message.error(res1.msg);
            }
        });
    }
    changeMenus=(e)=>{
        console.log('changeMenus.e.key:'+e.key);
        for (let index = 0; index < this.state.menusList.length; index++) {
            const element = this.state.menusList[index];
            if(e.key.toString() === element.id.toString()){
                this.setState({
                    detailList: element.childList
                });
                fra.setUrl('https://www.baidu.com');
                this.setState({
                    iframeName:'默认百度首页',
                    MenuKey:element.id.toString(),
                    detailMenuKey:'item1'
                });
            }
        }
    }

    handleClick=e=>{
        console.log('e.key:'+e.key);
        this.setState({
            type:"iframe"
        });
        this.clickMenus(e.key,this.state.detailList);
    }
    clickMenus = (key,list)=>{
        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            if (key.toString() === 'item1') {
                fra.setUrl('https://www.baidu.com');
                this.setState({
                    iframeName:'默认百度首页',
                    detailMenuKey:'item1'
                });
            }else if (key.toString() === element.id.toString()) {
                if (element.url == null) {
                    message.error('当前应用系统无法使用，请联系管理员');
                } else {
                    let url = element.url + '?access_token='+ Store.get(storekeyname.personIfo).access_token;
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
                    this.setState({
                        iframeName:element.name,
                        detailMenuKey:element.id.toString()
                    });
                }
            }else{
                this.clickMenus(key,element.childList);
            }
        }
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
          console.log('onClickModify.key:'+key);
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
      changeSchool = ({key}) =>{
        console.log('changeSchool.key:'+key);
        this.setState({
            type:"changeSchool"
        })
      }

      onImgChange=(url)=>{
          this.setState({
              headImg:url+'?imgid='+Math,
              type:"iframe"
          })
      }

      renderMenuItems(detailList = this.state.detailList, level = 0) {
        return detailList.map((menu) => {
          if (menu.childList && menu.childList.length) {
            return (
              <Menu.SubMenu key={menu.id} title={menu.name}>
                {this.renderMenuItems(menu.childList, level + 1)}
              </Menu.SubMenu>
            )
          } else {
            return (
              <Menu.Item key={menu.id}>{menu.name}</Menu.Item>
            )
          }
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
        }else if(type=="changeSchool"){
            componment=<ChangeSchool ref={(node)=>fra=node}/>
        }
        return (
            <Layout style={{height:'100%'}}>
                <Header className="header" style={{lineHeight:'55px',height:'55px'}}>
                    {/* <div className="logo"/> */}
                    <Row style={{lineHeight:'44px'}}>
                        <Col span={4}>
                            {/* <Avatar size="large" style={{marginTop: '-10px'}} src={this.state.headImg}/> */}
                            <span style={{marginLeft: '0px',marginTop:'22px', fontSize: '25px',color:'white'}}>{this.state.platName}</span>
                        </Col>
                        <Col span={11}>
                            <Menu
                                theme="dark"
                                mode="horizontal"
                                selectedKeys={[this.state.MenuKey]}
                                width='200px'
                                style={{ lineHeight: '55px',whiteSpace:'nowrap' }}
                                onClick={this.changeMenus}
                            >
                                {this.state.menusList.map((menusModel) =>
                                        <Menu.Item key={menusModel.id}>{menusModel.name}</Menu.Item>
                                    )}
                            </Menu>
                        </Col>
                        <Col span={5}>
                            <span style={{marginLeft: '0px', fontSize: '18px',color:'white'}}>{this.state.schoolName}
                                <a onClick={this.changeSchool.bind(this)} key='changeSchool' style={{fontSize:'15px'}}>【切换】</a>
                            </span>
                        </Col>
                        <Col span={4}>
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
                       </Col>
                    </Row>

                </Header>
                <Layout>
                    <Sider width={200} style={{background: '#fff',overflow:'auto'}}>
                        <Menu
                            defaultSelectedKeys={['item1']}
                            selectedKeys={[this.state.detailMenuKey]}
                            style={{height: '100%', borderRight: 0,lineHeight: '44px'}}
                            mode="inline"
                            theme="dark"
                            onClick={this.handleClick}
                        >
                            <Menu.Item key='item1'><span><Icon type="desktop"/>首页</span></Menu.Item>
                            {this.renderMenuItems()}
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
