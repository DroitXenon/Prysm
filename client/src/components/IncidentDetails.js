import React, { useState } from 'react';
import { CssBaseline, styled,Fab, Modal, Box, Typography, Button, Paper, Table, TableHead, TableRow, TableCell, TableBody, Drawer, IconButton, FormGroup, FormControlLabel, Checkbox, Select, MenuItem, TextField } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';

import AnalyticsIcon from '@mui/icons-material/Analytics';
import PersonIcon from '@mui/icons-material/Person';
import SkateboardingIcon from '@mui/icons-material/Skateboarding';
import PublicIcon from '@mui/icons-material/Public';
import BackHandIcon from '@mui/icons-material/BackHand';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import { jsPDF } from 'jspdf';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(3),
  textAlign: 'left',
  color: theme.palette.text.primary,
}));

function IncidentDetails({ incident }) {
  const [analysisReport, setAnalysisReport] = useState(null);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewDataDrawerOpen, setIsViewDataDrawerOpen] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [viewData, setViewData] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState('');
  const [newValue, setNewValue] = useState('');

  const columnOptions = [
    'SourceIP', 'SourcePort', 'SourceLatitude', 'SourceLongitude',
    'DestinationIP', 'DestinationPort', 'DestinationLatitude', 'DestinationLongitude',
    'UserInfo', 'DeviceInfo', 'GeoLocation', 'Protocol', 'PacketLength', 'PacketType',
    'TrafficType', 'Segment', 'AnomalyScores', 'ActionTaken', 'SeverityLevel', 'LogSource'
  ];

  const handleAnalyze = () => {
    fetch(`http://localhost:5001/api/analysis/${incident.id}`)
      .then(response => response.json())
      .then(data => {
        setAnalysisReport(data);
        setIsAnalysisModalOpen(true);
      })
      .catch(error => console.error('Error fetching analysis report:', error));
  };

  const handleCreateView = () => {
    fetch(`http://localhost:5001/api/create-view`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ columns: selectedColumns })
    })
      .then(response => response.json())
      .then(data => {
        console.log('View created:', data);
        setIsViewModalOpen(false);  // Close the modal
        fetchViewData();
      })
      .catch(error => console.error('Error creating view:', error));
  };

  const fetchViewData = () => {
    fetch(`http://localhost:5001/api/view-data`)
      .then(response => response.json())
      .then(data => {
        setViewData(Array.isArray(data) ? data : []);
        setIsViewDataDrawerOpen(true);
      })
      .catch(error => console.error('Error fetching view data:', error));
  };

  const handleUpdateIncident = () => {
    fetch(`http://localhost:5001/api/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: incident.id, column: selectedColumn, value: newValue })
    })
      .then(response => response.json())
      .then(data => {
        console.log('Incident updated:', data);
        setIsEditModalOpen(false);
      })
      .catch(error => console.error('Error updating incident:', error));
      window.location.href = window.location.href;
  };

  const handleCloseAnalysisModal = () => {
    setIsAnalysisModalOpen(false);
    setAnalysisReport(null);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
  };

  const handleCloseViewDataDrawer = () => {
    setIsViewDataDrawerOpen(false);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setSelectedColumns((prevSelected) =>
      checked ? [...prevSelected, name] : prevSelected.filter((column) => column !== name)
    );
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    
    const title = 'Incident Details';
    const titleWidth = doc.getTextWidth(title);
    const pageWidth = doc.internal.pageSize.getWidth();
    const titleX = (pageWidth - titleWidth) / 2;
    
    doc.text(title, titleX, 20); 
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    
    doc.text(`Incident ID: ${incident.id}`, 10, 40);
    doc.text(`Timestamp: ${incident.Timestamp}`, 10, 50);
    doc.text(`Attack Type: ${incident.AttackType}`, 10, 60);
    doc.text(`Attack Signature: ${incident.AttackSignature}`, 10, 70);
    doc.text(`Source IP: ${incident.SourceIP}`, 10, 80);
    doc.text(`Source Port: ${incident.SourcePort}`, 10, 90);
    doc.text(`Source Latitude: ${incident.SourceLatitude}`, 10, 100);
    doc.text(`Source Longitude: ${incident.SourceLongitude}`, 10, 110);
    doc.text(`Destination IP: ${incident.DestinationIP}`, 10, 120);
    doc.text(`Destination Port: ${incident.DestinationPort}`, 10, 130);
    doc.text(`Destination Latitude: ${incident.DestinationLatitude}`, 10, 140);
    doc.text(`Destination Longitude: ${incident.DestinationLongitude}`, 10, 150);
    doc.text(`User Information: ${incident.UserInfo}`, 10, 160);
    doc.text(`Device Information: ${incident.DeviceInfo}`, 10, 170);
    doc.text(`Geolocation: ${incident.GeoLocation}`, 10, 180);
    doc.text(`Protocol: ${incident.Protocol}`, 10, 190);
    doc.text(`Packet Length: ${incident.PacketLength}`, 10, 200);
    doc.text(`Packet Type: ${incident.PacketType}`, 10, 210);
    doc.text(`Traffic Type: ${incident.TrafficType}`, 10, 220);
    doc.text(`Segment: ${incident.Segment}`, 10, 230);
    doc.text(`Anomaly Scores: ${incident.AnomalyScores}`, 10, 240);
    doc.text(`Action Taken: ${incident.ActionTaken}`, 10, 250);
    doc.text(`Severity Level: ${incident.SeverityLevel}`, 10, 260);
    doc.text(`Log Source: ${incident.LogSource}`, 10, 270);
    
    doc.save('incident_details.pdf');
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ width: '100%', height: '60vh' }}>
        <Typography variant="h4" align='center' sx={{ mt: 4, mb: 4 }}>Details</Typography>
        <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 2 }} sx={{ height: 'calc(100% - 64px)' }}>
          <Grid item xs={6} sx={{ display: 'flex' }}>
            <Item sx={{ flex: 1 }}>
              <PersonIcon /><br />
              <Typography variant="h6">Attacker</Typography>
              Source IP: {incident.SourceIP}<br />
              Source Port: {incident.SourcePort}<br />
              Source Latitude: {incident.SourceLatitude}<br />
              Source Longitude: {incident.SourceLongitude}
              {/* TODO: Change font size */}
            </Item>
          </Grid>
          <Grid item xs={6} sx={{ display: 'flex' }}>
            <Item sx={{ flex: 1 }}>
              <SkateboardingIcon /><br />
              <Typography variant="h6">Victim</Typography>
              Destination IP: {incident.DestinationIP}<br />
              Destination Port: {incident.DestinationPort}<br />
              User Information: {incident.UserInfo}<br />
              Geolocation: {incident.GeoLocation}
            </Item>
          </Grid>
          <Grid item xs={6} sx={{ display: 'flex' }}>
            <Item sx={{ flex: 1 }}>
              <PublicIcon /><br />
              <Typography variant="h6">Network Traffic</Typography>
              Protocol: {incident.Protocol}<br />
              Packet Length: {incident.PacketLength}<br />
              Packet Type: {incident.PacketType}<br />
              Traffic Type: {incident.TrafficType}<br />
              Segment: {incident.Segment}
            </Item>
          </Grid>
          <Grid item xs={6} sx={{ display: 'flex' }}>
            <Item sx={{ flex: 1 }}>
              <BackHandIcon /><br />
              <Typography variant="h6">Response</Typography>
              Anomaly Scores: {incident.AnomalyScores}<br />
              Action Taken: {incident.ActionTaken}<br />
              Severity Level: {incident.SeverityLevel}<br />
              Log Source: {incident.LogSource}
            </Item>
          </Grid>
        </Grid>
        <Box sx={{ mt: 6 }} align='center'>
          <Fab color="secondary" aria-label="edit" size='medium' onClick={() => setIsEditModalOpen(true)}>
            <EditIcon />
          </Fab>
          <Fab color="primary" aria-label="view" size='medium' onClick={() => setIsViewModalOpen(true)} sx={{ ml: 2 }}>
            <VisibilityIcon />
          </Fab>
          <Fab aria-label="download" size='medium' onClick={generatePDF} sx={{ ml: 2 }}>
            <DownloadIcon />
          </Fab>
          <Fab variant="extended" onClick={handleAnalyze} sx={{ ml: 2 }}>
            <AnalyticsIcon sx={{ mr: 1 }} />
            Analysis
          </Fab>
        </Box>
        
        <Modal open={isAnalysisModalOpen} onClose={handleCloseAnalysisModal} align='center'>
          <Box
            sx={{
              p: 3,
              mx: 'auto',
              mt: '30vh',
              maxWidth: '40%',
              maxHeight: '40%',
              overflow: 'auto',
              bgcolor: 'background.paper',
              boxShadow: 24,
              borderRadius: 2,
            }}
          >
            <Typography variant="h5">
              Report
            </Typography>
            {analysisReport ? (
              <Paper sx={{ p: 2 }}>
                <Typography variant="body1" align='left'>{analysisReport.report}</Typography>
              </Paper>
            ) : (
              <Typography variant="body1" align='left'>Loading analysis report...</Typography>
            )}
            <Button variant="outlined" color="primary" onClick={handleCloseAnalysisModal} sx={{ mt: 2 }}>
              Close
            </Button>
          </Box>
        </Modal>
        
        <Modal open={isViewModalOpen} onClose={handleCloseViewModal} align='center'>
          <Box
            sx={{
              p: 3,
              mx: 'auto',
              mt: '20vh',
              maxWidth: 500,
              maxHeight: '80vh',
              overflow: 'auto',
              bgcolor: 'background.paper',
              boxShadow: 24,
              borderRadius: 2,
            }}
          >
            <Typography variant="h5">
              Customize View Table
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Paper sx={{ width: '60%', height: 400, overflow: 'auto' }}>
                <FormGroup>
                  {columnOptions.map((option) => (
                    <FormControlLabel
                      key={option}
                      control={
                        <Checkbox
                          name={option}
                          checked={selectedColumns.includes(option)}
                          onChange={handleCheckboxChange}
                        />
                      }
                      label={option}
                    />
                  ))}
                </FormGroup>
              </Paper>
            </Box>
            <Button variant="contained" color="primary" onClick={handleCreateView} sx={{ mt: 2 }}>
              Create
            </Button>
          </Box>
        </Modal>

        <Modal open={isEditModalOpen} onClose={handleCloseEditModal} align='center'>
          <Box
            sx={{
              p: 3,
              mx: 'auto',
              mt: '30vh',
              maxWidth: '30%',
              maxHeight: '40%',
              overflow: 'auto',
              bgcolor: 'background.paper',
              boxShadow: 24,
              borderRadius: 2,
            }}
          >
            <Typography variant="h5">
              Edit Incident
            </Typography>
            <Select
              value={selectedColumn}
              onChange={(e) => setSelectedColumn(e.target.value)}
              displayEmpty
              fullWidth
              sx={{ mt: 2 }}
            >
              <MenuItem value="" disabled>Select Attribute</MenuItem>
              {columnOptions.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
            <TextField
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              label="New Value"
              fullWidth
              sx={{ mt: 2 }}
            />
            <Button variant="contained" color="primary" onClick={handleUpdateIncident} sx={{ mt: 2 }}>
              Confirm
            </Button>
          </Box>
        </Modal>

        <Drawer
          anchor="right"
          open={isViewDataDrawerOpen}
          onClose={handleCloseViewDataDrawer}
          PaperProps={{ sx: { width: 700 } }}
        >
          <Box
            sx={{
              p: 3,
              maxWidth: '100%',
              bgcolor: 'background.paper',
              boxShadow: 24,
              borderRadius: 2,
              overflowX: 'auto'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" sx={{ mt: 1 }}>
                Customized Table
              </Typography>
              <IconButton onClick={handleCloseViewDataDrawer}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Paper sx={{ p: 2, overflowX: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    {selectedColumns.map((column) => (
                      <TableCell key={column}>{column}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {viewData.map((row, index) => (
                    <TableRow key={index}>
                      {selectedColumns.map((column) => (
                        <TableCell key={column}>{row[column]}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Box>
        </Drawer>
      </Box>
    </ThemeProvider>
  );
}

export default IncidentDetails;
