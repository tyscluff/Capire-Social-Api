import { Router } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/userModel.js';
import AuthToken from '../models/authTokenModel.js';
import { createJwt, verifyJwt } from '../utilities/auth/jwt.js';
import errorLogger from '../logger/errorLogger.js';

const router = Router(); 

router.post("/login", async (req, res) => {
    try {
        const { email, password, type } = req.body;

        const userExists = await User.exists({ email: email.toLowerCase() }); 

        if (userExists) {
            const user = await User.findOne({ email: email.toLowerCase() }); 

            const correctPassword = await bcrypt.compare(password, user.password);

            if (correctPassword) { 
                const userInfo = { id: user._id, email: user.email };
                const authToken = createJwt(userInfo);
                await AuthToken.findOneAndDelete({ $and: [ { userId: user._id }, { type }]});
                const newToken = new AuthToken({
                    userId: user._id,
                    token: authToken,
                    type  
                });
                newToken.save((err) => {
                    if (err) {
                        console.log(err);
                        res.send({ message: 1 });
                    } else {
                        res.send({ message: 0, user, authToken });
                    }
                });
            } else {
                res.send({ message: 2 });
            }
        } else {
            res.send({ message: 2 });
        }
    } catch (error) {
        errorLogger.error(error);
        res.send({ message: 1 });
    }
});

router.post("/createAccount", async (req, res) => {
    try {
        const { email, firstName, lastName, password } = req.body;

        const userExists = await User.exists({ email });

        if (userExists) {
            res.send({ message: 2 });
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = new User({
                email: email.toLowerCase(),
                firstName,
                lastName,
                password: hashedPassword
            });

            newUser.save((err) => {
                if (err) {
                    console.log(err);
                    res.send({ message: 1 });
                } else {
                    res.send({ message: 0, user: newUser });
                }
            });
        }
    } catch (error) {
        errorLogger.error(error);
        res.send({ message: 1 });
    }
});

router.post("/setPassword", async (req, res) => {
    try {
        const { newPassword, userId } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await User.findByIdAndUpdate(userId, { password: hashedPassword });

        res.send({ message: 0 });
    } catch (error) {
        errorLogger.error(error);
        res.send({ message: 1 }); 
    }
});

router.post("/logout", async (req, res) => {
    try {
        const { userId } = req.body;

        await AuthToken.findOneAndDelete({$and: [{ userId }, { type: "mobile" } ]}); 

        res.send({ message: 0 });
    } catch (error) {
        errorLogger.error(error);
        res.send({ message: 1 }); 
    }
}); 

router.get("/verifyLogin", async (req, res) => {
    try {
        const authToken = req.get("Authorization");
        const validToken = verifyJwt(authToken);

        if (validToken) {
            res.send({ message: 0, verified: true });
        } else {
            res.send({ message: 0, verified: false });
        };
    } catch (error) {
        errorLogger.error(error);
        res.send({ message: 1 }); 
    }
});

export default router;