import fs from 'fs/promises';
import { join } from 'path';

export const deleteFileOnError = async (err, req, res, next) => {
    if (req.file && req.filePath) {
        const filePath = join(req.filePath, req.filename);
        try {
            await fs.unlink(filePath);
        } catch (unlinkErr) {
            console.error('Error deleting file:', unlinkErr);
        }
    }

    const statusCode = err.status === 400 || err.errors ? 400 : 500;
    const message = err.errors || err.message || 'Error';
    
    return res.status(statusCode).json({
        success: false,
        message,
    });
};
