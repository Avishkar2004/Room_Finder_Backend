import { getFlats } from "../models/flatModel.js";

export const getAllFlats = (req, res) => {
  getFlats((error, results) => {
    if (error) {
      return res.status(500).json({ error: "Database query error" });
    }

    const flats = results.map((flat) => ({
      ...flat,
      photos: flat.photos
        ? `data:image/jpeg;base64,${Buffer.from(flat.photos).toString(
            "base64"
          )}`
        : "", // Convert binary data to base64
    }));

    res.json(flats);
  });
};
