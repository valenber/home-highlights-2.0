import React, { FormEvent } from 'react';
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

export const EditorFormModal: React.FC = () => {
  const editedEvent = useSelector(getEditedEvent);
  const dispatch = useAppDispatch();
  const { values, handleInputChange } = useForm(editedEvent);
  const debugPanel = true;

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
  ].reduce((acc, category) => {
    if (values && !Object.keys(values?.state).includes(category)) {
      acc.push(category);
    }
    return acc;
  }, []);

  function handleModalClose(): void {
    dispatch(selectEventToEdit(false));
  }

  function handleFormSubmit(event: FormEvent): void {
    /* this needs to be handled inside useForm hook */
    event.preventDefault();
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

        {values &&
          /* Object.keys(values?.state) && */
          [...Object.keys(values.state), 'NEW'].map((category) => {
            return (
              <div className="eventCategoryInputGroup" key={category}>
                <TextField
                  id="eventCategory"
                  className="categorySelect"
                  disabled={category !== 'NEW'}
                  select={category === 'NEW'}
                  label={category === 'NEW' ? 'New category' : 'Event category'}
                  variant="outlined"
                  value={category !== 'NEW' ? category : undefined}
                  name="newCategory"
                  onChange={handleInputChange}
                >
                  {optionsCategory.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>

                {category !== 'NEW' && (
                  <RadioGroup
                    className="categoryStatus"
                    value={
                      category !== 'NEW' ? values?.state[category] : 'candidate'
                    }
                    onChange={handleInputChange}
                  >
                    <FormControlLabel
                      value="candidate"
                      control={<Radio />}
                      name={category}
                      label="Candidate"
                    />
                    <FormControlLabel
                      value="highlight"
                      control={<Radio />}
                      name={category}
                      label="Highlight"
                    />
                    <FormControlLabel
                      value="mainfocus"
                      control={<Radio />}
                      name={category}
                      label="Main focus"
                    />
                  </RadioGroup>
                )}
              </div>
            );
          })}

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
