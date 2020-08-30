import { AppState } from '../index';
import { AgendaEvent } from '../../data/dbSchema';

export function getEditedEvent(
  state: AppState,
): AgendaEvent | Partial<AgendaEvent> | false {
  const { editedEvent, activeCategory } = state;

  // nothing is edited
  if (editedEvent === false) return false;

  // new event is being created
  if (editedEvent === null) {
    const scaffoldEvent: Partial<AgendaEvent> = {
      name: '',
      start: '',
      end: '',
      state: {},
    };
    scaffoldEvent.state[activeCategory] = 'candidate';

    return scaffoldEvent;
  }

  // existing event is being edited (unless there is an mistake)
  const event: AgendaEvent =
    typeof editedEvent === 'string'
      ? state.events.find((event: AgendaEvent) => event.id === editedEvent)
      : null;

  if (!event) {
    throw new Error('there is no event with the id marked for editing');
  } else {
    return event;
  }
}
