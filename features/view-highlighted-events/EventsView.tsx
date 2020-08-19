import React, { ChangeEvent } from 'react';
import {
  Paper,
  Tabs,
  Tab,
  Card,
  CardContent,
  Typography,
  /* ButtonGroup, */
} from '@material-ui/core';
/* import IconButton from '@material-ui/core/IconButton'; */
/* import StarIcon from '@material-ui/icons/Star'; */
/* import EditIcon from '@material-ui/icons/Edit'; */
/* import AddToPhotosIcon from '@material-ui/icons/AddToPhotos'; */
/* import DeleteIcon from '@material-ui/icons/Delete'; */
import { AgendaEventCategory, AgendaEvent } from '../../data/dbSchema';
import { useSelector, useDispatch } from 'react-redux';
import { getSelectedCategory } from '../../store/selectors/getSelectedCategory';
import { selectEventCategory } from '../../store/eventsSlice';
import { getHighlightsForSelectedCategory } from '../../store/selectors/getHighlightsForSelectedCategory';

export const EventsView: React.FC = () => {
  const eventCategories = [
    'home',
    'current',
    'exhibitions',
    'theatre and dance',
    'music',
    'sports',
    'fairs',
    'events',
    'christmas',
  ];
  const selectedCategory = useSelector(getSelectedCategory);
  const categoryHighlights = useSelector(getHighlightsForSelectedCategory);
  const dispatch = useDispatch();

  function handleTabChange(
    _event: ChangeEvent,
    newTab: AgendaEventCategory,
  ): void {
    dispatch(selectEventCategory(newTab));
  }

  return (
    <div className="highlightedEventsView">
      <Paper>
        <Tabs
          indicatorColor="secondary"
          textColor="primary"
          onChange={handleTabChange}
          value={selectedCategory}
        >
          {eventCategories.map((category) => (
            <Tab key={category} label={category} value={category} />
          ))}
        </Tabs>
      </Paper>

      <div className="eventsListsWrapper">
        <Paper className="highlightsGrid">
          {categoryHighlights.map((event: AgendaEvent) => {
            return (
              <Card className="eventCard" key={event.id} variant="elevation">
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    {event.end}
                  </Typography>

                  <Typography gutterBottom variant="h5" component="h3">
                    {event.name}
                  </Typography>

                  {/* <ButtonGroup */}
                  {/*   color="primary" */}
                  {/*   aria-label="outlined primary button group" */}
                  {/* > */}
                  {/*   <IconButton> */}
                  {/*     <StarIcon /> */}
                  {/*   </IconButton> */}

                  {/*   <IconButton color="secondary" aria-label="add an alarm"> */}
                  {/*     <EditIcon color="primary" /> */}
                  {/*   </IconButton> */}

                  {/*   <IconButton */}
                  {/*     color="primary" */}
                  {/*     aria-label="add to shopping cart" */}
                  {/*   > */}
                  {/*     <AddToPhotosIcon /> */}
                  {/*   </IconButton> */}

                  {/*   <IconButton aria-label="delete" color="secondary"> */}
                  {/*     <DeleteIcon /> */}
                  {/*   </IconButton> */}
                  {/* </ButtonGroup> */}
                </CardContent>
              </Card>
            );
          })}
        </Paper>
      </div>
    </div>
  );
};
