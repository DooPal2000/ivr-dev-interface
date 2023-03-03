import {Box, Button, IconButton, Toolbar, Typography} from '@mui/material';
import Tooltip, {tooltipClasses} from '@mui/material/Tooltip';
import PentagonIcon from '@mui/icons-material/Pentagon';
import NumbersIcon from '@mui/icons-material/Numbers';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import {styled} from '@mui/material/styles';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import CancelIcon from '@mui/icons-material/Cancel';
import {useEffect, useState} from 'react';
import ApiIcon from '@mui/icons-material/Api';

const LightTooltip = styled(({className, ...props}) => (
  <Tooltip {...props} classes={{popper: className}} />
))(({theme}) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#fdf5ef',
    color: 'black',
    fontSize: 12.5,
  },
}));

const MainToolbar = ({selectedItemToolbar, handleSetSelectedItemToolbar}) => {
  return (
    <Box
      sx={{
        pt: '50px',
        pb: '35px',
        height: '100%',
        boxShadow: 2,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-evenly',
      }}>
      <LightTooltip title='start / setParams' placement='right'>
        <Button
          size='small'
          onClick={(e) => handleSetSelectedItemToolbar(e, 'setParams')}
          sx={{
            backgroundColor: selectedItemToolbar['setParams']
              ? '#FFA500'
              : '#ECEFF1',
          }}>
          {selectedItemToolbar['setParams'] ? (
            <img src='/icons/setParamsBlack.png' alt='Icon' height={'22px'} />
          ) : (
            <img src='/icons/setParams.png' alt='Icon' height={'22px'} />
          )}
        </Button>
      </LightTooltip>
      <LightTooltip title='playMessage' placement='right'>
        <Button
          onClick={(e) => handleSetSelectedItemToolbar(e, 'playMessage')}
          sx={{
            backgroundColor: selectedItemToolbar['playMessage']
              ? '#FFA500'
              : '#ECEFF1',
          }}
          size='small'>
          {selectedItemToolbar['playMessage'] ? (
            <img src='/icons/playMessageBlack.png' alt='Icon' height={'25px'} />
          ) : (
            <img src='/icons/playMessage.png' alt='Icon' height={'25px'} />
          )}
        </Button>
      </LightTooltip>
      <LightTooltip title='getDigits' placement='right'>
        <Button
          size='small'
          onClick={(e) => handleSetSelectedItemToolbar(e, 'getDigits')}
          sx={{
            backgroundColor: selectedItemToolbar['getDigits']
              ? '#FFA500'
              : '#ECEFF1',
          }}>
          {selectedItemToolbar['getDigits'] ? (
            <img src='/icons/getDigitsBlack.png' alt='Icon' height={'22px'} />
          ) : (
            <img src='/icons/getDigits.png' alt='Icon' height={'22px'} />
          )}
        </Button>
      </LightTooltip>
      <LightTooltip title='playConfirm' placement='right'>
        <Button
          size='small'
          onClick={(e) => handleSetSelectedItemToolbar(e, 'playConfirm')}
          sx={{
            backgroundColor: selectedItemToolbar['playConfirm']
              ? '#FFA500'
              : '#ECEFF1',
          }}>
          {selectedItemToolbar['playConfirm'] ? (
            <img src='/icons/playConfirmBlack.png' alt='Icon' height={'25px'} />
          ) : (
            <img src='/icons/playConfirm.png' alt='Icon' height={'25px'} />
          )}
        </Button>
      </LightTooltip>
      <LightTooltip title='playMenu' placement='right'>
        <Button
          size='small'
          onClick={(e) => handleSetSelectedItemToolbar(e, 'playMenu')}
          sx={{
            backgroundColor: selectedItemToolbar['playMenu']
              ? '#FFA500'
              : '#ECEFF1',
          }}>
          <PlaylistPlayIcon
            sx={{
              fontSize: '25px',
              color: selectedItemToolbar['playMenu'] ? 'black' : '#607D8B',
            }}
          />
        </Button>
      </LightTooltip>
      <LightTooltip title='runScript' placement='right'>
        <Button
          size='small'
          onClick={(e) => handleSetSelectedItemToolbar(e, 'runScript')}
          sx={{
            backgroundColor: selectedItemToolbar['runScript']
              ? '#FFA500'
              : '#ECEFF1',
          }}>
          {selectedItemToolbar['runScript'] ? (
            <img src='/icons/runScriptBlack.png' alt='Icon' height={'25px'} />
          ) : (
            <img src='/icons/runScript.png' alt='Icon' height={'25px'} />
          )}
        </Button>
      </LightTooltip>
      <LightTooltip title='switch' placement='right'>
        <Button
          size='small'
          onClick={(e) => handleSetSelectedItemToolbar(e, 'switch')}
          sx={{
            backgroundColor: selectedItemToolbar['switch']
              ? '#FFA500'
              : '#ECEFF1',
          }}>
          {selectedItemToolbar['switch'] ? (
            <img src='/icons/switchBlack.png' alt='Icon' height={'25px'} />
          ) : (
            <img src='/icons/switch.png' alt='Icon' height={'25px'} />
          )}
        </Button>
      </LightTooltip>
      <LightTooltip title='callAPI' placement='right'>
        <Button
          size='small'
          onClick={(e) => handleSetSelectedItemToolbar(e, 'callAPI')}
          sx={{
            backgroundColor: selectedItemToolbar['callAPI']
              ? '#FFA500'
              : '#ECEFF1',
          }}>
          {selectedItemToolbar['callAPI'] ? (
            <img src='/icons/callAPIBlack.png' alt='Icon' height={'25px'} />
          ) : (
            <img src='/icons/callAPI.png' alt='Icon' height={'25px'} />
          )}
        </Button>
      </LightTooltip>
      <LightTooltip title='endFlow' placement='right'>
        <Button
          size='small'
          onClick={(e) => handleSetSelectedItemToolbar(e, 'endFlow')}
          sx={{
            backgroundColor: selectedItemToolbar['endFlow']
              ? '#FFA500'
              : '#ECEFF1',
          }}>
          <CancelIcon
            sx={{
              fontSize: '20px',
              color: selectedItemToolbar['endFlow'] ? 'black' : '#607D8B',
            }}
          />
        </Button>
      </LightTooltip>
      <LightTooltip title='connector' placement='right'>
        <Button
          size='small'
          onClick={(e) => handleSetSelectedItemToolbar(e, 'connector')}
          sx={{
            backgroundColor: selectedItemToolbar['connector']
              ? '#FFA500'
              : '#ECEFF1',
          }}>
          <ControlPointIcon
            sx={{
              fontSize: '20px',
              color: selectedItemToolbar['connector'] ? 'black' : '#607D8B',
            }}
          />
        </Button>
      </LightTooltip>
      <LightTooltip title='jumper' placement='right'>
        <Button
          size='small'
          onClick={(e) => handleSetSelectedItemToolbar(e, 'jumper')}
          sx={{
            backgroundColor: selectedItemToolbar['jumper']
              ? '#FFA500'
              : '#ECEFF1',
          }}>
          {selectedItemToolbar['jumper'] ? (
            <img src='/icons/jumperBlack.png' alt='Icon' height={'20px'} />
          ) : (
            <img src='/icons/jumper.png' alt='Icon' height={'20px'} />
          )}
        </Button>
      </LightTooltip>
    </Box>
  );
};

export default MainToolbar;
