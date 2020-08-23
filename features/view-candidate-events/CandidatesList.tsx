import React from 'react';
import { Paper, Typography, CardContent, Card } from '@material-ui/core';
import { getCandidatesForSelectedCategory } from './getCandidatesForSelectedCategory';
import { useSelector } from 'react-redux';
import { AgendaEvent } from '../../data/dbSchema';
import { dateFormat } from '../shared/helpers';
import { EventButtonGroup } from '../edit-event/eventButtonGroup';

export const CandidatesList: React.FC = () => {
  const categoryCandidates: AgendaEvent[] = useSelector(
    getCandidatesForSelectedCategory,
  );

  return (
    <Paper className="candidatesList">
      <Typography variant="h6" component="p">
        Candidates count: {categoryCandidates.length}
      </Typography>

      {categoryCandidates.map((event: AgendaEvent) => {
        const formattedEndDate = dateFormat.format(new Date(event.end));

        return (
          <Card className="eventCard" key={event.id} variant="outlined">
            <CardContent>
              <Typography color="textSecondary" variant="body2" component="p">
                {formattedEndDate}
              </Typography>

              <Typography gutterBottom variant="body1" component="h5">
                {event.name}
              </Typography>
              <EventButtonGroup event={event} />
            </CardContent>
          </Card>
        );
      })}
    </Paper>
  );
};
