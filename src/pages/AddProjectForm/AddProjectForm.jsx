import React, { useContext, useState } from 'react';
import { Button, Form, Input, message} from 'antd';
import PageWrapper from '../../components/wrappers/PageWrapper/PageWrapper';
import PageHeader from '../../components/PageHeader/PageHeader';
import PageContainer from '../../components/wrappers/PageContainer/PageContainer';
import { DebounceSelect } from './UserSelect';
import { GlobalContext } from '../../App';
import styles from './AddProjectForm.module.scss';
import { useNavigate } from 'react-router-dom';


const AddProjectForm = () => {
  const { serverUrl } = useContext(GlobalContext);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  async function fetchUserList(username) {
    const response = await fetch(`${serverUrl}/users?login=${username}`);
    const data = await response.json();
    return data.map((user) => ({
      label: user.credentials.login,
      value: user._id,
    }));
  }

  message.config({
    top: '10vh',
  });

  const handleSubmit = async (values) => {
    try {
      const response = await fetch(`${serverUrl}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project_title: values.title,
          description: values.description,
          list_of_users_with_access: selectedUsers.map(e => e.value),
        }),
      });
      if (response.ok) {
        message.success('Project created successfully!');
        form.resetFields();
        setSelectedUsers([]);
      } else {
        message.error('Failed to create project');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      message.error('Failed to create project');
    }
  };

  return (
    <PageWrapper>
      <PageHeader backButton={true}>Add new Project</PageHeader>
      <PageContainer className={styles['page-container']}>
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
            <Input.TextArea style={{height: '120px'}}/>
          </Form.Item>
          <Form.Item
            label="Set a defect access for users"
            name="searchUsers"
          >
            <DebounceSelect
              mode="multiple"
              value ={selectedUsers}
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
          <div className={styles['button-container']}>
            <Button type="default" htmlType="button" onClick={() => {
              navigate(-1)
              message.error('Creation was canceled');
            }
              }>Cancel</Button>
            <Button type="primary" style={{background: '#D31C40', boxShadow: 'none'}} htmlType="submit">Create</Button>
          </div>
        </Form>
      </PageContainer>
    </PageWrapper>
  );
};

export default AddProjectForm;
