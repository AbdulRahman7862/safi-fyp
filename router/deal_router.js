import express from "express"
import {
  createDeal,
  getAllDeals,
  updateDealDiscount
} from "../controller/deal_controller.js"
import upload from "../middleware/multer.js"

const router = express.Router()

router.post("/", upload.single("image"), createDeal)
router.get("/", getAllDeals)
router.patch("/update-discount", updateDealDiscount)

// router.get("/:id", getDealById)
// router.put("/:id", upload.single("image"), updateDeal)
// router.delete("/:id", deleteDeal)

export default router
