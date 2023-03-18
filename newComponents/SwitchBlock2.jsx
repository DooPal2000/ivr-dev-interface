import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import SaveIcon from '@mui/icons-material/Save';
import {
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {useEffect, useRef, useState} from 'react';
import {checkValidity} from '../src/helpers';
import {isNameUnique} from '../src/myFunctions';

const SwitchBlock = ({
  shape,
  handleCloseDrawer,
  shapes,
  clearAndDraw,
  userVariables,
  openVariableManager,
}) => {
  const [name, setName] = useState(shape.text);
  const [successText, setSuccessText] = useState('');
  const [errorText, setErrorText] = useState('');
  const [actions, setActions] = useState(
    shape.userValues?.actions ?? [{condition: '', action: ''}]
  );
  const [defaultAction, setDefaultAction] = useState(
    shape.userValues?.defaultAction ?? 'default'
  );

  const errors = useRef({});

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSuccessText('');
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [successText]);

  function handleNameChange(e) {
    const {value} = e.target;

    setName(value);

    const isValidFormat = checkValidity('object', value);
    if (isValidFormat !== -1) {
      setErrorText(isValidFormat);
      errors.current.name = true;
      return;
    }

    const isUnique = isNameUnique(value, shape, shapes);
    if (!isUnique) {
      setErrorText('Id not unique.');
      errors.current.name = true;
    } else {
      setErrorText('');
      errors.current.name = undefined;
    }
  }

  function handleSave() {
    if (errors.current.name) {
      setErrorText('Id not valid.');
      return;
    }
    shape.setText(name);
    clearAndDraw();

    shape.setUserValues({
      actions,
      defaultAction,
    });

    setErrorText('');
    setSuccessText('Saved.');
  }

  function handleAddAction() {
    const updatedActions = [...actions];
    const rowNumber = updatedActions.length + 1;
    updatedActions.push({
      condition: '',
      action: '',
    });
    setActions(updatedActions);
  }

  function handleActionFieldChange(name, value, index) {
    const updatedActions = [...actions];
    updatedActions[index][name] = value;
    setActions(updatedActions);
  }

  function handleDeleteAction(index) {
    const updatedActions = [...actions];
    updatedActions.splice(index, 1);
    setActions(updatedActions);
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
          sx={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 'extra-large',
            height: 40,
          }}
          variant='h5'>
          {
            <img
              src='/icons/switchBlack.png'
              alt='Icon'
              height={'22px'}
              width={'22px'}
            />
          }
          &nbsp;Switch
        </Typography>
        <IconButton
          size='small'
          onClick={openVariableManager}
          sx={{
            ml: 'auto',
            backgroundColor: '#263238',
            color: 'white',
            '&:hover': {backgroundColor: '#26a69a'},
            height: 30,
            width: 30,
          }}>
          <img
            src='/icons/variableManagerWhite.png'
            alt='Icon'
            height={'16px'}
            width={'16px'}
          />
        </IconButton>

        <IconButton
          size='small'
          sx={{
            ml: 1,
            backgroundColor: '#263238',
            color: 'white',
            '&:hover': {backgroundColor: '#29b6f6'},
            height: 30,
            width: 30,
          }}>
          <QuestionMarkIcon sx={{fontSize: '20px'}} />
        </IconButton>
        <IconButton
          onClick={handleCloseDrawer}
          size='small'
          sx={{
            ml: 1,
            backgroundColor: '#263238',
            color: 'white',
            '&:hover': {backgroundColor: '#ef5350'},
            height: 30,
            width: 30,
          }}>
          <CloseIcon sx={{fontSize: '22px'}} />
        </IconButton>
      </ListItem>
      <Box sx={{backgroundColor: '#eeeeee', height: '100%'}}>
        <Stack>
          <Typography sx={{ml: 2, mt: 1}} fontSize='large' variant='subtitle2'>
            ID
          </Typography>
          <ListItem sx={{mt: -1}}>
            <TextField
              onChange={handleNameChange}
              value={name}
              sx={{minWidth: '220px', backgroundColor: '#f5f5f5'}}
              size='small'
              error={errors.current.name}
            />
            <Button
              onClick={handleSave}
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
        </Stack>
        <Divider />
        <List sx={{backgroundColor: '#eeeeee'}}>
          {actions.map((row, i) => (
            <Stack sx={{px: 2, py: 1}} key={i}>
              <Stack>
                <Typography sx={{fontSize: '1rem'}} variant='subtitle2'>
                  Condition
                </Typography>
                <TextField
                  sx={{backgroundColor: '#f5f5f5', width: 350}}
                  size='small'
                  value={row.condition}
                  onChange={(e) =>
                    handleActionFieldChange('condition', e.target.value, i)
                  }
                />
              </Stack>
              <Stack sx={{mt: 1}}>
                <Typography sx={{fontSize: '1rem'}} variant='subtitle2'>
                  Action
                </Typography>
                <Box sx={{display: 'flex', alignItems: 'center'}}>
                  <TextField
                    sx={{
                      mr: i == 0 && '35px',
                      backgroundColor: '#f5f5f5',
                      width: 200,
                    }}
                    size='small'
                    value={row.action}
                    onChange={(e) =>
                      handleActionFieldChange('action', e.target.value, i)
                    }
                  />

                  {i > 0 && (
                    <IconButton
                      color='error'
                      size='small'
                      onClick={() => handleDeleteAction(i)}
                      sx={{
                        ml: 'auto',
                        mr: 1,
                        backgroundColor: '#cfcfcf',
                        '&:hover': {backgroundColor: '#c7c1bd'},
                        height: 30,
                        width: 30,
                      }}>
                      <DeleteIcon sx={{color: '#424242'}} />
                    </IconButton>
                  )}
                </Box>
              </Stack>
              <Divider sx={{mt: 4}} />
            </Stack>
          ))}
          <Stack sx={{px: 2, py: 1}}>
            <Typography sx={{fontSize: '1rem'}} variant='subtitle2'>
              Default Action
            </Typography>
            <Box sx={{display: 'flex', alignItems: 'center'}}>
              <TextField
                sx={{backgroundColor: '#f5f5f5', width: 200}}
                value={defaultAction}
                onChange={(e) => setDefaultAction(e.target.value)}
                size='small'
              />
              <Button
                sx={{
                  backgroundColor: '#bdbdbd',
                  color: 'black',
                  '&:hover': {backgroundColor: '#9ccc65'},
                  ml: 'auto',
                  mr: 1,
                }}
                onClick={handleAddAction}
                variant='contained'>
                Add
              </Button>
            </Box>
          </Stack>
        </List>
      </Box>
    </>
  );
};

export default SwitchBlock;