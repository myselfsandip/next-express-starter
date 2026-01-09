import {
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
    ListObjectsV2Command,
    HeadObjectCommand
} from '@aws-sdk/client-s3';
import { s3 } from '../config/s3Bucket';
import { Env } from '../config/env.config';
import crypto from 'crypto';
import path from 'path';
import { Readable } from 'stream';


const generateFileName = (originalName: string): string => {
    const ext = path.extname(originalName);
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(8).toString('hex');
    const safeName = path.basename(originalName, ext).replace(/[^a-zA-Z0-9]/g, '_');
    return `${safeName}-${timestamp}-${randomString}${ext}`;
};


export const uploadFileToS3 = async (
    file: Express.Multer.File,
    folder: string = 'documents'
): Promise<{ key: string; originalName: string; size: number; mimeType: string }> => {
    try {
        const fileName = generateFileName(file.originalname);
        const key = `${folder}/${fileName}`;

        const command = new PutObjectCommand({
            Bucket: Env.AWS_S3_BUCKET_NAME,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
            Metadata: {
                originalName: file.originalname,
                uploadedAt: new Date().toISOString(),
            }
        });

        await s3.send(command);

        return {
            key,
            originalName: file.originalname,
            size: file.size,
            mimeType: file.mimetype
        };
    } catch (error) {
        console.error('S3 Upload Error:', error);
        throw new Error('Failed to upload file to S3');
    }
};


export const uploadMultipleFilesToS3 = async (
    files: Express.Multer.File[],
    folder: string = 'documents'
): Promise<{ key: string; originalName: string; size: number; mimeType: string }[]> => {
    try {
        const uploadPromises = files.map(file => uploadFileToS3(file, folder));
        return await Promise.all(uploadPromises);
    } catch (error) {
        console.error('S3 Multiple Upload Error:', error);
        throw new Error('Failed to upload files to S3');
    }
};


export const downloadFileFromS3 = async (key: string): Promise<Buffer> => {
    try {
        const command = new GetObjectCommand({
            Bucket: Env.AWS_S3_BUCKET_NAME,
            Key: key,
        });

        const response = await s3.send(command);
        const stream = response.Body as Readable;

        // Convert stream to buffer
        const chunks: Uint8Array[] = [];
        for await (const chunk of stream) {
            chunks.push(chunk);
        }

        return Buffer.concat(chunks);
    } catch (error) {
        console.error('S3 Download Error:', error);
        throw new Error('Failed to download file from S3');
    }
};


export const getFileStreamFromS3 = async (key: string): Promise<{
    stream: Readable;
    contentType: string;
    contentLength: number;
}> => {
    try {
        const command = new GetObjectCommand({
            Bucket: Env.AWS_S3_BUCKET_NAME,
            Key: key,
        });

        const response = await s3.send(command);

        return {
            stream: response.Body as Readable,
            contentType: response.ContentType || 'application/octet-stream',
            contentLength: response.ContentLength || 0,
        };
    } catch (error) {
        console.error('S3 Stream Error:', error);
        throw new Error('Failed to get file stream from S3');
    }
};


export const deleteFileFromS3 = async (key: string): Promise<void> => {
    try {
        const command = new DeleteObjectCommand({
            Bucket: Env.AWS_S3_BUCKET_NAME,
            Key: key,
        });

        await s3.send(command);
    } catch (error) {
        console.error('S3 Delete Error:', error);
        throw new Error('Failed to delete file from S3');
    }
};


export const deleteMultipleFilesFromS3 = async (keys: string[]): Promise<void> => {
    try {
        const deletePromises = keys.map(key => deleteFileFromS3(key));
        await Promise.all(deletePromises);
    } catch (error) {
        console.error('S3 Multiple Delete Error:', error);
        throw new Error('Failed to delete files from S3');
    }
};


export const fileExistsInS3 = async (key: string): Promise<boolean> => {
    try {
        const command = new HeadObjectCommand({
            Bucket: Env.AWS_S3_BUCKET_NAME,
            Key: key,
        });

        await s3.send(command);
        return true;
    } catch (error: any) {
        if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
            return false;
        }
        throw error;
    }
};


export const listFilesInFolder = async (
    folder: string
): Promise<string[]> => {
    try {
        const command = new ListObjectsV2Command({
            Bucket: Env.AWS_S3_BUCKET_NAME,
            Prefix: folder,
        });

        const response = await s3.send(command);
        return response.Contents?.map(item => item.Key!) || [];
    } catch (error) {
        console.error('S3 List Error:', error);
        throw new Error('Failed to list files from S3');
    }
};


export const getFileMetadata = async (key: string): Promise<{
    size: number;
    contentType: string;
    lastModified: Date;
}> => {
    try {
        const command = new HeadObjectCommand({
            Bucket: Env.AWS_S3_BUCKET_NAME,
            Key: key,
        });

        const response = await s3.send(command);

        return {
            size: response.ContentLength || 0,
            contentType: response.ContentType || 'application/octet-stream',
            lastModified: response.LastModified || new Date(),
        };
    } catch (error) {
        console.error('S3 Metadata Error:', error);
        throw new Error('Failed to get file metadata from S3');
    }
};
