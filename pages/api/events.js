// here we handle all DB requests
// all events
// add event
// delete event
// edit event

export default async (_req, res) => {
  setTimeout(() => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ moto: 'Akuna Matata' }));
  }, 3000);
};
