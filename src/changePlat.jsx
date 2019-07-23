import {Popconfirm, message, Table} from 'antd';
import React from 'react';
// import {Button} from 'antd';
import './App2.css';
// import ReactDOM from 'react-dom';
// 由于 antd 组件的默认文案是英文，所以需要修改为中文
// import zhCN from 'antd/lib/locale-provider/zh_CN';
import 'antd/dist/antd.css';
// import Axios from 'axios';
import myUtils from './myUtils';
import storekeyname from './storeKeyName';
import Store from './store';


class ChangeSchool extends React.Component {
  state = {
    data: [],
    pagination: {},
    loading: false,
  };

  componentDidMount() {
    this.fetch();
  }

  handleDelete = (record) => {
    console.log('handleDelete'+JSON.stringify(record));
    var comData1 = {
      unit_code: record.id, //单位代码
      access_token: Store.get(storekeyname.personIfo).access_token //用户令牌
    }
    myUtils.post(0, 'api/school/def', comData1, data => {
      if (data.code === '0000') {
        let tempInfo = Store.get(storekeyname.personIfo);
        tempInfo.user.school_name = record.name;
        tempInfo.user.school_code = record.id;
        tempInfo.modifyFlag = 2;//1切换单位，2切换平台
        Store.set(storekeyname.personIfo, tempInfo);
        window.parent.postMessage(JSON.stringify(Store.get(storekeyname.personIfo)),'*');
      } else {
          message.error(data.msg);
      }
    });
  };

  fetch = (params = {}) => {
    console.log('params:', params);
    this.setState({ loading: true });
    var comData1 = {
      platform_code: storekeyname.PLATFORMCODE, //平台代码
      app_code: storekeyname.APPCODE, //应用系统代码
      pageNumber:'1',//分页页码
      pageSize:'999',//每页数据条数
      access_token: Store.get(storekeyname.personIfo).access_token //用户令牌
  }
  myUtils.post(0, 'api/school/list', comData1, data => {
      if (data.code === '0000') {
        for (let index = 0; index < data.data.length; index++) {
          const element = data.data[index];
          element.key = element.id;
          if (element.id.toString() === Store.get(storekeyname.personIfo).user.school_code.toString()) {
            element.action = '当前学校';
          } else {
            element.action = '设为此学校';
          }
        }
        const pagination = { ...this.state.pagination };
        pagination.total = data.totalCount;
        this.setState({
          loading: false,
          data: data.data,
          pagination,
        });
      } else {
          message.error(data.msg);
      }
  });
  };

  render() {
    const columns = [
      {
        title: '学校名称',
        dataIndex: 'name',
        width: 200,
      },
      {
        title: '平台代码',
        dataIndex: 'platform_code',
        width: 100,
      },
      {
        title: '学校代码',
        dataIndex: 'code',
        width: 100,
      },
      // {
      //   title: '是否删除',
      //   dataIndex: 'del',
      //   width: 100,
      // },
      // {
      //   title: '学校id',
      //   dataIndex: 'id',
      //   width: 100,
      // },
      {
        title: '排序',
        dataIndex: 'sort',
        width: 100,
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: 100,
      },
      {
        title: '操作',
        // key: 'action',
        width: 100,
        render: (record) =>
            <Popconfirm title="确定切换为当前学校?" onConfirm={ ()=>this.handleDelete(record)}>
                <a href="javascript:;">{record.action}</a>
            </Popconfirm>
      },
    ];
    return (
      <Table
        bordered
        columns={columns}
        rowKey={record => record.id}
        dataSource={this.state.data}
        pagination={this.state.pagination}
        loading={this.state.loading}
      />
    );
  }
}

export default ChangeSchool;
