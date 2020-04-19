# Home Highlights 2.0
A rewrite of event management system.

## Functionality
The app fetches a list of events from a DB and displays them in a tabbed list by categories and status. User can manage events list with following stories:

### User stories
* [ ] view events by category
* [ ] add event
* [ ] remove event
* [ ] edit event properties
* [ ] promote event
* [ ] demote event
* [ ] add category to an event (copy to another category)

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
* [Unbounded DB](https://www.unbounded.cloud)

## Data
App communicates with DB to handle the following actions:
* Get events list
* Add new event
* Delete existing event
* Edit existing event

## API
The `events` lambda in `pages/api` handles all the requests from UI. It then makes calls to the methods exposed by databaseService that handles requests validation and communication with the database.

## Database
The data is stored in Unbounded DB, a simple unstructured noSQL database. The credentials are passed as environment variables (see [example file](./.env.example)). Those variables are stored in Zeit Now project and can be downloaded into local file with `now env pull`. 
Each environment uses it's own database.
