import mongoose, { Schema, model } from 'mongoose';

const EventSchema = new Schema({
  name: String,
  start: String,
  end: String,
  status: {}, // { category: status }
  published: String,
  unpublished: String, // candidate, published, retired
  lang: String,
  last_update: { type: Date, default: Date.now },
});

export interface AgendaEvent extends mongoose.Document {
  name: string;
  start: string;
}

export default model<AgendaEvent>('Event', EventSchema);

// this is an example of event that can be added to DB
// it is used in tests
export const sampleEvent = {
  name: 'PhotoEspana 2019',
  start: '1/1/2019',
  end: '1/5/2019',
  status: {
    exhibition: 'candidate',
    home: 'highlighted',
  },
  published: '1/1/2019',
  unpublished: '1/5/2019',
  lang: 'en',
};
