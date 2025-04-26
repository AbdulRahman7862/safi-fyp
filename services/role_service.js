import Role from "../model/role_model.js"
import ApiError from "../utils/ApiError.js"

class RoleService {
  static async createRole(name, description) {
    if (!name) {
      throw new ApiError("Role name is required")
    }
    return await Role.create({
      name,
      description,
    })
  }
  static async getRole() {
    return await Role.findAll()
  }
}

export default RoleService
