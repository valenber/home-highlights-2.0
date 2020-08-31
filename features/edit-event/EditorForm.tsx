import React, { useState } from 'react';
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
  FormControl,
  InputLabel,
  Select,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import { AgendaEventCategory, AgendaEventState } from '../../data/dbSchema';
import { getEditedEvent } from '../../store/selectors/getEditedEvent';
import { useAppDispatch } from '../../store';
import { selectEventToEdit } from '../../store/editorSlice';

import { useForm, Controller } from 'react-hook-form';

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
  const [eventState, setEventState] = useState<AgendaEventState>({});
  const { register, control, handleSubmit } = useForm();

  function handleModalClose(): void {
    dispatch(selectEventToEdit(false));
  }

  function handleCategoryChange({ target }): void {
    console.log(target);
  }

  function onFormSubmit(data: unknown): void {
    console.log(data);
  }

  return (
    <Modal open={!!editedEvent} onClose={handleModalClose}>
      <form className="editorForm" onSubmit={handleSubmit(onFormSubmit)}>
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
          className="eventName"
          label="Event Name"
          variant="outlined"
          name="name"
          inputRef={register}
        />
        <TextField
          id="eventStartDate"
          className="eventStartDate"
          label="Start"
          type="date"
          variant="outlined"
          name="start"
          inputRef={register}
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
          inputRef={register}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <Controller
          as={
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
          }
          name="category-1"
          control={control}
        />

        <RadioGroup className="eventStatus">
          <FormControlLabel
            value="candidate"
            control={<Radio />}
            name="category-1-status"
            inputRef={register}
            label="Candidate"
          />
          <FormControlLabel
            value="highlight"
            control={<Radio />}
            name="category-1-status"
            inputRef={register}
            label="Highlight"
          />
          <FormControlLabel
            value="mainfocus"
            control={<Radio />}
            name="category-1-status"
            inputRef={register}
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
      </form>
    </Modal>
  );
};
