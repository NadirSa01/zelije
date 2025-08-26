import * as Minio from "minio";
export const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT|| "9000", 10),
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY || "minioadmin",
  secretKey: process.env.MINIO_SECRET_KEY || "minioadmin"
})

const BUCKET_NAME = "zelij"


export const setBucketPolicy = async () => {
  const policy = {
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Principal: { AWS: ["*"] },
        Action: ["s3:GetObject"],
        Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`]
      }
    ]
  };

  try {
    await minioClient.setBucketPolicy(BUCKET_NAME, JSON.stringify(policy));
    console.log("Bucket policy set successfully");
  } catch (error) {
    console.error("Error setting bucket policy:", error);
  }
};


export const uploadImage = async (file, fileName) => {
    const bucketExists = await minioClient.bucketExists(BUCKET_NAME);
    if(!bucketExists) {
        await minioClient.makeBucket(BUCKET_NAME);
        await setBucketPolicy(); // Add this line
    }
    const uniqueName = `${Date.now()}-${fileName}`;
    await minioClient.putObject(BUCKET_NAME, uniqueName, file.buffer);
    return `http://localhost:9000/${BUCKET_NAME}/${uniqueName}`;
}

export const deleteImage = async (imageUrl) => {
    const fileName = imageUrl.split('/').pop()
    await minioClient.removeObject(BUCKET_NAME, fileName)
}