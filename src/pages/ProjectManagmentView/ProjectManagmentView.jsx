import React, { useContext, useEffect, useState } from 'react';
import styles from './ProjectManagmentView.module.scss';
import PageContainer from '../../components/wrappers/PageContainer/PageContainer';
import PageHeader from '../../components/PageHeader/PageHeader';
import Pagination from '../../components/Pagination/Pagination';
import { GlobalContext } from '../../App';
import { Progress, Table, Tag, Form, Radio, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Link from 'antd/es/typography/Link';
import Search from 'antd/es/input/Search';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../components/wrappers/PageWrapper/PageWrapper';
import UserService from '../../services/UserService';

const columns = [
  {
    title: 'Project',
    dataIndex: 'project_title',
    key: 'project_title',
    render: (text, record) => <Link href={`projects/${record._id}`} ellipsis={true}>{text}</Link>,
    width: '20%',
  },
  {
    title: 'Progress',
    key: 'progress',
    responsive: ['xl'],
    render: (_, record) => {
      const { list_of_defects } = record;
      const { progressPercentage, tasksExist } = calculateProgressAndTasksExistence(list_of_defects);
      return (
        <>
          {tasksExist ? (
            <Progress strokeColor={progressPercentage === 100 ? '' : '#e92748' } percent={progressPercentage} />
          ) : (
            <div style={{textAlign: 'center'}}>No defect-fixing tasks planned</div>
          )}
        </>
      );
    },
  },
  {
    title: 'Access to Defects',
    dataIndex: 'list_of_users_with_access',
    key: 'list_of_users_with_access',
    render: (_, { list_of_users_with_access }) => (
      <div className={styles['custom-column-class']}>
        {list_of_users_with_access.map((user) => {
          return (
            <Tag key={user.id}>
              {user.credentials.login.toUpperCase()}
            </Tag>
          );
        })}
      </div>
    ),
  },
  {
    title: 'Added',
    dataIndex: 'date_of_creation',
    key: 'date_of_creation',
    width: '20%',
  },
];

function calculateProgressAndTasksExistence(tasks) {
    if (!Array.isArray(tasks) || tasks.length === 0) {
        return {
            progressPercentage: 0,
            tasksExist: false
        };
    }

    const totalWeight = 2 * tasks.length;
    let completedWeight = 0;

    tasks.forEach(task => {
        if (task.current_state && task.current_state.type_of_state) {
            const state = task.current_state.type_of_state;
            if (state === "open") {
                completedWeight += 0;
            } else if (state === "in_progress") {
                completedWeight += 1;
            } else if (state === "fixed" || state === "archived") {
                completedWeight += 2;
            }
        }
    });

    const progressPercentage = Math.floor((completedWeight / totalWeight) * 100);

    return {
        progressPercentage: progressPercentage,
        tasksExist: true
    };
}

const ProjectManagementView = () => {
  const [totalAmount, setTotalAmount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [isCategoryArchived, setCategoryArchived] = useState('active');
  const { serverUrl } = useContext(GlobalContext);
  const navigate = useNavigate();
  const sizeOfPage = 12;

  const fetchData = async (page, pageSize, query = '') => {
    setLoading(true);
    let url = `/projects?page=${page}&limit=${pageSize}&search=${query}`;
    if (isCategoryArchived !== 'active') url += '&archived=true';
    try {
      const data = await UserService.getProjects(url);
      setProjects(data.projects || []);
      setTotalAmount(data.count || 0);
      setLoading(false);
    } catch (error) {
      console.log(error);
      if (error.message === 'Not authorized') {
        message.error('Authorization failed. Please log in again.');
      } else {
        message.error('Failed to fetch projects.');
        console.error('Fetch error:', error);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1, sizeOfPage);
  }, [isCategoryArchived]);

  const handleCategoryChange = (e) => {
    setCategoryArchived(e.target.value);
  };

  return (
  <PageWrapper className={styles['wrapper']}>
    <PageHeader>Project Management</PageHeader>
    <PageContainer className={styles.content}>
      <Form className={styles['filter-container']} layout="inline">
        <div className={styles['filter-subcontainer']}>
          <Radio.Group className={styles['radio-group']} 
              defaultValue={'active'}
              onChange={handleCategoryChange}>
            <Radio.Button value="active">Active</Radio.Button>
            <Radio.Button value="archived">Archived</Radio.Button>
          </Radio.Group>
          <div className={styles['search-container']}>
            <Search placeholder="Search"
              onSearch={(value) => {
                fetchData(1, sizeOfPage, value)
              }}
            />
          </div>
        </div>
        <Button
          onClick={() => {navigate('../projects/add')}}
          className={styles['add-project-button']}
          icon={<PlusOutlined/>}>Add new Project</Button>
      </Form>
      <Table
        key={'project-table'}
        rowKey={e => e._id}
        scroll={{ y: 672 }}
        className={styles.table}
        loading={loading} 
        columns={columns}
        dataSource={projects}
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
        key={'projects_pagingation'}
        className={styles['pagination-bar']}
        totalCount={totalAmount}
        pageSize={sizeOfPage}
        fetchData={(page) => fetchData(page, sizeOfPage)}
        serverUrl={serverUrl}
      />
    </PageContainer>
  </PageWrapper>);
};

export default ProjectManagementView;
