import { useContext, useEffect, useMemo, useState } from 'react';
import styles from './MainView.module.scss'; 
import HorizontalMenu from '../../components/HorizontalMenu/HorizontalMenu';
import PageContainer from '../../components/PageContainer/PageContainer';
import PageHeader from '../../components/PageHeader/PageHeader';
import { Badge, Table, Tag } from 'antd';
import { GlobalContext } from '../../App';
import Pagination from '../../components/Pagination/Pagination';

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

function getBadgeStatus(type_of_state) {
  switch (type_of_state) {
    case "open":
      return "default";
    case "in_progress":
      return "processing";
    case "fixed":
      return "success";
    default:
      return "default";
  }
}


const columns = [
  {
    title: 'Status',
    dataIndex: 'current_state',
    key: 'status',
    render: (state) => state ? 
      <Badge status={getBadgeStatus(state.type_of_state)} text={(state.type_of_state.toUpperCase()[0] +  state.type_of_state.slice(1)).replace('_', ' ')}/>
      : null,
      width: 120,
  },
  {
    title: 'Defect',
    dataIndex: 'defect_title',
    key: 'defect',
    render: (text, record) => <a>{text}</a>,
    width: '25%'
  },
  {
    title: 'Project',
    dataIndex: 'project',
    key: 'project',
    render: (project) => project ? <a>{project.project_title}</a> : null,
  },
  {
    title: 'Priority',
    dataIndex: 'priority',
    key: 'priority',
    render: (priority) => priority ? 
      <Badge status='error' text={priority.toUpperCase()[0] +  priority.slice(1)}/>
      : null,
    width: 200,
  },
  {
    title: 'Severity',
    dataIndex: 'severity',
    key: 'severity',
    render: (e) => e ? 
      <Badge status='error' text={e.toUpperCase()[0] +  e.slice(1)}/>
      : null,
    width: 200,
  },
  {
    title: 'Action',
    dataIndex: 'action',
    key: 'action',
    width: 100,
  }
];

const MainView = () => {
  const [current, setCurrent] = useState('defects');
  const onClick = (e) => setCurrent(e.key);
  const [defects, setDefects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState(1);
  const sizeOfPage = 2; 
  const { serverUrl } = useContext(GlobalContext);

  useEffect(() => {
    fetchData(1, sizeOfPage);
  }, []);

  const fetchData = (page, pageSize) => {
    setLoading(true);
    fetch(`${serverUrl}/defects?page=${page}&limit=${pageSize}`, {
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
        setDefects(data.defects);
        setTotalAmount(data.count);
        setLoading(false);
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (<div className={styles.MainView}>
    <HorizontalMenu onClick={onClick} selectedKeys={[current]} items={items}></HorizontalMenu>
    <PageHeader subtitle={'Track defects and projects'}>Dashboard</PageHeader>
    <PageContainer className={styles.content}>  
      <Table
        className={styles.table}
        loading={loading} 
        columns={columns} 
        dataSource={defects}
        // expandable={} сделать описание??? кратность сделать чтобы когда недобор строк в последней пагинация не ехала
        pagination={false}> 
      </Table>
      <Pagination
        className={styles['pagination-bar']}
        currentPage={current}
        totalCount={totalAmount}
        pageSize={sizeOfPage}
        fetchData={fetchData}
        serverUrl={serverUrl}
      />
    </PageContainer>
  </div>
  );
}

export default MainView;
