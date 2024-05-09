import { Divider, Typography } from "antd";
import PageContainer from "../../components/wrappers/PageContainer/PageContainer";
import PageWrapper from "../../components/wrappers/PageWrapper/PageWrapper"
import styles from './AboutPage.module.scss'; 

const { Paragraph, Text, Link } = Typography;
const techArray = "Electron.js, React.js, SASS, JavaScript ES2022, Express.js, Node.js, MongoDB, Mongoose".split(", ");

const handleUrl = async (url) => {
  window.contextBridgeApi?.send('url-channel', {url});
  console.log(url);
};

const AboutPage = () => {
  return (
    <PageWrapper className={styles['wrapper']}>
      <PageContainer className={styles['content']}>
        <Typography>
          <h2 className={styles['title']}>Learn some more about app</h2>
          <Paragraph>
            This application is the graduation project of Glik Arseniy Georgievich, a student of the 010901 group of the University of Informatics and Radioelectronics of the Republic of Belarus. The application is part of a software defect tracking system, which is designed to be further made publicly available with open source code. <Text strong> The system is a basic software solution open for further modernization and improvement</Text> developed for a testing department or a department similar in purpose.
          </Paragraph>
          <Paragraph>
            The purpose of the software being developed is to facilitate and systematize part of the processes related to tracking and accounting for software defects. This includes partially automating tasks such as tracking and managing software defects, analyzing their impact, managing priorities, monitoring defect elimination processes, as well as evaluating effectiveness and involving members of the development team. By automating these processes, organizations can reduce the number of errors associated with defect management, improve information accuracy, increase efficiency, and ultimately improve the overall experience of participants in software development.
          </Paragraph>
          <Paragraph>
            The following technology stack was used during development:
          </Paragraph>
          <Paragraph style={{paddingLeft: 10}}>
            <ul className={styles['list']}>
              {techArray.map((e,i) => (<li key={i}>{e}</li>))}
            </ul>
          </Paragraph>
          <Paragraph>
            This stack of technologies was chosen due to the popularity of each of them individually and the ability of the developer to design an application based on them. The application provides APIs for working with the file system, two types of interprocess communication have been developed — duplex and single-sided, and a restful api has been written for the server side. The use of these apis is demonstrated. The main part of the application is developed on a standart  <Text code>React.js</Text> and <Text strong>does not use application state management libraries</Text>.
          </Paragraph>
          <Paragraph>
            The text of the explanatory note to the diploma project fully describes the tasks solved by this application and tells in more detail about its functionality, there may be some deviations from the text of the diploma project due to improvements made during the development of the application itself on <Text code>Electron.js</Text>.
          </Paragraph>
          <Divider style={{margin: '30px 0'}}/>
          <Paragraph>
            The author does not claim any titles and understands the imperfection of software solutions, however, due to the short delivery time of the software project, he leaves the system code in this form. The source code of the system is open for your modernization, expansion and rewriting:
          </Paragraph>
          <Paragraph style={{paddingLeft: 10}}>
            <ul className={styles['list']}>
              <li key={'gred'}>
                <Link onClick={()=>{handleUrl('https://github.com/senyavitrazov/graduation_project')}}>Graduation Project Repository (Electron app)</Link> 
              </li>
              <li key={'ferref'}>
                <Link  onClick={()=>{handleUrl('https://github.com/senyavitrazov/mongo_server')}}>Mongo Server Repository (Server side)</Link> 
              </li>
            </ul>
          </Paragraph>
        </Typography>
        <p className={styles['thankyou']}>Thank you for your attention 🤗</p>
      </PageContainer>
    </PageWrapper>
  );
}

export default AboutPage;
