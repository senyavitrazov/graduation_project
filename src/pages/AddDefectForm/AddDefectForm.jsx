import React, { useContext, useEffect, useState } from 'react';
import styles from './AddDefectForm.module.scss';
import { Form, Input, Select, Button,  Divider, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../App';
const { Option } = Select;

const AddDefectForm = ({project, onCreateDefect, defect, ...props}) => {
  const { serverUrl } = useContext(GlobalContext);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    if (defect) {
      form.setFieldsValue({
        title: defect.defect_title,
        description: defect.description,
        severity: defect.severity,
        priority: defect.priority,
      });
    }
  }, [defect, form]);


  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const defectData = {
        defect_title: values.title,
        description: values.description,
        severity: values.severity,
        priority: values.priority,
      };
      if (!defect) defectData['project'] = project._id;
      let url = `${serverUrl}/defects`;
      let method = 'POST';
      if (defect) {
        url = `${serverUrl}/defects/${defect._id}`;
        method = 'PATCH';
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(defectData),
      });

      if (response.ok) {
        const updatedDefect = await response.json();
        const action = defect ? 'updated' : 'created';
        message.success(`Defect ${action} successfully`);
        if (!defect) onCreateDefect(updatedDefect.defect);
        navigate(-1);
      } else {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('Failed to save defect');
    } finally {
      setLoading(false);
    }
  };

  return(
    <>
    <Divider style={{marginTop: 24}}>{!defect ? 'New Defect' : 'Edit Defect'}</Divider>
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
              message.error('Action canceled');
            }
              }>Cancel</Button>
            <Button type="primary" id={styles['create-button']} htmlType="submit" loading={loading}>{!defect ? 'Create' : 'Edit'}</Button>
          </div>
      </Form>
    </>
  );
}

export default AddDefectForm;
