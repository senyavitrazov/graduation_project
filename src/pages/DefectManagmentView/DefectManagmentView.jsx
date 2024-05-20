import React from 'react';
import styles from './DefectManagmentView.module.scss';
import { useContext, useEffect, useState } from 'react';
import { Form, Select, Table, message } from 'antd';
import { GlobalContext } from '../../App';
import PageContainer from '../../components/wrappers/PageContainer/PageContainer';
import PageHeader from '../../components/PageHeader/PageHeader';
import Pagination from '../../components/Pagination/Pagination';
import Search from 'antd/es/input/Search';
import PageWrapper from '../../components/wrappers/PageWrapper/PageWrapper';
import UserService from '../../services/UserService';
import columns from './columns';


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
    let url = `/defects?page=${page}&limit=${pageSize}&search=${query}`;
    if (priority) url += `&priority=${priority}`;
    if (severity) url += `&severity=${severity}`;
    UserService.getDefects(url)
    .then(data => {
      if (data && typeof data === 'object') {
        setDefects(data.defects || []);
        setTotalAmount(data.count || 0);
      } else {
        setDefects([]);
        setTotalAmount(0);
      }
      setLoading(false);
    })
    .catch(error => {
      if (error.message === 'Not authorized') {
        message.error('Authorization failed. Please log in again.');
      } else {
        message.error('Failed to fetch projects.');
      }
    });
  };

  return (<PageWrapper className={styles.DefectManagmentView}>
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
        key={'defects_pagingation'}
        className={styles['pagination-bar']}
        totalCount={totalAmount}
        pageSize={sizeOfPage}
        fetchData={(page) => fetchData(page, sizeOfPage)}
        serverUrl={serverUrl}
      />
    </PageContainer>
  </PageWrapper>);
};

export default DefectManagmentView;
