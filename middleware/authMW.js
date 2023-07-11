import { Router } from 'express';
import { verifyJwt } from '../utilities/auth/jwt.js';

const router = Router();

router.use((req, res, next) => {
    try {
        const authToken = req.get("Authorization");

        const verifyState = verifyJwt(authToken); 

        if (verifyState) {
            req.body.authState = true;
            req.body.id = verifyState.id;
            next();
        } else { 
            req.body.authState = false;
            res.status(401);
            res.send({ error: "NO_AUTH" });
        }

    } catch (error) {
        req.body.authState = false;
        res.status(401);
        res.send({ error: "NO_AUTH" });
    }
});

export default router;