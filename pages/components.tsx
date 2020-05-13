/* Test page */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import useSwr from 'swr';

import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { Card } from 'primereact/card';
import { Growl } from 'primereact/growl';

const dataFetcher = (url: RequestInfo) => fetch(url).then((res) => res.json());

export default () => {
  const { data, error } = useSwr('/api/events', dataFetcher);

  const opts = [
    { label: 'Concert', value: 'C' },
    { label: 'Home', value: 'H' },
  ];

  const [modalVisible, setModalVisible] = React.useState(false);
  const [dates, setDates] = React.useState<Date[] | Date>([]);
  const note = React.useRef(null);

  type PrimeCalendarChangeEvent = {
    originalEvent: Event;
    value: Date | Date[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    target: any;
  };

  const handleDateInput = (e: PrimeCalendarChangeEvent) => {
    setDates(e.value);
  };

  const growlSummary = (
    <span>
      <i className="pi pi-save" style={{ fontSize: '3em' }} />
      <h3>New Event</h3>
    </span>
  );

  const footer = (
    <div>
      <Button
        label="Cancel"
        className="p-button-warning"
        icon="pi pi-times"
        onClick={() => {
          setModalVisible(false);
        }}
      />
      <Button
        className="p-button-success"
        label="Save"
        icon="pi pi-check"
        onClick={() => {
          setModalVisible(false);
          if (note) {
            setTimeout(() => {
              note.current.show({
                severity: 'success',
                summary: growlSummary,
                detail: 'Saved to the Database',
              });
            }, 500);
          }
        }}
      />
    </div>
  );

  return (
    <>
      <h1>Home Highlights 2.0</h1>
      {error && <h3>Missing data</h3>}
      {!data && <h3>Loading...</h3>}
      {data && <pre>{JSON.stringify(data)}</pre>}
      <div className="events-wrapper">
        <Card title="The Queen">Some event description here</Card>
        <Card title="The King">Some event description here</Card>
        <Card title="The Prince">Some event description here</Card>
        <Card title="The Jester">Some event description here</Card>
        <Card title="The Queen">Some event description here</Card>
        <Card title="The King">Some event description here</Card>
        <Card title="The Prince">Some event description here</Card>
        <Card title="The Jester">Some event description here</Card>
      </div>
      <span className="p-float-label">
        <InputText id="in" />
        <label htmlFor="in">Username</label>
      </span>
      <Dropdown placeholder="Select Category" options={opts} />

      <Button
        type="button"
        label="Create Event"
        icon="pi pi-calendar-plus"
        iconPos="right"
        className="p-button-warning"
        onClick={() => setModalVisible(true)}
      />

      <Dialog
        header="Selected Event"
        modal={true}
        visible={modalVisible}
        onHide={() => setModalVisible(false)}
        footer={footer}
      >
        <h1>Modal</h1>
        <Calendar
          selectionMode="range"
          showButtonBar={true}
          placeholder="Select Date"
          inline={true}
          value={dates}
          onChange={handleDateInput}
        />
        <Calendar
          selectionMode="range"
          showButtonBar={true}
          placeholder="Select Date"
          inline={true}
          value={dates}
          onChange={handleDateInput}
        />
      </Dialog>
      <Growl ref={note} />
    </>
  );
};
