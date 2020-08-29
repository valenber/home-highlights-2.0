import React, { useState } from 'react';
import {
  Modal,
  Typography,
  TextField,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  IconButton,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { AgendaEventCategory } from '../../data/dbSchema';

const optionsCategory: AgendaEventCategory[] = [
  'home',
  'current',
  'exhibitions',
  'theatreanddance',
  'music',
  'sports',
  'fairs',
  'events',
  'christmas',
];

const EditorForm = (
  <form className="editorForm">
    <div className="editorForm__title">
      <Typography variant="h4" component="h5" color="textPrimary">
        Event editor
      </Typography>
      <Typography variant="body1" component="h5" color="textSecondary">
        Please fill in event details
      </Typography>
    </div>

    <IconButton aria-label="delete" className="modalCloseButton" tabIndex={-1}>
      <CloseIcon fontSize="large" color="primary" />
    </IconButton>

    <TextField
      id="eventName"
      className="eventName"
      label="Event Name"
      variant="outlined"
    />

    <TextField
      id="eventStartDate"
      className="eventStartDate"
      label="Start"
      type="date"
      variant="outlined"
      InputLabelProps={{
        shrink: true,
      }}
    />

    <TextField
      id="eventEndDate"
      className="eventEndDate"
      label="End"
      type="date"
      variant="outlined"
      InputLabelProps={{
        shrink: true,
      }}
    />

    <TextField
      id="eventCategory"
      className="eventCategory"
      select
      label="Event category"
      onChange={(): void => console.log('changed')}
      variant="outlined"
    >
      {optionsCategory.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </TextField>

    <RadioGroup
      name="eventStatus"
      className="eventStatus"
      value="candidate"
      onChange={(): void => console.log('change')}
    >
      <FormControlLabel
        value="candidate"
        control={<Radio />}
        label="Candidate"
      />
      <FormControlLabel
        value="highlight"
        control={<Radio />}
        label="Highlight"
      />
      <FormControlLabel
        value="mainfocus"
        control={<Radio />}
        label="Main focus"
      />
    </RadioGroup>

    <Button
      variant="contained"
      className="saveEventButton"
      color="primary"
      size="large"
    >
      Save event
    </Button>
  </form>
);

export const EditorFormModal: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(true);
  return (
    <Modal open={modalVisible} onClose={(): void => setModalVisible(false)}>
      {EditorForm}
    </Modal>
  );
};
