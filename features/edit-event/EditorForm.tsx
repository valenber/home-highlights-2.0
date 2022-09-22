/* eslint-disable quotes */
import React, { ChangeEvent } from 'react';
import { useSelector } from 'react-redux';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
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
  Divider,
  Tooltip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { AgendaEvent, AgendaEventCategory } from '../../data/dbSchema';
import { getEditedEvent } from '../../store/selectors/getEditedEvent';
import { useAppDispatch } from '../../store';
import { selectEventToEdit } from '../../store/editorSlice';

import { useForm } from './useForm';
import { useEventSearch } from 'features/event-search/useEventSearch';
import { MatchedEventButton } from 'features/event-search/MatchedEventButton';

export const EditorFormModal: React.FC = () => {
  const editedEvent = useSelector(getEditedEvent);
  const dispatch = useAppDispatch();
  const {
    errors,
    validateInput,
    values,
    handleInputChange,
    handleFormSubmit,
    deleteEventCategory,
    deleteSelectedAgendaEvent,
  } = useForm(editedEvent);
  const debugPanel = false;

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
    searchTermSetter('');
    dispatch(selectEventToEdit(false));
  }

  const [matchedEvents, searchTermSetter] = useEventSearch(
    (editedEvent as AgendaEvent)?.name,
  );

  function handleEventNameChange(event: ChangeEvent<HTMLInputElement>) {
    searchTermSetter(event.target.value);
    handleInputChange(event);
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
          size="large"
        >
          <CloseIcon fontSize="large" color="primary" />
        </IconButton>

        <TextField
          id="eventName"
          autoFocus
          autoComplete="off"
          className="eventName"
          label="Event Name"
          variant="outlined"
          name="name"
          onChange={handleEventNameChange}
          value={values?.name}
          InputLabelProps={{
            shrink: !!values?.name,
          }}
          onBlur={validateInput}
          error={!!errors?.name}
          helperText={errors?.name}
        />

        <div className="matchedEvents">
          {matchedEvents
            .filter((event) => event.id !== (editedEvent as AgendaEvent)?.id)
            .map((event) => {
              return <MatchedEventButton key={event.id} event={event} />;
            })}
        </div>

        <TextField
          id="eventStartDate"
          className="eventStartDate"
          label="Start"
          type="date"
          variant="outlined"
          name="start"
          value={values?.start ? values.start.split('T')[0] : ''}
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
          onBlur={validateInput}
          error={!!errors?.end}
          helperText={errors?.end}
        />

        <TextField
          id="tags"
          className="eventTags"
          label="Tag list"
          variant="outlined"
          name="tags"
          onChange={handleInputChange}
          value={values?.tags}
          InputLabelProps={{
            shrink: !!values?.tags?.length,
          }}
          onBlur={validateInput}
        />

        {values &&
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
                  value={
                    category === 'NEW'
                      ? ''
                      : category === 'current'
                      ? "what's on"
                      : category
                  }
                  name="newCategory"
                  onChange={handleInputChange}
                >
                  {optionsCategory.map((option) => {
                    return (
                      <MenuItem key={option} value={option}>
                        {option === 'current' ? "what's on" : option}
                      </MenuItem>
                    );
                  })}
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
                      control={<Radio color="primary" />}
                      name={category}
                      label="Candidate"
                    />
                    <FormControlLabel
                      value="highlight"
                      control={<Radio color="primary" />}
                      name={category}
                      label="Highlight"
                    />
                    <FormControlLabel
                      value="mainfocus"
                      control={<Radio color="primary" />}
                      name={category}
                      label="Main focus"
                    />
                  </RadioGroup>
                )}

                {category !== 'NEW' && (
                  <Tooltip
                    title="Can't delete last category"
                    disableHoverListener={Object.keys(values.state).length > 1}
                    disableFocusListener={Object.keys(values.state).length > 1}
                    className="deleteCategoryButton"
                    placement="left"
                  >
                    <span>
                      <Button
                        size="small"
                        disabled={Object.keys(values.state).length <= 1}
                        color="secondary"
                        onClick={(): void =>
                          deleteEventCategory(category as AgendaEventCategory)
                        }
                      >
                        <DeleteForeverIcon />
                      </Button>
                    </span>
                  </Tooltip>
                )}
              </div>
            );
          })}

        <Divider className="actionBlockDivider" />
        <Button
          variant="contained"
          className="deleteEventButton"
          color="secondary"
          type="button"
          size="small"
          tabIndex={-1}
          onClick={deleteSelectedAgendaEvent}
        >
          Delete
        </Button>

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
          <div style={{ gridColumn: '1 / 7' }}>
            VALUES:<pre>{JSON.stringify(values, null, 2)}</pre>
          </div>
        )}

        {debugPanel && (
          <div style={{ gridColumn: '7 / -1' }}>
            ERRORS:<pre>{JSON.stringify(errors, null, 2)}</pre>
          </div>
        )}
      </form>
    </Modal>
  );
};
