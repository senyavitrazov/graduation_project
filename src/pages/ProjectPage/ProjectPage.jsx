import React, { useContext, useEffect, useState } from 'react';
import PageWrapper from '../../components/wrappers/PageWrapper/PageWrapper';
import PageHeader from '../../components/PageHeader/PageHeader';
import PageContainer from '../../components/wrappers/PageContainer/PageContainer';
import styles from './ProjectPage.module.scss';
import { GlobalContext } from '../../App';
import { useParams } from 'react-router-dom';
import ProjectCard from '../../components/ProjectCard/ProjectCard';
import { LoadingOutlined } from '@ant-design/icons';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Spin } from 'antd';
import DefectCard from '../../components/DefectCard/DefectCard';

const ProjectPage = () => {
  const { serverUrl } = useContext(GlobalContext);
  let { id: project_id } = useParams();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState(null);
  const [defects, setDefects] = useState([]);

   const fetchData = () => {
    setLoading(true);
    let url = `${serverUrl}/projects/${project_id}/details`;
    fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "Accept": "application/json",
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setProject(data);
        setDefects(data.list_of_defects);
        setLoading(false);
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchData();
    console.log(project);
  }, [project_id]);


  return (
    <PageWrapper className={styles['wrapper']}>
      <PageHeader backButton={true}>{project ? project.project_title : 'Loading...'}</PageHeader>
      <PageContainer className={styles.content}>
        <div className={styles.container}>
          {loading ? (
            <Spin className={styles['spiner']} indicator={<LoadingOutlined spin />} />
          ) : (
            <ProjectCard project={project} />
          )}
          <Button
            onClick={() => {}}
            className={styles['add-defect-button']}
            icon={<PlusOutlined/>}
          >
            Add new Defect
          </Button>
        <Divider style={{margin: '30px 0'}}>Defect Scope ({defects.length})</Divider>
        {loading ? (
            <Spin className={styles['spiner']} indicator={<LoadingOutlined spin />} />
          ) : (
            defects.length > 0 ? defects.map((e, i) => (<DefectCard key={i} defect={e}/>)) : 'zero defects'
          )}
        </div>
      </PageContainer>
    </PageWrapper>
  );
}

export default ProjectPage;
