import HorizontalMenu from '../../components/HorizontalMenu/HorizontalMenu';
import DefectManagmentView from '../DefectManagmentView/DefectManagmentView';
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
      <HorizontalMenu onClick={onClick} selectedKeys={[current]} items={items}></HorizontalMenu>
      <DefectManagmentView></DefectManagmentView>
    </div>
  );
}

export default MainView;
