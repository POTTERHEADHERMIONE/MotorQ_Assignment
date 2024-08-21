import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import VehicleBrands from './vehicles-manager/vehicle-brands';
import VehicleModels from './vehicles-manager/vehicle-models';
import UsersManager from './users-manager/users-manager';
import RentalsManager from './rentals-manager/rentals-manager';
import MapComponent from './maps/map-marking';
import { styled } from '@mui/material/styles';

// Styled Tabs and Tab components
const StyledTabs = styled(Tabs)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: theme.typography.fontWeightMedium,
  '&.Mui-selected': {
    color: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightBold,
  },
  '&:hover': {
    color: theme.palette.primary.dark,
  },
}));

// AdminLayout component for tab panels
function AdminLayout(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

AdminLayout.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

// Main component
export default function BasicTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <StyledTabs value={value} onChange={handleChange} aria-label="basic tabs example">
        <StyledTab label="Vehicle Brand" {...a11yProps(0)} />
        <StyledTab label="Vehicle Model" {...a11yProps(1)} />
        {/* <StyledTab label="Vehicle Fuel" {...a11yProps(2)} /> */}
        <StyledTab label="Users" {...a11yProps(2)} />
        <StyledTab label="Rentals" {...a11yProps(3)} />
        <StyledTab label="Map" {...a11yProps(4)} />
      </StyledTabs>

      <AdminLayout value={value} index={0}>
        <VehicleBrands />
      </AdminLayout>

      <AdminLayout value={value} index={1}>
        <VehicleModels />
      </AdminLayout>

      {/* <AdminLayout value={value} index={2}>
        <h1>Here I will add details for the Fuel section</h1>
      </AdminLayout> */}

      <AdminLayout value={value} index={2}>
        <UsersManager />
      </AdminLayout>

      <AdminLayout value={value} index={3}>
        <RentalsManager />
      </AdminLayout>

      <AdminLayout value={value} index={4}>
        <MapComponent />
      </AdminLayout>
    </Box>
  );
}
