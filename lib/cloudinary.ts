import { v2 as cloudinary } from "cloudinary";

export type CloudinaryUploadResult = {
  url: string;
  publicId: string;
};

const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

const ensureConfigured = (): string | null => {
  const cloudName = "dmicenjpa";
  const apiKey = "319675426826291";
  const apiSecret = "w7Doykid9EOHE2rtQJdI9XJLZlY";

  if (!cloudName || !apiKey || !apiSecret) {
    return "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env.local.";
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  return null;
};

export const isCloudinaryConfigured = (): boolean => !ensureConfigured();

export const isCloudinaryUrl = (url: string): boolean =>
  url.includes("res.cloudinary.com");

/** Best-effort public_id parse for legacy URLs without stored publicId. */
export const publicIdFromCloudinaryUrl = (url: string): string | null => {
  if (!isCloudinaryUrl(url)) return null;
  const match = url.match(/\/(image|video)\/upload\/(.+)$/);
  if (!match?.[2]) return null;
  let path = match[2].replace(/^v\d+\//, "");
  const segments = path.split("/");
  while (segments.length > 1 && segments[0].includes(",")) {
    segments.shift();
  }
  path = segments.join("/").replace(/\.[a-zA-Z0-9]+$/, "");
  return path || null;
};

export const uploadGalleryImage = async (
  eventId: string,
  file: File,
): Promise<CloudinaryUploadResult | string> => {
  const configError = ensureConfigured();
  if (configError) return configError;

  if (!IMAGE_TYPES.has(file.type)) {
    return "Image must be JPEG, PNG, WebP, or GIF.";
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return "Image must be 10 MB or smaller.";
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const folder = `netx/events/${eventId}/gallery`;
  const publicId = `item-${Date.now()}`;

  return uploadBuffer(buffer, folder, publicId);
};

export const uploadEventPosterImage = async (
  eventId: string,
  file: File,
): Promise<CloudinaryUploadResult | string> => {
  const configError = ensureConfigured();
  if (configError) return configError;

  if (!IMAGE_TYPES.has(file.type)) {
    return "Image must be JPEG, PNG, WebP, or GIF.";
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return "Image must be 10 MB or smaller.";
  }

  await deleteEventPosterAssets(eventId);

  const buffer = Buffer.from(await file.arrayBuffer());
  const folder = `netx/events/${eventId}`;
  return uploadBuffer(buffer, folder, "poster", true);
};

const uploadBuffer = async (
  buffer: Buffer,
  folder: string,
  publicId: string,
  overwrite = false,
): Promise<CloudinaryUploadResult | string> => {
  try {
    const result = await new Promise<{
      secure_url: string;
      public_id: string;
    }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: publicId,
          resource_type: "image",
          overwrite,
        },
        (error, uploadResult) => {
          if (error || !uploadResult?.secure_url || !uploadResult.public_id) {
            reject(error ?? new Error("Upload failed."));
            return;
          }
          resolve({
            secure_url: uploadResult.secure_url,
            public_id: uploadResult.public_id,
          });
        },
      );
      stream.end(buffer);
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch {
    return "Cloudinary upload failed. Check your credentials and try again.";
  }
};

/** Remove poster image from Cloudinary (legacy video assets included). */
export const deleteEventPosterAssets = async (
  eventId: string,
): Promise<string | null> => {
  const configError = ensureConfigured();
  if (configError) return configError;

  const publicId = `netx/events/${eventId}/poster`;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
    await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
    return null;
  } catch {
    return "Failed to delete poster from Cloudinary.";
  }
};

export const deleteCloudinaryImage = async (
  publicId: string,
): Promise<string | null> => {
  const configError = ensureConfigured();
  if (configError) return configError;

  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
    return null;
  } catch {
    return "Failed to delete file from Cloudinary.";
  }
};
