const defaultParams = [
  {
    name: 'maxRetries',
    value: 1,
    type: 'select',
    optionList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  },
  {
    name: 'maxRepeats',
    value: 1,
    type: 'select',
    optionList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  },
  {
    name: 'language',
    value: 'enBcx',
  },
  {
    name: 'currency',
    value: 'SAR',
  },
  {
    name: 'terminator',
    value: 'X',
    type: 'select',
    optionList: [
      'X',
      '#',
      '*',
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
    ],
  },
  { name: 'firstTimeout', value: 10 },
  { name: 'interTimeout', value: 5 },
  { name: 'menuTimeout', value: 5 },
  { name: 'maxCallTime', value: 3600 },
  { name: 'invalidAction', value: 'disconnect' },
  { name: 'timeoutAction', value: 'disconnect' },
  {
    name: 'confirmOption',
    value: 1,
    type: 'select',
    optionList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  },
  {
    name: 'cancelOption',
    value: 2,
    type: 'select',
    optionList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  },
  { name: 'invalidPrompt', value: 'std-invalid' },
  { name: 'timeoutPrompt', value: 'std-timeout' },
  { name: 'cancelPrompt', value: 'std-cancel' },
  {
    name: 'goodbyeMessage',
    value: 'std-goodbye',
  },
  {
    name: 'terminateMessage',
    value: 'std-terminate',
  },
  {
    name: 'repeatInfoPrompt',
    value: 'std-repeat-info',
  },
  {
    name: 'confirmPrompt',
    value: 'std-confirm',
  },
  {
    name: 'hotkeyMainMenu',
    value: 'X',
    type: 'select',
    optionList: [
      'X',
      '#',
      '*',
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
    ],
  },
  {
    name: 'hotkeyTransfer',
    value: 'X',
    type: 'select',
    optionList: [
      'X',
      '#',
      '*',
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
    ],
  },
  {
    name: 'transferPoint',
    value: '',
  },
  {
    name: 'invalidTransferPoint',
    value: '',
  },
  {
    name: 'timeoutTransferPoint',
    value: '',
  },
  {
    name: 'logDB',
    value: false,
    type: 'switch',
  },
];

export default defaultParams;
