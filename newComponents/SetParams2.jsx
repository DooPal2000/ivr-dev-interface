import {
  Box,
  Button,
  Divider,
  Drawer,
  FormLabel,
  IconButton,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Select,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import defaultParams from '../src/defaultParams';
import {useEffect, useRef, useState} from 'react';

const SetParams = ({shape, handleCloseDrawer, shapes, clearAndDraw}) => {
  const [name, setName] = useState(shape.text);
  const [selectedParameterIndex, setSelectedParameterIndex] = useState('');
  const [currentParameter, setCurrentParameter] = useState({});
  const [modifiedParameters, setModifiedParameters] = useState(
    shape.userValues?.params ?? []
  );
  const [successText, setSuccessText] = useState('');
  const [errorText, setErrorText] = useState('');

  const errors = useRef({});

  useEffect(() => {
    shape.setUserValues({
      params: modifiedParameters,
    });
  }, [modifiedParameters]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSuccessText('');
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [successText]);

  function handleSaveName() {
    shape.setText(name);
    clearAndDraw();
    setErrorText('');
    setSuccessText('ID Updated.');
  }

  function handleSelectedParameterIndexChange(e) {
    setSelectedParameterIndex(e.target.value);

    const currentParam = {...defaultParams[e.target.value]};
    const duplicate = modifiedParameters.find(
      (p) => p.name === currentParam.name
    );

    if (duplicate) {
      console.log('duplicate found✨');
      currentParam.value = duplicate.value;
    }

    setCurrentParameter(currentParam);
    setErrorText('');
  }

  function handleFieldChange(e) {
    console.log('yo:', e.target.value);
    setCurrentParameter({...currentParameter, value: e.target.value});
    if (!currentParameter.type) {
      const valid = validateUserInput(e.target.value);

      if (valid) setErrorText(valid);
      else setErrorText('');
    }
  }
  function handleFieldChangeSwitch(e) {
    setCurrentParameter({...currentParameter, value: e.target.checked});
  }

  function handleAddModifiedParameter() {
    if (errors.current[currentParameter.name]) {
      setErrorText('Cannot Save.');
      return;
    }

    const index = modifiedParameters.findIndex(
      (param) => param.name === currentParameter.name
    );
    if (index !== -1) {
      const updatedParameters = [...modifiedParameters];
      updatedParameters[index] = {
        name: currentParameter.name,
        value: currentParameter.value,
      };
      setModifiedParameters(updatedParameters);
    } else {
      setModifiedParameters([
        ...modifiedParameters,
        {name: currentParameter.name, value: currentParameter.value},
      ]);
    }
    setErrorText('');
    setSuccessText('Parameter Updated.');
  }

  function handleDeleteModifiedParameter(index) {
    setModifiedParameters((p) => {
      const temp = [...p];
      temp.splice(index, 1);
      return temp;
    });
    setErrorText('');
    setSuccessText('Deleted.');
  }

  function validateUserInput(input) {
    switch (currentParameter.name) {
      case 'menuTimeout':
      case 'interTimeout':
      case 'firstTimeout': {
        errors.current[currentParameter.name] = true;
        const numberRegex = /^[0-9]+$/;
        if (!input || !input.match(numberRegex))
          return 'Enter a valid number between 3 and 30';
        else if (Number(input) < 3) {
          return 'Input too small';
        } else if (Number(input) > 30) {
          return 'Input too big';
        } else {
          errors.current[currentParameter.name] = undefined;
          return false;
        }
      }
      case 'maxCallTime': {
        errors.current[currentParameter.name] = true;
        const numberRegex = /^[0-9]+$/;
        if (!input || !input.match(numberRegex)) return 'Enter a valid number.';
        else if (Number(input) < 60) {
          return 'Input too small';
        } else if (Number(input) > 9999) {
          return 'Input too big';
        } else {
          errors.current[currentParameter.name] = undefined;
          return false;
        }
      }
      case 'timeoutPrompt':
      case 'cancelPrompt':
      case 'goodbyeMessage':
      case 'terminateMessage':
      case 'transferPrompt':
      case 'disconnectPrompt':
      case 'previousMenuPrompt':
      case 'mainMenuPrompt':
      case 'repeatInfoPrompt':
      case 'confirmPrompt':
      case 'invalidPrompt': {
        errors.current[currentParameter.name] = true;
        const promptRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
        if (!input || !input.match(promptRegex))
          return 'Prompt not in valid format.';
        else {
          errors.current[currentParameter.name] = undefined;
          return false;
        }
      }
      case 'allowedDigits': {
        errors.current[currentParameter.name] = true;
        const numberRegex = /^[0-9]+$/;
        if (!input || !input.match(numberRegex)) return 'Enter a valid number.';
        else {
          errors.current[currentParameter.name] = undefined;
          return false;
        }
      }
    }
  }

  return (
    <>
      <ListItem
        sx={{
          backgroundColor: '#cfd8dc',
          display: 'flex',
          boxShadow: 2,
          p: 1,
        }}>
        <Typography
          sx={{display: 'flex', alignItems: 'center', fontSize: 'extra-large'}}
          variant='h5'>
          {
            <img
              src='/icons/setParamsBlack.png'
              alt='Icon'
              height={'22px'}
              width={'22px'}
            />
          }
          &nbsp; Set Params
        </Typography>

        <IconButton
          onClick={handleCloseDrawer}
          size='small'
          sx={{
            ml: 'auto',
            backgroundColor: '#424242',
            color: 'white',
            '&:hover': {backgroundColor: '#ef5350'},
          }}>
          <CloseIcon sx={{fontSize: '22px'}} />
        </IconButton>
      </ListItem>
      <Box sx={{backgroundColor: '#eeeeee', height: '100%'}}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#F3F3F3',
          }}>
          <Typography sx={{ml: 2, mt: 1}} fontSize='large' variant='subtitle2'>
            ID
          </Typography>
          <ListItem sx={{mt: -1}}>
            <TextField
              onChange={(e) => setName(e.target.value)}
              value={name}
              sx={{minWidth: '220px'}}
              size='small'
            />
            <Button
              onClick={handleSaveName}
              sx={{ml: 2}}
              size='small'
              variant='contained'>
              <SaveIcon />
            </Button>
          </ListItem>
          <ListItem sx={{height: 30}}>
            {successText && (
              <Typography sx={{mt: -1, color: 'green', mx: 'auto'}}>
                {successText}
              </Typography>
            )}
            {!successText && (
              <Typography
                fontSize='small'
                sx={{mt: -1, color: 'red', mx: 'auto'}}>
                {errorText}
              </Typography>
            )}
          </ListItem>
        </Box>

        <Divider />
        <List sx={{minWidth: 350}}>
          <ListItem>
            <Box sx={{display: 'flex', flexDirection: 'column'}}>
              <Typography fontSize='large' variant='subtitle1'>
                Parameters
              </Typography>
              <Select
                value={selectedParameterIndex}
                onChange={handleSelectedParameterIndexChange}
                labelId='paramteter-label'
                sx={{minWidth: '220px', backgroundColor: '#efefef'}}
                size='small'>
                {defaultParams.map((p, i) => (
                  <MenuItem value={i} key={i}>
                    {p.name}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </ListItem>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              py: 2,
              backgroundColor: '#fafafa',
              my: 1,
              boxShadow: 1,
            }}>
            {currentParameter.name ? (
              <>
                <Typography sx={{ml: 2, mb: -1}} variant='body1'>
                  {currentParameter.name}
                </Typography>
                <ListItem>
                  {currentParameter.type === 'select' && (
                    <Select
                      sx={{minWidth: '220px', backgroundColor: 'white'}}
                      size='small'
                      value={currentParameter.value}
                      onChange={handleFieldChange}>
                      {currentParameter.optionList?.map((p, i) => (
                        <MenuItem value={p} key={i}>
                          {p}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                  {!currentParameter.type && (
                    <TextField
                      sx={{minWidth: '220px', backgroundColor: 'white'}}
                      size='small'
                      name='name'
                      value={currentParameter.value}
                      onChange={handleFieldChange}
                      error={errors.current[currentParameter.name]}
                    />
                  )}
                  {currentParameter.type === 'switch' && (
                    <Box sx={{width: '220px'}}>
                      <Switch
                        onChange={handleFieldChangeSwitch}
                        checked={currentParameter.value}
                      />
                    </Box>
                  )}

                  <Button
                    onClick={handleAddModifiedParameter}
                    sx={{ml: 2}}
                    size='small'
                    variant='contained'>
                    <SaveIcon />
                  </Button>
                </ListItem>
              </>
            ) : (
              <>
                <Typography sx={{ml: 2, mb: -1}} variant='body1'>
                  &nbsp;
                </Typography>
                <ListItem>
                  <Select
                    sx={{minWidth: '220px', backgroundColor: 'white'}}
                    size='small'
                    value={''}
                    disabled
                  />
                  <Button
                    onClick={handleAddModifiedParameter}
                    sx={{ml: 2}}
                    size='small'
                    variant='contained'
                    disabled>
                    <SaveIcon />
                  </Button>
                </ListItem>
              </>
            )}
          </Box>
        </List>
        <List>
          {modifiedParameters.map((p, i) => (
            <ListItem
              disablePadding
              sx={{
                backgroundColor: i % 2 == 0 ? '#e0e0e0' : '#eeeeee',
                px: 2,
                py: 0.5,
                borderTop: i === 0 && '1px solid #bdbdbd',
                borderBottom: '1px solid #bdbdbd',
              }}
              key={i}>
              <Typography sx={{width: '40%'}} variant='subtitle2'>
                {p.name}
              </Typography>

              <Typography
                sx={{
                  ml: 2,
                }}>
                {typeof p.value === 'boolean' ? `${p.value}` : p.value}
              </Typography>

              <Button
                onClick={() => handleDeleteModifiedParameter(i)}
                sx={{ml: 'auto'}}
                color='error'>
                <DeleteIcon sx={{color: '#424242'}} />
              </Button>
            </ListItem>
          ))}
        </List>
      </Box>
    </>
  );
};

export default SetParams;
