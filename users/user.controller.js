import { response, request } from "express";
import { hash } from "argon2";
import User from "./user.model.js";

export const getUsers = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const [total, users] = await Promise.all([
            User.countDocuments({ estado: true }),
            User.find({ estado: true }).skip(Number(desde)).limit(Number(limite))
        ]);
        res.status(200).json({ success: true, total, users });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Error getting users!', error });
    }
}

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, msg: 'User not found!' });
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Error getting user!', error });
    }
}

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { password, ...data } = req.body;

        if (password) {
            data.password = await hash(password);
        }

        const user = await User.findByIdAndUpdate(id, data, { new: true });
        res.status(200).json({ success: true, msg: 'User updated!', user });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Error updating user!', error });
    }
}

export const updatePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { password } = req.body;

        if (password) {
            const hashedPassword = await hash(password);
            const user = await User.findByIdAndUpdate(id, { password: hashedPassword }, { new: true });
            return res.status(200).json({ success: true, msg: 'Password updated!', user });
        }

        res.status(400).json({ success: false, msg: 'Password required!' });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Error updating password!', error });
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndUpdate(id, { estado: false }, { new: true });
        res.status(200).json({ success: true, msg: 'User deactivated!', user });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Error deactivating user!', error });
    }
}

export const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        const user = await User.findByIdAndUpdate(id, { estado }, { new: true });
        res.status(200).json({ success: true, msg: 'Status updated!', user });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Error updating status!', error });
    }
}
