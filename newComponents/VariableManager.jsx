import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {useRef, useState} from 'react';
import {checkValidity} from '../src/helpers';

const VariableManager = ({isOpen, handleClose, userVariables}) => {
  const [variables, setVariables] = useState(userVariables.current);
  const [currentVariable, setCurrentVariable] = useState('');
  const [type, setType] = useState('prompt');
  const [name, setName] = useState('');
  const [defaultValue, setDefaultValue] = useState('');
  const [description, setDescription] = useState('');
  const [mode, setMode] = useState('');
  const [successText, setSuccessText] = useState('');
  const [errorText, setErrorText] = useState('');

  const errorObj = useRef({});

  function handleSave() {
    if (errorText !== '') return;

    if (!name) {
      setErrorText('Name is required.');
      return;
    }
    if (defaultValue === '') {
      setErrorText('Default value is required.');
      return;
    }

    if (errorObj.current.name) {
      setErrorText('Name not valid.');
      return;
    }

    if (errorObj.current.value) {
      setErrorText('Default value not valid.');
      return;
    }

    if (mode == 'modify') {
      const index = variables.findIndex((v) => v == currentVariable);

      if (index !== -1) {
        const updatedVariables = [...variables];
        updatedVariables[index] = {type, name, defaultValue, description};
        setVariables(updatedVariables);
        setSuccessText('Update successful.');
      } else {
        setErrorText('Update error.');
      }
    } else if (mode == 'add') {
      setVariables([...variables, {type, name, defaultValue, description}]);
      setSuccessText('New variable added.');
    }

    setMode('');
    setCurrentVariable('');
    setName('');
    setDefaultValue('');
    setDescription('');
  }

  function handleDelete() {
    const index = variables.findIndex((v) => v === currentVariable);

    setErrorText('');

    if (index !== -1) {
      const updatedVariables = [...variables];
      updatedVariables.splice(index, 1);
      setVariables(updatedVariables);
      setSuccessText('Delete successful.');
    } else {
      setErrorText('Delete error.');
    }

    setMode('');
    setType('prompt');
    setCurrentVariable('');
    setName('');
    setDefaultValue('');
    setDescription('');
  }

  function handleAddNewVariable() {
    setMode('add');
    setCurrentVariable('');
    setName('');
    setDefaultValue('');
    setDescription('');
    setSuccessText('');
    setErrorText('');
  }
  function handleValidation(objType, value) {
    let errorM = -1;
    if (objType === 'name' && value) {
      errorM = checkValidity('object', value);
    } else if (objType === 'value') {
      errorM = checkValidity(type, value);
    }

    if (errorM === -1) {
      // No error condition
      setErrorText('');
      errorObj.current[objType] = false;
      return;
    }

    errorObj.current[objType] = true;
    setErrorText(errorM);
  }

  return (
    <Drawer
      anchor='left'
      open={isOpen}
      onClose={() => {
        userVariables.current = variables;
        handleClose();
      }}>
      <List sx={{backgroundColor: '#cfd8dc', boxShadow: 2}}>
        <ListItem>
          <IconButton
            onClick={handleClose}
            sx={{
              ml: 'auto',
              backgroundColor: '#263238',
              color: 'white',
              '&:hover': {backgroundColor: '#ef5350'},
              height: 30,
              width: 30,
            }}>
            <CloseIcon sx={{fontSize: '22px'}} />
          </IconButton>
        </ListItem>
        <ListItem>
          <Typography
            sx={{mb: 1, display: 'flex', alignItems: 'center', mx: 'auto'}}
            variant='h5'>
            {
              <img
                src='/icons/variableManager.png'
                alt='Icon'
                height={'22px'}
                width={'22px'}
              />
            }
            &nbsp; VARIABLE MANAGER
          </Typography>
        </ListItem>
      </List>
      <Box sx={{backgroundColor: '#eeeeee', height: '100%'}}>
        <List sx={{minWidth: 400}}>
          <ListItem sx={{mt: 1}}>
            <Box sx={{display: 'flex', flexDirection: 'column'}}>
              <Typography fontSize='large' variant='subtitle1'>
                Parameters
              </Typography>
              <Select
                labelId='select-label'
                value={currentVariable}
                onChange={(e) => {
                  setCurrentVariable(e.target.value);
                  setType(e.target.value.type);
                  setName(e.target.value.name);
                  setDefaultValue(e.target.value.defaultValue);
                  setDescription(e.target.value.description);
                  setMode('');
                }}
                sx={{
                  minWidth: 220,
                  backgroundColor: '#f5f5f5',
                }}
                size='small'>
                {variables.map((v, i) => (
                  <MenuItem key={i} value={v}>
                    {v.name}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </ListItem>

          <ListItem>
            <Button
              sx={{
                backgroundColor: '#424242',
                color: 'white',
                '&:hover': {backgroundColor: '#9ccc65'},
              }}
              variant='contained'
              onClick={handleAddNewVariable}>
              Add
            </Button>
            <Button
              sx={{
                ml: 2,
                backgroundColor: '#424242',
                color: 'white',
                '&:hover': {backgroundColor: '#42a5f5'},
              }}
              variant='contained'
              onClick={() => {
                setMode('modify');
                setSuccessText('');
                setErrorText('');
              }}
              disabled={mode == 'modify' || !currentVariable}>
              Modify
            </Button>
            <Button
              sx={{
                ml: 2,
                backgroundColor: '#424242',
                color: 'white',
                '&:hover': {backgroundColor: '#ef5350'},
              }}
              variant='contained'
              onClick={handleDelete}
              disabled={mode != 'modify' || !currentVariable}>
              Delete
            </Button>
          </ListItem>
          <Divider sx={{mt: 1}} />
          <Box sx={{py: 1}}>
            <ListItem disablePadding>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  my: 1,
                  px: 2,
                }}>
                <Typography sx={{width: '100px'}} variant='subtitle2'>
                  Type
                </Typography>
                <Box sx={{display: 'flex', alignItems: 'center'}}>
                  <Select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    size='small'
                    disabled={!(mode == 'add' || mode == 'modify')}
                    sx={{
                      minWidth: 100,
                      backgroundColor:
                        mode == 'add' || mode == 'modify' ? 'white' : '#e0e0e0',
                    }}>
                    <MenuItem value='prompt'>Prompt</MenuItem>
                    <MenuItem value='number'>Number</MenuItem>
                    <MenuItem value='string'>String</MenuItem>
                    <MenuItem value='boolean'>Boolean</MenuItem>
                    <MenuItem value='date'>Date</MenuItem>
                    <MenuItem value='day'>Day</MenuItem>
                    <MenuItem value='month'>Month</MenuItem>
                    <MenuItem value='time'>Time</MenuItem>
                  </Select>
                  {successText && (
                    <Typography
                      sx={{
                        mx: 'auto',
                        color: 'green',
                        ml: 2,
                        backgroundColor: '#e5f9e5',
                        px: 2,
                        py: 0.5,
                        borderRadius: 1,
                        textAlign: 'center',
                        width: 'max-content',
                      }}
                      variant='subtitle2'>
                      {successText}
                    </Typography>
                  )}
                  {errorText && (
                    <Typography
                      sx={{
                        mx: 'auto',
                        color: 'red',
                        ml: 2,
                        backgroundColor: '#fce8e6',
                        px: 2,
                        py: 0.5,
                        textAlign: 'center',
                        borderRadius: 1,
                        width: 'max-content',
                      }}
                      variant='subtitle2'>
                      {errorText}
                    </Typography>
                  )}
                </Box>
              </Box>
            </ListItem>
            <ListItem disablePadding>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  px: 2,
                  my: 1,
                }}>
                <Typography variant='subtitle2'>Name</Typography>
                <TextField
                  value={name}
                  placeholder='required'
                  onChange={(e) => {
                    setName(e.target.value);
                    handleValidation('name', e.target.value);
                  }}
                  sx={{
                    width: 200,
                    backgroundColor:
                      mode == 'add' || mode == 'modify' ? 'white' : '#e0e0e0',
                  }}
                  size='small'
                  disabled={!(mode == 'add' || mode == 'modify')}
                />
              </Box>
            </ListItem>

            <ListItem disablePadding>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  px: 2,
                  my: 1,
                }}>
                <Typography variant='subtitle2'>Default Value</Typography>
                <Box sx={{display: 'flex', alignItems: 'center'}}>
                  <TextField
                    value={defaultValue}
                    placeholder='required'
                    onChange={(e) => {
                      setDefaultValue(e.target.value);
                      handleValidation('value', e.target.value);
                    }}
                    sx={{
                      width: 200,
                      backgroundColor:
                        mode == 'add' || mode == 'modify' ? 'white' : '#e0e0e0',
                    }}
                    size='small'
                    disabled={!(mode == 'add' || mode == 'modify')}
                  />
                  <Button
                    onClick={handleSave}
                    variant='contained'
                    disabled={!(mode == 'add' || mode == 'modify')}
                    sx={{ml: 2}}>
                    <SaveIcon />
                  </Button>
                </Box>
              </Box>
            </ListItem>
            <ListItem disablePadding>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  px: 2,
                  my: 1,
                }}>
                <Typography variant='subtitle2'>Description:</Typography>
                <TextField
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  sx={{
                    width: 200,
                    backgroundColor:
                      mode == 'add' || mode == 'modify' ? 'white' : '#e0e0e0',
                  }}
                  size='small'
                  multiline
                  disabled={!(mode == 'add' || mode == 'modify')}
                />
              </Box>
            </ListItem>
          </Box>
          <Divider />
        </List>
      </Box>
    </Drawer>
  );
};

export default VariableManager;
