import RoleService from "../services/role_service.js"
const createRole = async (req, res) => {
  const { name, description } = req.body
  try {
    const role = await RoleService.createRole(name, description)
    res.status(201).json({
      message: "Role Created Successfully",
      role,
    })
  } catch (error) {
    res.status(400).json({
      error: error.message,
    })
  }
}

const getRole = async (req, res) => {
  try {
    const role = await RoleService.getRole()
    res.status(200).json(role)
  } catch (error) {
    res.status(400).json({
      error: error.message,
    })
  }
}

export { createRole, getRole }
