import React, { useContext, useEffect, useState } from 'react';
import { Button, Divider, Form, Input, message} from 'antd';
import PageWrapper from '../../components/wrappers/PageWrapper/PageWrapper';
import PageHeader from '../../components/PageHeader/PageHeader';
import PageContainer from '../../components/wrappers/PageContainer/PageContainer';
import { DebounceSelect } from './UserSelect';
import { GlobalContext } from '../../App';
import styles from './AddProjectForm.module.scss';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';


const AddProjectForm = ({ project, onEditProject }) => {
  const { serverUrl } = useContext(GlobalContext);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [usersLoaded, setUsersLoaded] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const cookies = new Cookies();
  const current_user = cookies.get('user');
  
  useEffect(() => {
    if (project) {
      form.setFieldsValue({
        title: project.project_title,
        description: project.description,
      });
      setSelectedUsers(project.list_of_users_with_access.map(
        user => ({ label: user.credentials.login, value: user._id })
      ));
    }
    if (!usersLoaded) {
      setUsersLoaded(true);
    }
  }, [project]);

  useEffect(()=>{
    console.log(selectedUsers);
  }, [selectedUsers])

  async function fetchUserList(username) {
    const response = await fetch(`${serverUrl}/users?login=${username}`);
    const data = await response.json();
    return data.map((user) => ({
      label: user.credentials.login,
      value: user._id,
    }));
  }

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      let url = `${serverUrl}/projects`;
      let method = 'POST';
      if (project) {
        url = `${serverUrl}/projects/${project._id}`;
        method = 'PATCH';
      }

      let updatedUsers = [...selectedUsers];
      console.log('before update', updatedUsers);
      if (updatedUsers.length < 1) {
        updatedUsers = [{ value: current_user.id }];
      } else if (!updatedUsers.some(user => user.value === current_user.id)) {
        updatedUsers.push({ value: current_user.id });
      }

      console.log('before response', updatedUsers);
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project_title: values.title,
          description: values.description,
          list_of_users_with_access: updatedUsers.map(e => e.value),
        }),
      });
      if (response.ok) {
        console.log(response);
        message.success(project 
          ? 'Project updated successfully!' 
          : 'Project created successfully!');
        form.resetFields();
        setSelectedUsers([]);
        if (onEditProject) {
          onEditProject();
        }
      } else {
        console.log(response);
        message.error(project ? 'Failed to update project' : 'Failed to create project');
      }
    } catch (error) {
      console.error('Error creating/updating project:', error);
      message.error(project ? 'Failed to update project' : 'Failed to create project');
    } finally {
      setLoading(false);
      navigate(-1);
    }
  };

  return (
    <PageWrapper>
      {!project 
        ? (<PageHeader backButton={true}>{project ? 'Edit Project' : 'Add New Project'}</PageHeader>) 
        : (<Divider children={'Edit Project'}/>)}
      <PageContainer className={!project ? styles['page-container'] : styles['page-container-edit']}>
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
          className={styles['form']}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: 'Please enter a title!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
          >
            <Input.TextArea style={{ height: '120px' }} />
          </Form.Item>
          {(usersLoaded) && (
            <Form.Item
              label="Set a defect access for users"
              name="searchUsers"
            >
              <DebounceSelect
                mode="multiple"
                initialValue={selectedUsers}
                placeholder="Select users"
                fetchOptions={fetchUserList}
                onChange={(newValue) => {
                  setSelectedUsers(newValue);
                }}
                style={{
                  width: "100%",
                }}
              />
            </Form.Item>
          )}
          <div className={styles['button-container']}>
            <Button type="default" htmlType="button" onClick={() => {
              navigate(-1);
              message.error('Operation was canceled');
            }
            }>Cancel</Button>
            <Button type="primary" id={styles['create-button']} htmlType="submit" loading={loading}>{project ? 'Update' : 'Create'}</Button>
          </div>
        </Form>
      </PageContainer>
    </PageWrapper>
  );
};

export default AddProjectForm;
