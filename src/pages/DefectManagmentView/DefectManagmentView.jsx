import React from 'react';
import styles from './DefectManagmentView.module.scss';
import { useContext, useEffect, useState } from 'react';
import { Badge, Dropdown, Form, Menu, Select, Table } from 'antd';
import { GlobalContext } from '../../App';
import PageContainer from '../../components/PageContainer/PageContainer';
import PageHeader from '../../components/PageHeader/PageHeader';
import Pagination from '../../components/Pagination/Pagination';
import Search from 'antd/es/input/Search';
import Link from 'antd/es/typography/Link';
import { DownOutlined } from '@ant-design/icons';
const classNames = require('classnames');

function getBadgeStatus(type_of_state) {
  switch (type_of_state) {
    case "open":
      return "default";
    case "in_progress":
      return "processing";
    case "fixed":
      return "success";
    default:
      return "default";
  }
}

const columns = [
  {
    title: 'Status',
    dataIndex: 'current_state',
    key: 'status',
    render: (state) => state ? 
      <Badge status={getBadgeStatus(state.type_of_state)} 
        className={styles.badge}
        text={(state.type_of_state.toUpperCase()[0] +  state.type_of_state.slice(1)).replace('_', ' ')}/>
      : null,
      width: 120,
  },
  {
    title: 'Defect',
    dataIndex: 'defect_title',
    key: 'defect',
    render: (text, record) => <Link ellipsis={true}>{text}</Link>,
    width: '25%',
  },
  {
    title: 'Project',
    dataIndex: 'project',
    key: 'project',
    render: (project) => project ? <Link ellipsis={true}>{project.project_title}</Link> : null,
    responsive: ['xl']
  },
  {
    title: 'Priority',
    dataIndex: 'priority',
    key: 'priority',
    render: (priority) => priority ? 
      <Badge status='error' text={priority.toUpperCase()[0] +  priority.slice(1)}/>
      : null,
    width: 200,
    responsive: ["sm"]
  },
  {
    title: 'Severity',
    dataIndex: 'severity',
    key: 'severity',
    render: (e) => e ? 
      <Badge status='error' text={e.toUpperCase()[0] +  e.slice(1)}/>
      : null,
    width: 200,
    responsive: ["sm"]
  },
  {
    title: 'Action',
    dataIndex: 'action',
    key: 'action',
    width: 140,
    render: (text = 'Action', record) => (
      <Dropdown overlay={menu(record)} className={styles['action-container']} trigger={['click']}>
        <span className={classNames("ant-dropdown-link", styles['action-link'])}>
          {text} <DownOutlined style={{ fontSize: '1rem'}}/>
        </span>
      </Dropdown>
    ),
  }
];

const menu = (record) => {
  console.log(record);
  return (
  <Menu>
    <Menu.Item key="1">
      <a href={`/edit-defect/${record._id}`}>Edit Defect</a>
    </Menu.Item>
    <Menu.Item key="2">
      <a href={`/view-defect/${record._id}`}>View Defect</a>
    </Menu.Item>
    <Menu.Item key="3">
      <a href={`/view-project/${record._id}`}>View Project</a>
    </Menu.Item>
    <Menu.Item key="4">
      <a href={`/`}>Archive Defect</a>
    </Menu.Item>
  </Menu>)
};


const DefectManagmentView = () => {
  const [defects, setDefects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState(1);
  const [priority, setPriority] = useState(undefined);
  const [severity, setSeverity] = useState(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const { serverUrl } = useContext(GlobalContext);
  const sizeOfPage = 11; 

  useEffect(() => {
    fetchData(1, sizeOfPage);
  }, []);

  const handleClearFilters = () => {
    setSearchQuery('');
    setPriority(undefined);
    setSeverity(undefined);
    fetchData(1, sizeOfPage, '', '', '');
  };

  const fetchData = (page, pageSize, query = '', priority, severity) => {
    setLoading(true);
    let url = `${serverUrl}/defects?page=${page}&limit=${pageSize}&search=${query}`;
    if (priority) url += `&priority=${priority}`;
    if (severity) url += `&severity=${severity}`;
    fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "Accept": "application/json",
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setDefects(data.defects);
        setTotalAmount(data.count);
        setLoading(false);
      })
      .catch(error => {
        console.log(error);
      });
  };
  return (<div className={styles.DefectManagmentView}>
    <PageHeader subtitle={'Track defects and projects'}>Dashboard</PageHeader>
    <PageContainer className={styles.content}>
      <div className={styles['filter-container']}>
        <div className={styles['search-subcontainer']}>
          <Search placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onSearch={(value) => {
              setSearchQuery(value);
              fetchData(1, sizeOfPage, value, priority, severity)
            }}/>
        </div>
        <Form className={styles['filter-subcontainer']} layout="inline">
          <Form.Item label="Priority">
            <Select style={{width: 140}} placeholder="Any priority" value={priority} onChange={(value) => setPriority(value)}>
              <Select.Option value="High"></Select.Option>
              <Select.Option value="Medium"></Select.Option>
              <Select.Option value="Low"></Select.Option>
              <Select.Option value={null}>Any priority</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Severity">
            <Select style={{width: 140}} placeholder="Any severity" value={severity} onChange={(value) => setSeverity(value)}>
              <Select.Option value="Critical"></Select.Option>
              <Select.Option value="Major"></Select.Option>
              <Select.Option value="Average"></Select.Option>
              <Select.Option value="Minor"></Select.Option>
              <Select.Option value={null}>Any severity</Select.Option>
            </Select>
          </Form.Item>
          <div className={styles['button-container']}>
            <button onClick={() => {handleClearFilters()}}>Clear</button>
            <button onClick={() => {
              fetchData(1, sizeOfPage, searchQuery, priority, severity)
            }}>Apply Filters</button>
          </div>  
        </Form>
      </div>  
      <Table
        rowKey={e => e._id}
        scroll={{ y: 627 }}
        className={styles.table}
        loading={loading} 
        columns={columns}
        dataSource={defects}
        expandable={{
          expandedRowRender: (record) => (
            <p
              style={{
                margin: 0,
                fontSize: 14,
                marginLeft: 50,
              }}
            >
              {record.description}
            </p>
          ),
          rowExpandable: (record) => record.name !== '',
        }}
        pagination={false}> 
      </Table>
      <Pagination
        className={styles['pagination-bar']}
        totalCount={totalAmount}
        pageSize={sizeOfPage}
        fetchData={(page) => fetchData(page, sizeOfPage)}
        serverUrl={serverUrl}
      />
    </PageContainer>
  </div>);
};

export default DefectManagmentView;
