import React, { useContext, useEffect, useState } from 'react';
import ProjectDefectsList from '../ProjectDefectsList/ProjectDefectsList';
import PageContainer from '../../components/wrappers/PageContainer/PageContainer';
import PageWrapper from '../../components/wrappers/PageWrapper/PageWrapper';
import PageHeader from '../../components/PageHeader/PageHeader';
import ProjectCard from '../../components/ProjectCard/ProjectCard';
import AddDefectForm from '../AddDefectForm/AddDefectForm';
import { Route, Routes, useLocation, useParams } from 'react-router-dom';
import { GlobalContext } from '../../App';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import styles from './ProjectPage.module.scss';
import AddProjectForm from '../AddProjectForm/AddProjectForm';

const ProjectPage = () => {
  const { serverUrl } = useContext(GlobalContext);
  let { id: project_id } = useParams();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState(null);
  const [modifiable, setModifiable] = useState(false);

  const fetchProject = () => {
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
        setLoading(false);
     })
     .catch(error => {
        console.log(error);
     });
  };

  useEffect(() => {
    fetchProject();
  }, [project_id]);

  useEffect(() => {
    if (location.pathname.endsWith("/add-defect") || location.pathname.endsWith("/edit")) {
      setModifiable(false);
    } else {
      setModifiable(true);
    }
  }, [location]);

  
  const handleCreateDefect = (newDefect) => {
    setProject((prevProject) => ({
      ...prevProject,
      list_of_defects: [...prevProject.list_of_defects, newDefect],
    }));
  };

  return (
    <PageWrapper className={styles['wrapper']}>
      <PageHeader backButton={true}>{project ? project.project_title : 'Loading...'}</PageHeader>
        <PageContainer className={styles['content']}>
        <div className={styles['container']}>
          {loading ? (
            <Spin className={styles['spiner']} indicator={<LoadingOutlined spin />} />
          ) : (
            <>
              <ProjectCard project={project} modifiable={modifiable}/>
              <Routes>
                <Route key={'projects-add-defect'} path="add-defect" element={<AddDefectForm project={project} onCreateDefect={handleCreateDefect}/>}/>
                <Route key={'projects-edit'} path="edit" element={<AddProjectForm project={project} onEditProject={fetchProject}/>}/>
                <Route key={'projects'} path="/" element={<ProjectDefectsList project={project} loading={loading}/>}/>
                <Route key={'selected-defect'} path="/:id" element={<ProjectDefectsList project={project} loading={loading}/>}/>
              </Routes>
            </>
          )}
        </div>
      </PageContainer>
    </PageWrapper>
  );
}

export default ProjectPage;
