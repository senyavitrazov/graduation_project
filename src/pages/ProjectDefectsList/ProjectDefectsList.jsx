import React, { useEffect, useState } from 'react';
import styles from './ProjectDefectsList.module.scss';
import { PlusOutlined, DownOutlined, UpOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, Divider, Spin } from 'antd';
import DefectCard from '../../components/DefectCard/DefectCard';
import { useNavigate, useParams } from 'react-router-dom';

const ProjectDefectsList = ({project, loading, ...props}) => {
  const [activeDefects, setActiveDefects] = useState([]);
  const [archivedDefects, setArchivedDefects] = useState([]);
  const [defects, setDefects] = useState(project ? project.list_of_defects : []);
  let { defect_id: selected_id } = useParams();
  const navigate = useNavigate();

  const [activeDefectsExpanded, setActiveDefectsExpanded] = useState(false);
  const [archivedDefectsExpanded, setArchivedDefectsExpanded] = useState(false);
  
  useEffect(() => {
    const activeDefectsList = (defects.filter(defect => defect.current_state.type_of_state !== 'archived'));
    const archivedDefectsList = (defects.filter(defect => defect.current_state.type_of_state === 'archived'));
    if (selected_id) {
      setActiveDefects(activeDefectsList.filter(defect => defect._id !== selected_id));
      setArchivedDefects(archivedDefectsList.filter(defect => defect._id !== selected_id));
    } else {
      setActiveDefects(activeDefectsList);
      setArchivedDefects(archivedDefectsList);
    }
  }, [defects])

  const toggleActiveDefectsExpanded = () => {
    setActiveDefectsExpanded(!activeDefectsExpanded);
  };

  const toggleArchivedDefectsExpanded = () => {
    setArchivedDefectsExpanded(!archivedDefectsExpanded);
  };

  const updateDefect = (updatedDefect) => {
    const updatedDefects = defects.map(defect =>
      defect._id === updatedDefect._id ? updatedDefect : defect
    );
    setDefects(updatedDefects);

    const activeDefectsList = updatedDefects.filter(defect => defect.current_state.type_of_state !== 'archived');
    const archivedDefectsList = updatedDefects.filter(defect => defect.current_state.type_of_state === 'archived');
  
    setActiveDefects(activeDefectsList);
    setArchivedDefects(archivedDefectsList);
  };

  return(
    <>
      <Button
        onClick={() => {navigate('add-defect')}}
        className={styles['add-defect-button']}
        icon={<PlusOutlined/>}
      >
        Add new Defect
      </Button>
      {selected_id && (
        <div className={styles['group-container']}>
          <Divider style={{margin: '30px 0'}}>Selected Defect</Divider>
          {defects.map(defect => {
            if (defect._id === selected_id) {
              return (
                <DefectCard key={defect._id} defect={defect} style={{margin: 0}} onUpdate={updateDefect} />
              );
            }
            return null;
          })}
        </div>
      )}
      {activeDefects.length > 0 && (
        <div className={styles['group-container']}>
          <Divider style={{margin: '30px 0', userSelect: 'none', cursor: 'pointer'}} onClick={toggleActiveDefectsExpanded}>
            Active Scope ({activeDefects.length})
            {activeDefectsExpanded 
              ? <UpOutlined style={{fontSize: '1.2rem', marginLeft: 4}}/> 
              : <DownOutlined style={{fontSize: '1.2rem', marginLeft: 4}}/>}
          </Divider>
          {activeDefectsExpanded && (
            loading ? (
              <Spin className={styles['spiner']} indicator={<LoadingOutlined spin />} />
            ) : (
              activeDefects.map((e, i) => (<DefectCard key={e._id} defect={e} onUpdate={updateDefect}/>))
            )
          )}
        </div>
      )}
      {archivedDefects.length > 0 && (
        <div className={styles['group-container']}>
          <Divider style={{margin: '30px 0', userSelect: 'none', cursor: 'pointer'}} onClick={toggleArchivedDefectsExpanded}>
            Archived Scope ({archivedDefects.length})
            {archivedDefectsExpanded 
              ? <UpOutlined style={{fontSize: '1.2rem', marginLeft: 4}}/> 
              : <DownOutlined style={{fontSize: '1.2rem', marginLeft: 4}}/>}
          </Divider>
          {archivedDefectsExpanded && (
            loading ? (
              <Spin className={styles['spiner']} indicator={<LoadingOutlined spin />} />
            ) : (
              archivedDefects.map((e, i) => (<DefectCard key={e._id} defect={e} onUpdate={updateDefect}/>))
            )
          )}
        </div>
      )}
    </>
  );
}

export default ProjectDefectsList;
