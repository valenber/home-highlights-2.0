# Home Highlights 2.0
A rewrite of event management system.

## Functionality
The app fetches a list of events from a DB and displays them in a tabbed list by categories and status. User can manage events list with following stories:

### User stories
* [ ] view events by category
* [ ] add event
* [ ] remove event
* [ ] edit event properties
* [ ] change event status
* [ ] add category to an event (copy to another category)
* [ ] see that an event has expired
* [ ] see that an event is expiring soon

## Views 
* EVENTS LIST - main view where we can see all elements and trigger events
* EVENT EDITING MODAL - form where user edits the details of new and existing events 

## Components
* CategoriesList
* SuperHighlightEventCard
* HighlightEventCard
* CandidateEventCard
* EventControlPanel (Promote, Edit, Copy, Delete)
* EditEventModal (TextInput, DateInput, SelectIput, RadioButton)
* Notifications (inform user about DB operations)

## Tech
* NextJS app
* PrimeReact component library
* Zeit Now deployment
* MongoDB

## Data
App communicates with DB to handle the following actions:
[x] Get events list
[x] Add new event
[x] Delete existing event
[x] Edit existing event

## API
The `events` lambda in `pages/api` handles all the requests from UI. It then validates the requests and makes calls to the methods exposed by databaseService that handle communication with the database.

## Database
The app uses FaunaDB service. The credentials are passed as environment variables (see [example file](./.env.example)). Those variables are stored in Zeit Now project and can be downloaded into local file with `now env pull`. 
Each environment uses it's own collection.
