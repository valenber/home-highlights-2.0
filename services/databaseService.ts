type FixMeLater = any;

export default {
  getAllAgendaEvents: async function(client: FixMeLater) {
    // const getRes = await client
    //   .database('sample')
    //   .query()
    //   .match({})
    //   .send();
    return { status: 200, list: [] };
  },

  createNewAgendaEvent: function(eventObject) {
    return null;
  },

  deleteAgendaEvent: function(eventId: string) {
    return null;
  },

  updateAgendaEvent: function(eventId: string, payload: {}) {
    return null;
  },
};
