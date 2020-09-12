import React from 'react';
import { useSelector } from 'react-redux';
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
import { getEditedEvent } from '../../store/selectors/getEditedEvent';
import { useAppDispatch } from '../../store';
import { selectEventToEdit } from '../../store/editorSlice';

import { useForm } from './useForm';

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

export const EditorFormModal: React.FC = () => {
  const editedEvent = useSelector(getEditedEvent);
  const dispatch = useAppDispatch();
  const { values, handleInputChange } = useForm(editedEvent);
  const debugPanel = true;

  function handleModalClose(): void {
    dispatch(selectEventToEdit(false));
  }

  function handleFormSubmit(data: unknown): void {
    console.log(data);
  }

  return (
    <Modal open={!!editedEvent} onClose={handleModalClose}>
      <form className="editorForm" onSubmit={handleFormSubmit}>
        <div className="editorForm__title">
          <Typography variant="h4" component="h5" color="textPrimary">
            Event editor
          </Typography>
          <Typography variant="body1" component="h5" color="textSecondary">
            Please fill in event details
          </Typography>
        </div>

        <IconButton
          onClick={handleModalClose}
          aria-label="delete"
          className="modalCloseButton"
          tabIndex={-1}
        >
          <CloseIcon fontSize="large" color="primary" />
        </IconButton>

        <TextField
          id="eventName"
          autoFocus
          className="eventName"
          label="Event Name"
          variant="outlined"
          name="name"
          onChange={handleInputChange}
          value={values?.name}
          InputLabelProps={{
            shrink: !!values?.name,
          }}
        />

        <TextField
          id="eventStartDate"
          className="eventStartDate"
          label="Start"
          type="date"
          variant="outlined"
          name="start"
          value={values?.start ? values.start.split('T')[0] : null}
          onChange={handleInputChange}
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
          name="end"
          value={values?.end.split('T')[0]}
          onChange={handleInputChange}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          id="eventCategory"
          className="eventCategory"
          select
          label="Event category"
          variant="outlined"
        >
          {optionsCategory.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <RadioGroup className="eventStatus">
          <FormControlLabel
            value="candidate"
            control={<Radio />}
            name="category-1-status"
            label="Candidate"
          />
          <FormControlLabel
            value="highlight"
            control={<Radio />}
            name="category-1-status"
            label="Highlight"
          />
          <FormControlLabel
            value="mainfocus"
            control={<Radio />}
            name="category-1-status"
            label="Main focus"
          />
        </RadioGroup>
        <Button
          variant="contained"
          className="saveEventButton"
          color="primary"
          size="large"
          type="submit"
        >
          Save event
        </Button>

        {debugPanel && (
          <div style={{ gridColumn: '1 / -1' }}>
            VALUES:<pre>{JSON.stringify(values, null, 2)}</pre>
          </div>
        )}
      </form>
    </Modal>
  );
};
