import { Route, Routes } from 'react-router-dom';
import HorizontalMenu from '../../components/HorizontalMenu/HorizontalMenu';
import DefectManagmentView from '../DefectManagmentView/DefectManagmentView';
import ProjectManagementView from '../ProjectManagmentView/ProjectManagmentView';
import styles from './MainView.module.scss'; 
import { useState } from 'react';

const items = [
  {
    label: 'Defects Management',
    key: 'defects',
  },
  {
    label: 'Project Management',
    key: 'projects',
  },
  {
    label: 'About',
    key: 'about',
  },
];

const MainView = () => {
  const [current, setCurrent] = useState('defects');
  const onClick = (e) => setCurrent(e.key);

  return (
    <div className={styles['main-wrapper']}>
      <Routes>
        <Route path="/" element={
          <HorizontalMenu key={'horizontal-menu'} onClick={onClick} selectedKeys={[current]} items={items}></HorizontalMenu>
        }/>
        <Route key={'defects-route'} path="defects" element={<DefectManagmentView/>} />
        <Route key={'projects-route'} path="projects" element={<ProjectManagementView/>} />
      </Routes>
    </div>
  );
}

export default MainView;
