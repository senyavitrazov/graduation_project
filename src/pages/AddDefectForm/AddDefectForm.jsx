import React, { useContext, useState } from 'react';
import styles from './AddDefectForm.module.scss';
import { Form, Input, Select, Button,  Divider, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../App';
const { Option } = Select;

function formatDate(timestamp) {
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);
  const seconds = ("0" + date.getSeconds()).slice(-2);

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const AddDefectForm = ({project, ...props}) => {
  const { serverUrl } = useContext(GlobalContext);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const defectData = {
        defect_title: values.title,
        description: values.description,
        severity: values.severity,
        priority: values.priority,
        project: project._id,
      };
      console.log(defectData);
      const response = await fetch(`${serverUrl}/defects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(defectData),
      });
      if (response.ok) {
        message.success('Defect created successfully');
        navigate(-1);
      } else {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('Failed to create defect');
    } finally {
      setLoading(false);
    }
  };


  return(
    <>
    <Divider style={{marginTop: 24}}>New Defect</Divider>
    <Form style={{width: '100%'}}
        form={form}
        layout="vertical"
        onFinish={handleSubmit} 
        name="defect_form"
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: 'Please input the title!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
        >
          <Input.TextArea style={{height: '120px'}}/>
        </Form.Item>
        <Form.Item
          name="severity"
          label="Severity"
          rules={[{ required: true, message: 'Please select the severity!' }]}
        >
          <Select>
            <Option value="critical">Critical</Option>
            <Option value="major">Major</Option>
            <Option value="average">Average</Option>
            <Option value="minor">Minor</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="priority"
          label="Priority"
          rules={[{ required: true, message: 'Please select the priority!' }]}
        >
          <Select>
            <Option value="high">High</Option>
            <Option value="medium">Medium</Option>
            <Option value="low">Low</Option>
          </Select>
        </Form.Item>
        <div className={styles['button-container']}>
            <Button type="default" htmlType="button" onClick={() => {
              navigate(-1)
              message.error('Creation was canceled');
            }
              }>Cancel</Button>
            <Button type="primary" id={styles['create-button']} htmlType="submit" loading={loading}>Create</Button>
          </div>
      </Form>
    </>
  );
}

export default AddDefectForm;
