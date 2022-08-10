import {
  Button,
  Input,
  List,
  ListItem,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import Drawer from '@mui/material/Drawer';
import { Box } from '@mui/system';
import { useState } from 'react';

const DrawerComponent = ({ isOpen, handleCloseDrawer, shape = null }) => {
  const [inputList, setInputList] = useState([]);
  const [shapeName, setShapeName] = useState(shape.text);
  const [tabValue, setTabValue] = useState(0);

  function addNewInput() {
    setInputList(
      inputList.concat(
        <ListItem>
          <TextField label='xyz' variant='outlined' />
          <TextField label='abc' variant='outlined' />
        </ListItem>
      )
    );
  }
  function handleTabChange(e, newVal) {
    setTabValue(newVal);
  }
  const nameField = () => {
    return (
      <ListItem sx={{ justifyContent: 'center' }}>
        <Typography variant='h6'>NAME</Typography>
        <TextField
          sx={{ marginX: 2 }}
          value={shapeName}
          onChange={(e) => {
            setShapeName(e.target.value);
          }}
        />
      </ListItem>
    );
  };
  const myList = () => {
    if (shape?.type == 'roundedRectangle') {
      return (
        <List>
          <ListItem>
            <Typography
              sx={{
                marginX: 'auto',
                marginY: 1,
                boxShadow: 1,
                paddingX: 1,
                borderRadius: 2,
                backgroundColor: '#c0ca33',
              }}
              variant='h5'
            >
              Play Message
            </Typography>
          </ListItem>
          {nameField()}
          <ListItem>
            <Tabs
              sx={{ marginX: 'auto' }}
              value={tabValue}
              onChange={handleTabChange}
            >
              <Tab label='msgList' />
              <Tab label='params' />
            </Tabs>
          </ListItem>
          {tabValue == '0' && (
            <ListItem>
              <Typography>Message List</Typography>
            </ListItem>
          )}
          {tabValue == '1' && (
            <ListItem>
              <Typography>Params</Typography>
            </ListItem>
          )}

          <ListItem>
            <TextField label='ab' variant='outlined' />
            <TextField label='xy' variant='outlined' />
          </ListItem>
        </List>
      );
    } else if (shape?.type == 'hexagon') {
      return (
        <List>
          <ListItem>
            <Typography
              sx={{
                marginX: 'auto',
                boxShadow: 1,
                paddingX: 1,
                borderRadius: 2,
                backgroundColor: '#009688',
              }}
              variant='h5'
            >
              Play Message
            </Typography>
          </ListItem>
          {nameField()}
        </List>
      );
    } else {
      return (
        <List>
          <ListItem>
            <Typography variant='h5'> not playMessage</Typography>
          </ListItem>
          {nameField()}
        </List>
      );
    }
  };
  return (
    <>
      <Drawer
        anchor='right'
        open={isOpen}
        onClose={() => {
          shape.setText(shapeName);
          handleCloseDrawer();
        }}
      >
        {myList()}
        <List>{inputList}</List>
        <Button
          sx={{ maxWidth: 100, marginX: 'auto' }}
          color='success'
          variant='outlined'
          onClick={addNewInput}
        >
          ADD NEW
        </Button>
      </Drawer>
    </>
  );
};

export default DrawerComponent;
