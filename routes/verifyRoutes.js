import { Router } from 'express';
import { templateApprovedIds } from '../constants/templateApprovedIds.js';

const router = Router();

router.get("/templatesApproved", async (req, res) => {
    const { id } = req.body;

    let approved = false;

    for (let i = 0; i < templateApprovedIds.length;  i++) {
        if (id === templateApprovedIds[i]) {
            approved = true;
            break;
        }
    };

    res.send({ approved, message: 0 });
}); 

export default router;