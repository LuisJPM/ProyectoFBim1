import User from '../models/user.model.js';
import { hashPassword, verifyPassword } from 'argon2';
import { generateJWTToken } from '../helpers/jwt-helper.js';

export const userLogin = async (req, res) => {
    const { email, password, username } = req.body;

    try {
        const normalizedEmail = email ? email.toLowerCase() : null;
        const normalizedUsername = username ? username.toLowerCase() : null;

        const user = await User.findOne({
            $or: [{ email: normalizedEmail }, { username: normalizedUsername }]
        });

        if (!user) {
            return res.status(400).json({
                msg: 'Invalid credentials - email not found!'
            });
        }

        if (!user.active) {
            return res.status(400).json({
                msg: 'This user is inactive in the system.'
            });
        }

        const passwordValid = await verifyPassword(user.password, password);
        if (!passwordValid) {
            return res.status(400).json({
                msg: 'Incorrect password provided!'
            });
        }

        const token = await generateJWTToken(user.id);

        return res.status(200).json({
            msg: 'Login successful!',
            userDetails: {
                username: user.username,
                token: token,
            }
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            message: "Server error!",
            error: err.message
        });
    }
};

export const userRegistration = async (req, res) => {
    try {
        const { name, surname, username, email, phone, password, role } = req.body;

        const hashedPassword = await hashPassword(password);

        const newUser = await User.create({
            name,
            surname,
            username,
            email,
            phone,
            password: hashedPassword,
            role
        });

        return res.status(201).json({
            message: "User registered successfully!",
            userDetails: {
                email: newUser.email
            }
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "User registration failed!",
            error: error.message
        });
    }
};
