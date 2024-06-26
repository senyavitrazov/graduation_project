import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import HorizontalMenu from '../../components/HorizontalMenu/HorizontalMenu';
import DefectManagmentView from '../DefectManagmentView/DefectManagmentView';
import ProjectManagementView from '../ProjectManagmentView/ProjectManagmentView';
import AddProjectForm from '../AddProjectForm/AddProjectForm';
import styles from './MainView.module.scss'; 
import ProjectPage from '../ProjectPage/ProjectPage';
import AboutPage from '../AboutPage/AboutPage';
import EditDefectPage from '../EditDefectPage/EditDefectPage';
import NotFound from '../NotFound/NotFound';

const items = [
  {
    label: 'Defects Management',
    key: 'defects',
    url: '',
  },
  {
    label: 'Project Management',
    key: 'projects',
    url: 'projects',
  },
  {
    label: 'About',
    key: 'about',
    url: 'about',
  },
];

const MainView = ({onLogOut, ...props}) => {
  const [current, setCurrent] = useState(sessionStorage.getItem('current_page_of_nav') || 'defects');
  const onClick = (e) => setCurrent(e.key);
  
  useEffect(() => {
    sessionStorage.setItem('current_page_of_nav', current);
  }, [current])

  return (
    <div className={styles['main-wrapper']}>
      <HorizontalMenu key={'horizontal-menu'} onClick={onClick} selectedKeys={[current]} onLogOut={onLogOut} items={items}></HorizontalMenu>
      <Routes>
        <Route key={'defects-route'} path="/" element={<DefectManagmentView/>} />
        <Route key={'projects-route'} path="projects" element={<ProjectManagementView/>} />
        <Route key={'projects-add'} path="projects/add" element={<AddProjectForm/>} />
        <Route key={'project'} path="projects/:id/*" element={<ProjectPage/>} />
        <Route key={'about-page'} path="about" element={<AboutPage/>} />
        <Route key={'projects-add-defect'} path="defects/:id/edit" element={<EditDefectPage/>}/>
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </div>
  );
}

export default MainView;
