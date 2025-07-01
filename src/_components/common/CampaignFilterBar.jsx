import {
  Row,
  Col,
  Form,
  Button,
  ButtonGroup,
  ToggleButton,
} from "react-bootstrap";
import DateRangeInput from "./DateRangePicker";

export default function CampaignFilterBar({
  range,
  onRangeChange,
  selectedCampaign,
  onCampaignChange,
  campaignOptions = [],
  lastUpdated,
  onRefresh,
  channels = [], // ["All","Facebook","Google",...]
  selectedChannel,
  onChannelChange,
}) {
  return (
    <Row className="align-items-end g-3 mb-4">
      <Col md={3}>
        <Form.Group>
          <Form.Label className="small fw-semibold">Date range</Form.Label>
          <DateRangeInput value={range} onChange={onRangeChange} />
        </Form.Group>
      </Col>

      <Col md={4}>
        <Form.Group>
          <Form.Label className="small fw-semibold">Campaign</Form.Label>
          <Form.Select
            value={selectedCampaign}
            onChange={(e) => onCampaignChange(e.target.value)}
          >
            {campaignOptions.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </Form.Select>
        </Form.Group>
      </Col>

      <Col md={3}>
        <Form.Label className="small fw-semibold d-block">Channel</Form.Label>
        <ButtonGroup className="flex-wrap">
          {channels.map((ch) => (
            <ToggleButton
              key={ch}
              id={`ch-${ch}`}
              type="radio"
              size="sm"
              variant={selectedChannel === ch ? "primary" : "outline-secondary"}
              value={ch}
              checked={selectedChannel === ch}
              onChange={() => onChannelChange(ch)}
              className="me-1 mb-1"
            >
              {ch}
            </ToggleButton>
          ))}
        </ButtonGroup>
      </Col>

      <Col className="text-md-end">
        {lastUpdated && (
          <small className="text-muted me-2">Updated {lastUpdated}</small>
        )}
        <Button size="sm" variant="outline-secondary" onClick={onRefresh}>
          ⟳ Refresh
        </Button>
      </Col>
    </Row>
  );
}
