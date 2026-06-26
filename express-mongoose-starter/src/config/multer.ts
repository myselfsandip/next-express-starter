import multer from 'multer';

const storage = multer.memoryStorage();

export const uploadSingle = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB for documents
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'image/jpeg', 'image/jpg', 'image/png', 'image/webp',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only images, PDFs, and Word documents allowed'));
        }
    }
});

export const uploadMultiple = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024,
        files: 5 // Max 5 files at once
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'image/jpeg', 'image/jpg', 'image/png', 'image/webp',
            'application/pdf'
        ];

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'));
        }
    }
});
