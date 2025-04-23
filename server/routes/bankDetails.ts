import { Router } from "express";
import { getBankDetails, addBankDetails, updateBankDetails, deleteBankDetails, addWithdrawalMethod, updateWithdrawalMethod, fetchWithdrawalMethods } from "../services/bankDetails";
import { getUser } from "../middleware/user";

const router = Router();

router.get("/", getUser, getBankDetails);
router.post("/", getUser, addBankDetails);
router.put("/", getUser, updateBankDetails);
router.delete("/", getUser, deleteBankDetails);

router.post("/withdrawalMethod", getUser, addWithdrawalMethod);
router.put("/withdrawalMethod", getUser, updateWithdrawalMethod);
router.get("/withdrawalMethods", getUser, fetchWithdrawalMethods);

export default router;
