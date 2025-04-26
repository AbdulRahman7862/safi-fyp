import Area from "../model/area_model.js";

class AreaService {
  async createArea(data) {
    return await Area.create(data);
  }
}

export default new AreaService();
