import { Badge, Card, Col, Progress, Row, Tooltip } from "antd";
import { InfoCircleOutlined } from '@ant-design/icons';
const ColCardComponent = ({ metaName, metaCount, body, footer, loading }) => {
  return (
    <Col md={12} sm={24} xs={24}>
      <Card loading={loading} className="overview" bordered={false}>
        <div className="overview-header">
          <div className="overview-header-meta">{metaName}</div>
          <div className="overview-header-count">{metaCount}</div>
          <Tooltip title="Introduce">
            <InfoCircleOutlined className="overview-header-action" />
          </Tooltip>
        </div>
        <div className="overview-body">{body}</div>
        <div className="overview-footer">{footer}</div>
      </Card>
    </Col>
  );
};

export default ColCardComponent;
