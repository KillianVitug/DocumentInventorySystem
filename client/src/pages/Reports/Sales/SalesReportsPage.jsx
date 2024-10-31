import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import axios from 'axios';
import moment from 'moment';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';

export default function SalesReportPage() {
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState('2015-01-01');
  const [endDate, setEndDate] = useState('2024-12-31');
  const [selectedServers, setSelectedServers] = useState([]);
  const [serverOptions, setServerOptions] = useState([]);
  const [serverNames, setServerNames] = useState({}); // Maps serverId to servername

  // Fetch servers on component mount
  useEffect(() => {
    axios
      .get('/v2/api/servers')
      .then((response) => {
        const servers = response.data;
        setServerOptions(servers); // Populate server options
        setSelectedServers(servers.map((server) => server.id)); // Select all servers by default
        // Map serverId to servername for legend
        const namesMap = servers.reduce((map, server) => {
          map[`server_${server.id}`] = server.servername;
          return map;
        }, {});
        setServerNames(namesMap);
      })
      .catch((error) => console.error('Error fetching server options:', error));
  }, []);

  const handleServerChange = (event) => {
    const selectedValues = Array.from(event.target.selectedOptions, (option) =>
      parseInt(option.value, 10)
    );
    setSelectedServers(selectedValues);
  };

  const fetchData = () => {
    const formattedServerIds = JSON.stringify(selectedServers);
    axios
      .get(
        `/v2/api/sales-total-summary?serverIds=${formattedServerIds}&startDate=${startDate}&endDate=${endDate}`
      )
      .then((response) => {
        const formattedData = formatData(response.data);
        setData(formattedData);
      })
      .catch((error) => console.error('Error fetching data:', error));
  };

  const formatData = (rawData) => {
    const groupedData = {};

    rawData.forEach((item) => {
      const monthStart = moment(item.datemodified)
        .startOf('month')
        .format('YYYY-MM');
      if (!groupedData[item.serverid]) {
        groupedData[item.serverid] = {};
      }
      if (!groupedData[item.serverid][monthStart]) {
        groupedData[item.serverid][monthStart] = {
          totalTrxcount: 0,
          entryCount: 0,
        };
      }
      groupedData[item.serverid][monthStart].totalTrxcount += item.trxcount;
      groupedData[item.serverid][monthStart].entryCount += 1;
    });

    const allMonths = [
      ...new Set(
        Object.values(groupedData).flatMap((months) => Object.keys(months))
      ),
    ].sort();

    return allMonths.map((month) => {
      const entry = { date: month };
      let totalForMonth = 0;
      let serverCount = 0;

      Object.keys(groupedData).forEach((serverId) => {
        const serverAverage = groupedData[serverId][month]
          ? groupedData[serverId][month].totalTrxcount /
            groupedData[serverId][month].entryCount
          : 0;

        entry[`server_${serverId}`] = serverAverage;

        if (serverAverage > 0) {
          // Only count non-zero server averages towards total average
          totalForMonth += serverAverage;
          serverCount += 1;
        }
      });

      // Calculate the total average for the month across all servers
      entry.totalAverage = serverCount > 0 ? totalForMonth / 1 : 0;

      return entry;
    });
  };

  const generateColor = (index) => {
    const hue = (index * 137.5) % 360;
    return `hsl(${hue}, 70%, 50%)`;
  };

  return (
    <Container fluid className="my-4">
      <Row className="justify-content-center">
        <Col xs={12} md={10}>
          <Card>
            <Card.Header className="bg-primary text-white">
              Sales Transaction Report - Monthly Average
            </Card.Header>
            <Card.Body>
              <Form className="d-flex justify-content-between mb-4">
                <Form.Group controlId="startDate">
                  <Form.Label>Start Date:</Form.Label>
                  <Form.Control
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="endDate">
                  <Form.Label>End Date:</Form.Label>
                  <Form.Control
                    type="date"
                    value={endDate}
                    min={startDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="servers">
                  <Form.Label>Servers:</Form.Label>
                  <Form.Control
                    as="select"
                    multiple
                    value={selectedServers}
                    onChange={handleServerChange}
                  >
                    {serverOptions.map((server) => (
                      <option key={server.id} value={server.id}>
                        {server.servername}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Button
                  variant="primary"
                  onClick={fetchData}
                  className="align-self-end"
                >
                  Update Chart
                </Button>
              </Form>

              {/* Chart Component */}
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={data}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) =>
                      moment(date, 'YYYY-MM').format('MMM YYYY')
                    }
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />

                  {Object.keys(data[0] || {})
                    .filter((key) => key.startsWith('server_'))
                    .map((serverKey, index) => (
                      <Line
                        key={serverKey}
                        type="monotone"
                        dataKey={serverKey}
                        name={serverNames[serverKey]}
                        stroke={generateColor(index)}
                        dot={false}
                      />
                    ))}

                  {/* New Line for Total Average */}
                  <Line
                    type="monotone"
                    dataKey="totalAverage"
                    name="Total Average"
                    stroke="#000000" // Distinct color for total average line
                    dot={false}
                    strokeDasharray="3 3" // Optional: dashed line for differentiation
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
