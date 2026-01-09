import { S3Client } from '@aws-sdk/client-s3';
import { Env } from './env.config';

export const s3 = new S3Client({
    region: Env.AWS_REGION,
    credentials: {
        accessKeyId: Env.AWS_ACCESS_KEY,
        secretAccessKey: Env.AWS_SECRET_ACCESS_KEY,
    },
});