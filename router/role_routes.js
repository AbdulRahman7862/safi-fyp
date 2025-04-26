// const express = require("express")
// const { getRole, createRole } = require("../controller/role_controller")
import express from "express"
import { createRole, getRole } from "../controller/role_controller.js"

const routers = express.Router()

routers.get("/get-roles", getRole)
routers.post("/set-roles", createRole)

// module.exports = routers

export default routers
