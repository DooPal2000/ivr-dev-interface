import {
  Box,
  Divider,
  FormControlLabel,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

const LogDrawer = ({logText, setLogText}) => {
  function handleLogTextChange(event, type) {
    const newText = event.target.value;
    setLogText((prevLogText) => ({
      ...prevLogText,
      [type]: {
        ...prevLogText[type],
        text: newText,
      },
    }));
  }

  return (
    <List>
      <ListItem sx={{mt: 2}}>
        <Stack sx={{width: '100%'}}>
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Typography fontSize='large' variant='subtitle2' sx={{mr: 4}}>
              Before
            </Typography>
            <RadioGroup
              sx={{ml: 'auto'}}
              row
              name='log-before-radio-button'
              value={logText.before.type}
              onChange={(event) => {
                setLogText((prevLogText) => ({
                  ...prevLogText,
                  before: {
                    ...prevLogText.before,
                    type: event.target.value,
                  },
                }));
              }}>
              <FormControlLabel
                value='trace'
                control={<Radio />}
                label='Trace'
              />
              <FormControlLabel value='info' control={<Radio />} label='Info' />
            </RadioGroup>
          </Box>
          <Box>
            <TextField
              sx={{backgroundColor: '#f5f5f5'}}
              size='small'
              minRows={3}
              inputProps={{spellCheck: 'false'}}
              fullWidth
              multiline
              value={logText.before.text}
              onChange={(event) => handleLogTextChange(event, 'before')}
            />
          </Box>
        </Stack>
      </ListItem>
      <Divider sx={{my: 2}} />
      <ListItem>
        <Stack sx={{width: '100%'}}>
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Typography fontSize='large' variant='subtitle2' sx={{mr: 4}}>
              After
            </Typography>
            <RadioGroup
              sx={{ml: 'auto'}}
              row
              name='log-after-radio-button'
              value={logText.after.type}
              onChange={(event) => {
                setLogText((prevLogText) => ({
                  ...prevLogText,
                  after: {
                    ...prevLogText.after,
                    type: event.target.value,
                  },
                }));
              }}>
              <FormControlLabel
                value='trace'
                control={<Radio />}
                label='Trace'
              />
              <FormControlLabel value='info' control={<Radio />} label='Info' />
            </RadioGroup>
          </Box>
          <Box>
            <TextField
              sx={{backgroundColor: '#f5f5f5'}}
              size='small'
              minRows={3}
              inputProps={{spellCheck: 'false'}}
              fullWidth
              multiline
              value={logText.after.text}
              onChange={(event) => handleLogTextChange(event, 'after')}
            />
          </Box>
        </Stack>
      </ListItem>
    </List>
  );
};

export default LogDrawer;
