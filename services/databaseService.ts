type FixMeLater = any;

export default {
  getAllAgendaEvents: async function(db: FixMeLater) {
    const list = await db.collection('agendaEvents').findOne();
    return { status: 200, list };
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
