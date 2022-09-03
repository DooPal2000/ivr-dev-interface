import {
  Tabs,
  Button,
  List,
  ListItem,
  Tab,
  TextField,
  Typography,
  Tooltip,
  Box,
  Select,
  MenuItem,
  RadioGroup,
  Radio,
  FormControlLabel,
  Snackbar,
  Alert,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import RemoveCircleRoundedIcon from '@mui/icons-material/RemoveCircleRounded';
import { useEffect, useRef, useState } from 'react';
import {
  addInputElements,
  checkValidity,
  addParamsElements,
} from '../src/helpers';

const GetDigits = ({ shape, handleCloseDrawer, userVariables }) => {
  const [resultName, setResultName] = useState(
    shape.userValues?.variableName || ''
  );
  const [shapeName, setShapeName] = useState(shape.text);
  const [tabValue, setTabValue] = useState(0);
  const [minDigits, setMinDigits] = useState(
    shape.userValues?.params.minDigits || 1
  );
  const [maxDigits, setMaxDigits] = useState(
    shape.userValues?.params.maxDigits || 1
  );
  const [msgObj, setMsgObj] = useState(shape.userValues?.messageList || []);
  const [msgObjType, setMsgObjType] = useState('prompt');
  const [paramsObj, setParamsObj] = useState(
    shape.userValues?.params.paramsList || []
  );
  const [paramsObjType, setParamsObjType] = useState('');

  useEffect(() => {
    switchTab();
  }, [tabValue]);

  function switchTab() {
    console.log('userVariables:', userVariables);
    let tabPanel1 = document.getElementById('tabPanel1');
    let tabPanel2 = document.getElementById('tabPanel2');
    if (tabValue === 0) {
      tabPanel1.style.display = 'block';
      tabPanel2.style.display = 'none';
      return;
    }
    if (tabValue === 1) {
      tabPanel1.style.display = 'none';
      tabPanel2.style.display = 'block';
    }
  }

  function saveUserValues() {
    shape.setText(shapeName);
    shape.setUserValues({
      params: { minDigits, maxDigits, paramsList: paramsObj },
      messageList: msgObj,
      variableName: resultName,
    });
  }

  function handleNameValidation(e) {
    let errorBox = document.getElementById('name-error-box');
    let errorMessage = checkValidity('object', e);
    if (errorMessage !== -1) {
      errorBox.style.display = 'block';
      e.target.style.backgroundColor = '#ffebee';
      errorBox.innerText = errorMessage;
      return;
    }
    // no error condition
    errorBox.style.display = 'none';
    e.target.style.backgroundColor = '#f1f8e9';
    errorBox.innerText = '';
  }

  function addInput() {
    setMsgObj((s) => {
      return [...s, { type: msgObjType, value: '' }];
    });
  }
  function removeInput() {
    setMsgObj((s) => {
      [...s].pop();
      return newArr;
    });
  }

  function addParamsInput() {
    setParamsObj((s) => {
      return [...s, { type: paramsObjType, value: '' }];
    });
  }
  function removeParamsInput() {
    setParamsObj((s) => {
      [...s].pop();
      return newArr;
    });
  }

  return (
    <>
      <List>
        <ListItem>
          <Tooltip title='CLOSE'>
            <Button
              size='small'
              variant='contained'
              color='error'
              sx={{ height: 30 }}
              onClick={() => {
                shape.setSelected(false);
                handleCloseDrawer();
              }}
            >
              <CloseRoundedIcon sx={{ fontSize: 21 }} />
            </Button>
          </Tooltip>
          <Tooltip title='SAVE'>
            <Button
              sx={{ height: 30, marginLeft: 1, marginRight: 'auto' }}
              size='small'
              variant='contained'
              color='success'
              onClick={saveUserValues}
            >
              <SaveRoundedIcon sx={{ fontSize: 20 }} />
            </Button>
          </Tooltip>
        </ListItem>
        <ListItem>
          <Typography
            sx={{
              marginX: 'auto',
              marginY: 1,
              boxShadow: 1,
              paddingX: 3,
              paddingY: 1,
              backgroundColor: '#b39ddb',
              borderRadius: 1,
            }}
            variant='h6'
          >
            Get Digits
          </Typography>
        </ListItem>
        <ListItem sx={{ marginTop: 1 }}>
          <Typography variant='button' sx={{ marginX: 1, fontSize: 15 }}>
            Name:
          </Typography>
          <TextField
            sx={{ width: 180, marginX: 1 }}
            size='small'
            value={shapeName}
            onChange={(e) => {
              setShapeName(e.target.value);
              handleNameValidation(e);
            }}
          ></TextField>
        </ListItem>
        <ListItem>
          <Typography
            sx={{ marginX: 'auto', boxShadow: 1, paddingX: 1, display: 'none' }}
            variant='subtitle2'
            id='name-error-box'
          ></Typography>
        </ListItem>
        <ListItem>
          <Typography variant='button' sx={{ marginX: 1, fontSize: 15 }}>
            Result Variable =
          </Typography>

          {userVariables.length > 0 ? (
            <Select
              value={resultName}
              onChange={(e) => {
                setResultName(e.target.value);
              }}
            >
              {userVariables.map((el, i) => {
                return (
                  <MenuItem key={i} value={el.name}>
                    {el.name}
                  </MenuItem>
                );
              })}
            </Select>
          ) : (
            <Typography sx={{ color: '#f44336', fontSize: 18 }} variant='h6'>
              No variables added
            </Typography>
          )}
        </ListItem>
        <ListItem>
          <Tabs
            sx={{ marginX: 'auto' }}
            value={tabValue}
            onChange={(e, newVal) => {
              setTabValue(newVal);
            }}
          >
            <Tab label='Message List' />
            <Tab label='Parameters' />
          </Tabs>
        </ListItem>
        <Box id='tabPanel1'>
          <ListItem>
            <Typography variant='subtitle1'>Select object type:</Typography>
            <Select
              value={msgObjType}
              onChange={(e) => {
                setMsgObjType(e.target.value);
              }}
              sx={{ marginX: 2 }}
            >
              <MenuItem value='prompt'>Prompt</MenuItem>
              <MenuItem value='number'>Number</MenuItem>
              <MenuItem value='ordinal'>Ordinal</MenuItem>
              <MenuItem value='amount'>Amount</MenuItem>
              <MenuItem value='digit'>Digit</MenuItem>
              <MenuItem value='date'>Date</MenuItem>
              <MenuItem value='day'>Day</MenuItem>
              <MenuItem value='month'>Month</MenuItem>
              <MenuItem value='time'>Time</MenuItem>
            </Select>
            <Tooltip title='Add'>
              <AddBoxRoundedIcon
                sx={{
                  color: '#69f0ae',
                  marginX: 0.5,
                  border: '1.2px solid black',
                  width: 30,
                  height: 30,
                  padding: 0.2,
                  borderRadius: 1,
                }}
                onClick={() => {
                  setMsgObjType('prompt');
                  addInput();
                }}
              />
            </Tooltip>
            <Tooltip title='Remove'>
              <RemoveCircleRoundedIcon
                sx={{
                  color: '#ff5252',
                  marginX: 0.5,
                  border: '1.2px solid black',
                  width: 30,
                  height: 30,
                  padding: 0.2,
                  borderRadius: 1,
                }}
                onClick={removeInput}
              />
            </Tooltip>
          </ListItem>
          <pre>{JSON.stringify(msgObj, null, 2)}</pre>{' '}
          <List>
            {msgObj.map((el, i) => {
              return addInputElements(el.type, i, msgObj, setMsgObj);
            })}
          </List>
          <ListItem>
            <Typography
              sx={{
                color: '#e53935',
                paddingX: 2,
                boxShadow: 2,
                visibility: 'hidden',
              }}
              id='error-box'
              variant='button'
            ></Typography>
          </ListItem>
        </Box>
        <Box sx={{ display: 'none' }} id='tabPanel2'>
          <ListItem sx={{ marginTop: 2 }}>
            <Typography sx={{ fontSize: 18 }} variant='h6'>
              minDigits:
            </Typography>
            <Select
              size='small'
              sx={{ marginX: 2 }}
              id='minDigits-select'
              value={minDigits}
              onChange={(e) => {
                setMinDigits(e.target.value);
              }}
            >
              {
                // Array of 1..20
                [...Array(21).keys()].slice(1).map((el, i) => {
                  return (
                    <MenuItem key={i} value={el}>
                      {el}
                    </MenuItem>
                  );
                })
              }
            </Select>
          </ListItem>
          <ListItem sx={{ marginTop: 2 }}>
            <Typography sx={{ fontSize: 18 }} variant='h6'>
              maxDigits:
            </Typography>
            <Select
              size='small'
              sx={{ marginX: 2 }}
              id='maxDigits-select'
              value={maxDigits}
              onChange={(e) => {
                setMaxDigits(e.target.value);
              }}
            >
              {[...Array(21).keys()].slice(1).map((el, i) => {
                return (
                  <MenuItem key={i} value={el}>
                    {el}
                  </MenuItem>
                );
              })}
            </Select>
          </ListItem>
          <pre>{JSON.stringify(paramsObj, undefined, 2)}</pre>
          <ListItem>
            <Typography
              sx={{
                fontWeight: 410,
                marginTop: 4,
                borderBottom: 1,
              }}
              variant='subtitle1'
            >
              Optional Params
            </Typography>
          </ListItem>
          <ListItem>
            <Select
              size='small'
              sx={{ marginX: 2 }}
              value={paramsObjType}
              onChange={(e) => {
                setParamsObjType(e.target.value);
              }}
            >
              <MenuItem value='terminator'>terminator</MenuItem>
              <MenuItem value='maxRetries'>maxRetries</MenuItem>
              <MenuItem value='invalidAction'>invalidAction</MenuItem>
              <MenuItem value='timeoutAction'>timeoutAction</MenuItem>
              <MenuItem value='invalidPrompt'>invalidPrompt</MenuItem>
            </Select>
            <Tooltip title='Add'>
              <AddBoxRoundedIcon
                sx={{
                  color: '#69f0ae',
                  marginLeft: 'auto',
                  marginRight: 0.5,
                  border: '1.2px solid black',
                  width: 25,
                  height: 25,
                  padding: 0.2,
                  borderRadius: 1,
                }}
                onClick={addParamsInput}
              />
            </Tooltip>
            <Tooltip title='Remove'>
              <RemoveCircleRoundedIcon
                sx={{
                  color: '#ff5252',
                  marginLeft: 0.5,
                  marginRight: 2,
                  border: '1.2px solid black',
                  width: 25,
                  height: 25,
                  padding: 0.2,
                  borderRadius: 1,
                }}
                onClick={removeParamsInput}
              />
            </Tooltip>
          </ListItem>
          <List>
            {paramsObj.map((el, i) => {
              return addParamsElements(el.type, i, paramsObj, setParamsObj);
            })}
          </List>
        </Box>
      </List>
    </>
  );
};

export default GetDigits;