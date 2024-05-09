import React, { useContext, useEffect, useState } from "react";
import styles from './ProjectCard.module.scss';
import { Button, Flex, Tag, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import CardTitle from "../CardTitle/CardTitle";
import { GlobalContext } from "../../App";

message.config({
  top: '10vh',
});

const ProjectCard = ({project, modifiable, ...props}) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const { serverUrl } = useContext(GlobalContext);

   const patchProject = async (id) => {
    try {
      const url = `${serverUrl}/projects/${project._id}`;
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_archived: true,
        })
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Error fetching defect:', error);
    }
  }

  return (
    <div className={styles['container']}>
      <div className={styles['metainfo']}>
        <CardTitle title={project ? project.project_title : 'Loading...'} />
        {modifiable && (<div className={styles['btn-container']}>
          <Button type="primary" id={styles['edit-button']} 
            onClick={() => { navigate('edit') }} htmlType="button">Edit</Button>
          <Button type="default" htmlType="button" onClick={()=> {
            patchProject();
            navigate(-1);
            message.success('Added to archive');
          }}>Archive</Button>
        </div>)}
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
