module.exports = {
  db: {
    connector: "memory"
  },
  MongoDS: {
    connector: 'mongodb',
    url: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/gamedb?retryWrites=true&w=majority`,
    port: 27017,
  }
};
