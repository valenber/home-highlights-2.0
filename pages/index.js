import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Dialog } from 'primereact/dialog';

export default () => {
  const opts = [
    { label: 'Concert', value: 'C' },
    { label: 'Home', value: 'H' },
  ];

  const [modalVisible, setModalVisible] = React.useState(false);
  const [dates, setDates] = React.useState();
  const footer = (
    <div>
      <Button
        className="p-button-success"
        label="Yes"
        icon="pi pi-check"
        onClick={() => {}}
      />
      <Button
        label="No"
        className="p-button-warning"
        icon="pi pi-times"
        onClick={() => {
          setModalVisible(false);
        }}
      />
    </div>
  );

  return (
    <>
      <h1>Home Highlights 2.0</h1>
      <Calendar
        selectionMode="range"
        showButtonBar={true}
        placeholder="Select Date"
        inline={true}
        value={dates}
        onChange={(e) => setDates(e.value)}
      />
      <Button
        label="Create Event"
        icon="pi pi-calendar-plus"
        iconPos="right"
        className="p-button-warning"
      />
      <span className="p-float-label">
        <InputText id="in" />
        <label htmlFor="in">Username</label>
      </span>
      <Dropdown placeholder="Select Category" options={opts} />
      <Button
        type="button"
        label="Modal"
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
      </Dialog>
    </>
  );
};
