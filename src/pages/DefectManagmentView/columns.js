import Link from "antd/es/typography/Link";
import { DownOutlined } from "@ant-design/icons";
import { Badge, Dropdown, Menu } from "antd";
import styles from './DefectManagmentView.module.scss';
const classNames = require("classnames");

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
    title: "Status",
    dataIndex: "current_state",
    key: "status",
    render: (state) =>
      state ? (
        <Badge
          status={getBadgeStatus(state.type_of_state)}
          className={styles.badge}
          text={(
            state.type_of_state.toUpperCase()[0] + state.type_of_state.slice(1)
          ).replace("_", " ")}
        />
      ) : null,
    width: 120,
  },
  {
    title: "Defect",
    dataIndex: "defect_title",
    key: "defect",
    render: (text, record) => (
      <Link
        ellipsis={true}
        href={record.project && `projects/${record.project._id}/${record._id}`}
      >
        {text}
      </Link>
    ),
    width: "25%",
  },
  {
    title: "Project",
    dataIndex: "project",
    key: "project",
    render: (project) =>
      project ? (
        <Link href={`projects/${project._id}`} ellipsis={true}>
          {project.project_title}
        </Link>
      ) : null,
    responsive: ["xl"],
  },
  {
    title: "Priority",
    dataIndex: "priority",
    key: "priority",
    render: (priority) =>
      priority ? (
        <Badge
          status="error"
          text={priority.toUpperCase()[0] + priority.slice(1)}
        />
      ) : null,
    width: 200,
    responsive: ["sm"],
  },
  {
    title: "Severity",
    dataIndex: "severity",
    key: "severity",
    render: (e) =>
      e ? (
        <Badge status="error" text={e.toUpperCase()[0] + e.slice(1)} />
      ) : null,
    width: 200,
    responsive: ["sm"],
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
    width: 140,
    render: (text = "Action", record) => (
      <Dropdown
        overlay={menu(record)}
        className={styles["action-container"]}
        trigger={["click"]}
      >
        <span
          className={classNames("ant-dropdown-link", styles["action-link"])}
        >
          {text} <DownOutlined style={{ fontSize: "1rem" }} />
        </span>
      </Dropdown>
    ),
  },
];

const menu = (record) => {
  return (
    <Menu>
      <Menu.Item key="1">
        <a href={`/defects/${record._id}/edit`}>Edit Defect</a>
      </Menu.Item>
      {record.project && (
        <Menu.Item key="2">
          <a href={`/projects/${record.project._id}/${record._id}`}>
            View Defect
          </a>
        </Menu.Item>
      )}
      {record.project && (
        <Menu.Item key="3">
          <a href={`/projects/${record.project._id}`}>View Project</a>
        </Menu.Item>
      )}
    </Menu>
  );
};

export default columns;
