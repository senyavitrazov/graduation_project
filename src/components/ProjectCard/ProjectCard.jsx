import React, { useState } from "react";
import styles from './ProjectCard.module.scss';
import { Button, Flex, Tag, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import CardTitle from "../CardTitle/CardTitle";

const ProjectCard = ({project, ...props}) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  return (
    <div className={styles['container']}>
      <div className={styles['metainfo']}>
        <CardTitle title={project ? project.project_title : 'Loading...'} />
        <div className={styles['btn-container']}>
          <Button type="primary" id={styles['edit-button']} 
            onClick={() => { navigate('edit') }} htmlType="button">Edit</Button>
          <Button type="default" htmlType="button">Archive</Button>
        </div>
      </div>
      {project.list_of_users_with_access.length > 0 ? <div className={styles['list-of-users']}>
        <p>Access for Users:</p>
         <Flex gap="4px 0" wrap>
          {project.list_of_users_with_access.map((user, index) => (
            <Tag key={index}>{user.credentials.login}</Tag>
          ))}
        </Flex>
      </div> : ''}
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
          {project ? project.description : 'Loading...'}
        </Typography.Paragraph>
    </div>
  );
};

export default ProjectCard;
