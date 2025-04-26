import Area from "../model/area_model.js";

export const createArea = async (req, res) => {
  try {
    const { area_name, area_description, restaurant_id } = req.body;

    if (!area_name || !restaurant_id) {
      return res.status(400).json({ error: "area_name and restaurant_id are required" });
    }

    // Create Area with restaurant_id
    const area = await Area.create({ area_name, area_description, restaurant_id });

    res.status(201).json({ message: "Area added successfully", area });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
