// here we handle all DB requests
// all events
// add event
// delete event
// edit event
export default (req, res) => {
  console.log(req.method);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ name: 'John Doe' }));
};
