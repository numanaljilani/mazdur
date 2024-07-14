// config/aws.config.ts
import {  DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Upload } from '@aws-sdk/lib-storage';

@Injectable()
export class UploadService {

    private readonly s3Client = new S3Client({
        region: this.configService.getOrThrow('AWS_REGION'),
        credentials : {
            accessKeyId : this.configService.getOrThrow('AWS_ACCESS_KEY'),
            secretAccessKey : this.configService.getOrThrow('AWS_SECRET_KEY'),
        }
      });


    constructor(private readonly configService: ConfigService){}

    async uploadProfile(filename: string, file: Buffer , ext ?: string) {
        try {
          const extension = filename?.split('.')?.pop()?.toLowerCase() || 'jpg'; 
          const dateString = new Date().toISOString().slice(0, 10).replace(/-/g, '');  // YYYYMMDD format
          const randomString = Math.random().toString(36).substring(2, 15); // Random alphanumeric string
          const uniqueName =  `mazdur-${dateString}-${randomString}.${extension}`;
         const upload = await new Upload({
           client: this.s3Client,
           params: {
             Bucket: 'mazdour',
             Key: uniqueName,
             Body: file,
             ContentType: ext=== '.png' ? 'image/png': 'image/jpeg'
           },
         });
         const result = await upload.done();
         console.log("Upload completed:", result);
         return result;
        } catch (error) {
         console.error("Error uploading to S3:", error);
         throw error;
        }
       }
       async upload(filename: string, file: Buffer , ext ?: string) {
     
        return await this.s3Client.send(
           new PutObjectCommand({
             Bucket: 'mazdour',
             Key: filename,
             Body: file,
             ContentType: ext=== '.png' ? 'image/png': 'image/jpeg'
           }),
         );
       }
       async deletePost(filename: string, ) {
     
         const command = new DeleteObjectCommand({
           Bucket: 'mazdour',
           Key: filename,
         });
     
        return await this.s3Client.send(command);
        
       }
}
