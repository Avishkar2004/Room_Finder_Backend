import { db } from "../config/db.js";

export const getFlats = (callback) => {
  const query = "SELECT * FROM flats";
  db.query(query, (error, results) => {
    if (error) {
      return callback(error, null);
    }
    callback(null, results);
  });
};
