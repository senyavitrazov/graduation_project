import React, { useState } from 'react';
import styles from './DefectCard.module.scss';
import CardTitle from '../CardTitle/CardTitle';
import { CommentOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Badge, Button, Tag, Timeline, Typography } from 'antd';

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

//const timelineItems = {[]};

const DefectCard = ({defect, ...props}) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState(defect.current_state.type_of_state);


  const status_list = ['open', 'in_progress', 'fixed'];

  const handleStatusChange = () => {
    switch (status) {
      case 'open':
        setStatus('in_progress');
        break;
      case 'in_progress':
        setStatus('fixed');
        break;
      case 'fixed':
        setStatus('archived');
        break;
      case 'archived':
        setStatus('open');
        break;
      default:
        break;
    }
  };

  const getNextStatus = () => {
    const nextStatus = status_list[status_list.findIndex(s => s === status) + 1];
    if (nextStatus === 'fixed') return 'Set to fixed' 
    if (nextStatus === 'in_progress') return 'Set in progress'
    return 'Open'
  };

  return (
    <div className={styles['container']}>
      <div className={styles['metainfo']}>
        <CardTitle title={defect ? defect.defect_title : 'Loading...'} />
        <div className={styles['btn-container']}>
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
          <Button type="default" htmlType="button" icon={<CommentOutlined/>}>Comment</Button>
        </div>
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
        <Timeline/>
    </div>
  );
};

export default DefectCard;
