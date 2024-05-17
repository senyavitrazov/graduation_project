import React, { useContext, useEffect, useState } from 'react';
import styles from './DefectCard.module.scss';
import CardTitle from '../CardTitle/CardTitle';
import Cookies from 'universal-cookie';
import { CommentOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Badge, Button, Input, Modal, Tag, Timeline, Typography } from 'antd';
import { GlobalContext } from '../../App';
import { LoadingOutlined } from '@ant-design/icons';

function getBadgeStatus(type_of_state) {
  switch (type_of_state) {
    case "open":
      return "default";
    case "in_progress":
      return "processing";
    case "fixed":
    case "archived":
      return "success";
    default:
      return "default";
  }
}

function getSeverityColor(severity) {
  switch (severity) {
    case "critical":
      return "red";
    case "major":
      return "orange";
    case "average":
      return "green";
    default: //"minor"
      return "";
  }
}

function transformLogsToItems(logs, currentLogin) {
    const combinedLogs = [...logs.list_of_comments, ...logs.list_of_states];
    combinedLogs.sort((a, b) => new Date(a.date) - new Date(b.date));
    const items = combinedLogs.map((log, index) => {
        let item = {};
        const date = new Date(log.date);
        const formattedDate = date.toISOString().split('T')[0];
        if (index === 0) {
            item.children = `${formattedDate} Defect was created`;
        } else if (log.text_of_comment) {
          console.log('123:', log?.commenter?.credentials?.login);
            item.children =  (<>{formattedDate} {`Commented by user ${(log.commenter 
              ? (log?.commenter?.credentials?.login ? log.commenter.credentials.login : currentLogin)
              : 'developer')}`}<br/>
            {log.text_of_comment}</>);
            item.color = 'grey';
        } else if (log.type_of_state) {
            item.children = `${formattedDate} Defect state changed to ${log.type_of_state}`;
        }
        return item;
    });
    return items;
}


export function formatDate(timestamp) {
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);
  const seconds = ("0" + date.getSeconds()).slice(-2);

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const DefectCard = ({onUpdate, withoutTimeline, modifiable = true, ...props}) => {
  const navigate = useNavigate();
  const { serverUrl } = useContext(GlobalContext);
  const [defect, setDefect] = useState(props.defect)
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [open, setOpen] = useState(false);
  const [textOfComment, setTextOfComment] = useState('');
  const [status, setStatus] = useState(defect.current_state.type_of_state);
  const cookies = new Cookies();
  const currentLogin = cookies.get('user').credentials.login;

  const fetchDefect = async (id) => {
    try {
      const url = `${serverUrl}/defects/${defect._id}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const updatedDefect = await response.json();
      setDefect(updatedDefect);
      onUpdate(updatedDefect);
    } catch (error) {
      console.error('Error fetching defect:', error);
    }
  }

  const sendCommentToServer = (comment) => {
    setConfirmLoading(true);
    let url = `${serverUrl}/defects/${defect._id}`;
    fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          logs: {
            ...defect.logs,
            list_of_comments: [...defect.logs.list_of_comments, comment],
          }
        }),
    })
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        setConfirmLoading(false);
        fetchDefect();
        return response.json();
    })
    .then(data => {
      console.log('Response from server:', data);
    })
    .catch(error => {
        console.error(error);
        setConfirmLoading(false);
    });
  };


  useEffect(() => {
    const statusObj = {
      date: formatDate(Date.now()),
      type_of_state: status,
    };

    const updateStatusOnServer = async () => {
      try {
        const url = `${serverUrl}/defects/${defect._id}`;
        const response = await fetch(url, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            current_state: statusObj,
            logs: {
              ...defect.logs,
              list_of_states: [...defect.logs.list_of_states, statusObj],
            }
          }),
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        console.log('Status updated successfully on: ', status);
        fetchDefect();
      } catch (error) {
        console.error('Error updating status:', error);
      }
    };
    if (status !== defect.current_state.type_of_state) {
      updateStatusOnServer();
    }
  }, [status]);

  

  const handleStatusChange = () => {
    if (status === 'open') {
      setStatus('in_progress');
    } else {
      setStatus('fixed');
    }
  };

  const getNextStatus = () => {
    const status_list = ['open', 'in_progress', 'fixed'];
    const nextStatus = status_list[status_list.findIndex(s => s === status) + 1];
    if (nextStatus === 'fixed') return 'Set to fixed' 
    if (nextStatus === 'in_progress') return 'Set in progress'
    return 'Open'
  };

  const handleOk = async () => {
    const current_user = cookies.get('user');
    sendCommentToServer(
      {
        commenter: current_user.id,
        text_of_comment: textOfComment,
        date: formatDate(Date.now()),
      }
    );
    setTextOfComment('');
    setOpen(false);
  };
  const handleCancel = () => {
    setOpen(false);
  };


  return (
    <div style={props.style} className={styles['container']}>
      <div className={styles['metainfo']}>
        <CardTitle title={defect ? defect.defect_title : 'Loading...'} />
        {modifiable && (<div className={styles['btn-container']}>
          <Button type="primary" id={styles['edit-button']} 
            onClick={() => { navigate('/defects/' + defect._id  + '/edit') }} htmlType="button">Edit</Button>
          {(status !== 'archived') && (
            <>
              {(status === 'fixed') && (
                <>
                  <Button type="default" htmlType="button" onClick={() => setStatus('archived')} children={'Archive'}/>
                  <Button type="default" htmlType="button" onClick={() => setStatus('open')} children={'Reopen'}/>
                </>
              )}
              {(status !== 'fixed') && (
                <Button type="default" htmlType="button" onClick={handleStatusChange}>
                  {status ? getNextStatus() : 'Unknown status'}
                </Button>
              )}
            </>
          )}
          <Button type="default" htmlType="button" icon={<CommentOutlined/>} onClick={() => {setOpen(true)}}>Comment</Button>
        </div>)}
      </div>
      <div className={styles['char-container']}>
        <Badge status={getBadgeStatus(defect.current_state.type_of_state)} 
          className={styles.badge}
        />
        <p className={styles['status']}>{(status.toUpperCase()[0] +  status.slice(1)).replace('_', ' ')}</p>
        <Tag color={getSeverityColor(defect.severity)}>{defect.severity.toUpperCase()[0] + defect.severity.slice(1)}</Tag>
      </div>
      <Typography.Paragraph
          ellipsis={{
            rows: 3,
            expandable: 'collapsible',
            expanded,
            onExpand: (_, info) => setExpanded(info.expanded),
          }}
          copyable
          className={styles['description']}
        >
          {defect ? defect.description : 'Loading...'}
        </Typography.Paragraph>
        {withoutTimeline || <Timeline items={transformLogsToItems(defect.logs, currentLogin)} style={{marginTop: 36}}/>}
        <Modal
          title="Comment"
          centered
          open={open}
          onOk={handleOk}
          onCancel={handleCancel}
          okText={confirmLoading ? <LoadingOutlined/> : "Save"}
          cancelText="Cancel"
        >
        <Input.TextArea
          value={textOfComment}
          onChange={(e) => setTextOfComment(e.target.value)}
          autoSize={{ minRows: 10, maxRows: 20 }}
          style={{height: '180px'}}/>
        </Modal>
    </div>
  );
};

export default DefectCard;
