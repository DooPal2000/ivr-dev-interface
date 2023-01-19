import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  List,
  ListItem
} from '@mui/material';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';

const DrawerUserGuideDialog = ({open, handleClose, name = ''}) => {
  const shapeToGuideMap = {
    setParams: `The setParams block is used to both set the global parameters and start the IVR flow.-It should be the first block used in the IVR flow.-The parameter list contains all the call parameters with their default values set.-To update any parameters, select them and change the value.-Click the 'save' button beside it to add it to the updated parameter list.`,
    runScript: `The runScript block is used to execute any script based on IVR variables and modify any IVR variables.-The script must be written in valid Javascript format.-To check for any syntax errors, click the validate button before saving.`,
    getDigits: `The getDigits block is used to collect one or more digits from the user, such as a phone number or account number.-The result variable is used to store the value entered by the user. All variables must be defined in the setVariables block before using them in the getDigits block.-In the message list tab, you can add any object by selecting the object type and clicking the add button.-In the parameters tab, there are two parameters: minDigits and maxDigits.-minDigits: is the minimum number of digits required from the user.-maxDigits: is the maximum number of digits required from the user.
   `,
    playMessage: `The playMessage block allows you to play one or more items together.-To add items to the message list, navigate to the message list tab. Here, you can select the object type and click the "add" button to include it in the list.-In the "parameters" tab, there are two options available to customize the playMessage experience.-interruptible: determines whether user input can interrupt the playback of the message. If you want the message to play in full without interruption, set this option to false.-repeatOption: allows you to set a digit that, when entered by the user, will repeat the currently playing message. If you want to disable the repeat option, set this option to "X."`,
    playConfirm: `The PlayConfirm block allows you to play one or more items with confirmation. For example, it allows you to play a message and ask the user to press 1 to confirm or 2 to cancel.-To add items to the message list, navigate to the Message List tab. Here, you can select the object type and click the "Add" button to include it in the list.-In the "Parameters" tab, there are four options available to customize the PlayConfirm experience.-confirmOption: allows you to specify the digit for the user to confirm their choice.-cancelOption: allows you to specify the digit for the user to cancel their choice.-confirmPrompt: is the message played to ask for confirmation.-cancel Prompt is the message played to ask for cancellation.`,
    playMenu: `The PlayMenu block is used to control the flow of an IVR system based on the user's choice. It can have multiple exit points.-ignoreBuffer: This option is used to discard any digits pressed before the menu starts playing. If set to true, any digits entered before the menu starts will be ignored and the caller will be prompted to enter their choice again after the menu starts playing. If set to false (default), the digits entered before the menu starts will be considered as the caller's input for the menu.
    -logDb: This option can be used to trace the actions of the caller and keep track of statistics. If set to true, the menu will be considered for statistics. If set to false (default), the menu will be ignored for statistics.-The items tab is used to add menu items for each digits.-disable: If set to true (default is false), this option will not be played and the digit specified will be considered as invalid input.-silent: If set to true (default is false), this option will not be played (hidden), but if the caller presses the specified digit, the flow will continue with the action specified.
    -skip: This option is set to 0 by default. If set to 1, the first time the menu is played, this option will be hidden. From the second iteration onwards, this item will be played. This option indicates for how many iterations this option should be skipped (hidden). Please note that even though the option is hidden, the digit input is still valid.`,
    endFlow: `The endFlow block is used to end an IVR flow. It offers two options: Disconnect and Transfer.-Disconnect: This option will end the call flow and disconnect the call.-Transfer: This option will transfer the call flow to the preset transfer point.`,
    jumper: `The jumper block is used to transfer control flow within a program and navigate between pages. It has two types of jumpers: entry and exit.-Exit: This is the default option. It cannot be used as the 'from' shape.-Entry: This jumper cannot be the 'to' shape. It should have the same name as the corresponding exit jumper in order to properly navigate.`,
    switch: `The switch block is used to control the IVR flow based on specific conditions. These conditions can be determined by the value of any defined variables.-To use the switch block, you should have at least two conditions including the default one.-Conditions can be added or removed using the buttons located at the bottom of the block.`,
    callAPI: `The callAPI block is used to query an API and set the output variables.-To use the callAPI block, all variables used by the block must be defined in the setVariables block.-Once the variables are set, you can use the callAPI block to query the API and set the output variables.`
  };

  const items = shapeToGuideMap[name]?.split('-') || '';

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <DialogTitle sx={{display: 'flex', alignItems: 'center'}}>
        <HelpCenterIcon sx={{mr: 0.5}} />
        Guide
      </DialogTitle>
      <DialogContent>
        {items && (
          <List>
            {items.map((item, i) => (
              <ListItem sx={{p: 0, pb: 1}} key={i}>
                <Typography fontSize='large' variant='body2'>
                  - {item}
                </Typography>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DrawerUserGuideDialog;