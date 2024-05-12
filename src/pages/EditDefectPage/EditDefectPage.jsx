import React, { useContext, useEffect, useState } from 'react';
import { Divider, Spin, message } from 'antd';
import { useLocation, useParams } from 'react-router-dom';
import { GlobalContext } from '../../App';
import { LoadingOutlined } from '@ant-design/icons';
import PageWrapper from '../../components/wrappers/PageWrapper/PageWrapper';
import PageContainer from '../../components/wrappers/PageContainer/PageContainer';
import DefectCard from '../../components/DefectCard/DefectCard';
import styles from './EditDefectPage.module.scss';
import PageHeader from '../../components/PageHeader/PageHeader';
import AddDefectForm from '../AddDefectForm/AddDefectForm';

const EditDefectPage = () => {
  const { serverUrl } = useContext(GlobalContext);
  const { id: defect_id } = useParams();
  const [loading, setLoading] = useState(false);
  const [defect, setDefect] = useState(null);
  const [modifiable, setModifiable] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (defect_id) {
      fetchDefect(defect_id);
    }
  }, [defect_id]);

  useEffect(() => {
    if (location.pathname.endsWith("/edit")) {
      setModifiable(false);
    } else {
      setModifiable(true);
    }
  }, [location]);


  const fetchDefect = (id) => {
  setLoading(true);
  fetch(`${serverUrl}/defects/${id}`)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
     setDefect(data);
     setLoading(false);
  })
  .catch(error => {
    console.log(error);
  });
};

  return(
    <PageWrapper className={styles['wrapper']}>
      <PageHeader backButton={true}>{defect ? defect.defect_title : 'Loading...'}</PageHeader>
      <PageContainer className={styles['content']}>
        <div className={styles['container']}>
          {loading ? (
            <Spin className={styles['spiner']} indicator={<LoadingOutlined spin />} />
          ) : (
            defect && <DefectCard defect={defect} modifiable={modifiable} withoutTimeline={true}/>
          )}
        <AddDefectForm defect={defect}></AddDefectForm>
        </div>
      </PageContainer>
    </PageWrapper>
  )
};

export default EditDefectPage;
