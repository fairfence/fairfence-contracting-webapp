// FILEPATH: server/objectStorage.ts
// Object storage service using Supabase Storage
import { Response } from "express";
import { randomUUID } from "crypto";
import { createClient } from '@supabase/supabase-js';
import {
  ObjectAclPolicy,
  ObjectPermission,
  canAccessObject,
  getObjectAclPolicy,
  setObjectAclPolicy,
} from "./objectAcl";

// Initialize Supabase client for storage operations
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('Supabase credentials not configured. Storage operations will be disabled.');
}

export const supabaseClient = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

// Default bucket name for file storage
const DEFAULT_BUCKET = 'uploads';

export class ObjectNotFoundError extends Error {
  constructor() {
    super("Object not found");
    this.name = "ObjectNotFoundError";
    Object.setPrototypeOf(this, ObjectNotFoundError.prototype);
  }
}

// The object storage service is used to interact with the object storage service.
export class ObjectStorageService {
  constructor() {}

  // Gets the public object search paths.
  getPublicObjectSearchPaths(): Array<string> {
    return [DEFAULT_BUCKET];
  }

  // Gets the private object directory.
  getPrivateObjectDir(): string {
    return DEFAULT_BUCKET;
  }

  // Search for a public object from the search paths.
  async searchPublicObject(filePath: string): Promise<any | null> {
    if (!supabaseClient) {
      throw new Error('Supabase client not initialized');
    }

    const { data, error } = await supabaseClient
      .storage
      .from(DEFAULT_BUCKET)
      .list(filePath);

    if (error || !data || data.length === 0) {
      return null;
    }

    return { bucket: DEFAULT_BUCKET, path: filePath };
  }

  // Downloads an object to the response.
  async downloadObject(file: any, res: Response, cacheTtlSec: number = 3600) {
    try {
      if (!supabaseClient) {
        throw new Error('Supabase client not initialized');
      }

      const { data, error } = await supabaseClient
        .storage
        .from(file.bucket)
        .download(file.path);

      if (error || !data) {
        throw new Error('File not found');
      }

      // Set appropriate headers
      res.set({
        "Content-Type": data.type || "application/octet-stream",
        "Cache-Control": `public, max-age=${cacheTtlSec}`,
      });

      // Stream the blob to the response
      const arrayBuffer = await data.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      res.send(buffer);
    } catch (error) {
      console.error("Error downloading file:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Error downloading file" });
      }
    }
  }

  // Gets the upload URL for an object entity.
  async getObjectEntityUploadURL(): Promise<string> {
    if (!supabaseClient) {
      throw new Error('Supabase client not initialized');
    }

    const objectId = randomUUID();
    const objectPath = `uploads/${objectId}`;

    // Create a signed URL for upload
    const { data, error } = await supabaseClient
      .storage
      .from(DEFAULT_BUCKET)
      .createSignedUploadUrl(objectPath);

    if (error || !data) {
      throw new Error('Failed to generate upload URL');
    }

    return data.signedUrl;
  }

  // Gets the object entity file from the object path.
  async getObjectEntityFile(objectPath: string): Promise<any> {
    if (!supabaseClient) {
      throw new Error('Supabase client not initialized');
    }

    if (!objectPath.startsWith("/objects/")) {
      throw new ObjectNotFoundError();
    }

    const parts = objectPath.slice(1).split("/");
    if (parts.length < 2) {
      throw new ObjectNotFoundError();
    }

    const entityId = parts.slice(1).join("/");
    const filePath = entityId;

    // Check if file exists
    const { data, error } = await supabaseClient
      .storage
      .from(DEFAULT_BUCKET)
      .list(filePath.split('/')[0]);

    if (error || !data) {
      throw new ObjectNotFoundError();
    }

    return { bucket: DEFAULT_BUCKET, path: filePath };
  }

  normalizeObjectEntityPath(
    rawPath: string,
  ): string {
    if (!rawPath.includes('supabase.co')) {
      return rawPath;
    }

    // Extract the path from Supabase storage URL
    const url = new URL(rawPath);
    const pathParts = url.pathname.split('/storage/v1/object/');

    if (pathParts.length < 2) {
      return rawPath;
    }

    // Extract bucket and file path
    const fullPath = pathParts[1];
    const [bucket, ...pathSegments] = fullPath.split('/');
    const entityId = pathSegments.join('/');

    return `/objects/${entityId}`;
  }

  // Tries to set the ACL policy for the object entity and return the normalized path.
  async trySetObjectEntityAclPolicy(
    rawPath: string,
    aclPolicy: ObjectAclPolicy
  ): Promise<string> {
    const normalizedPath = this.normalizeObjectEntityPath(rawPath);
    if (!normalizedPath.startsWith("/")) {
      return normalizedPath;
    }

    const objectFile = await this.getObjectEntityFile(normalizedPath);
    await setObjectAclPolicy(objectFile, aclPolicy);
    return normalizedPath;
  }

  // Checks if the user can access the object entity.
  async canAccessObjectEntity({
    userId,
    objectFile,
    requestedPermission,
  }: {
    userId?: string;
    objectFile: any;
    requestedPermission?: ObjectPermission;
  }): Promise<boolean> {
    return canAccessObject({
      userId,
      objectFile,
      requestedPermission: requestedPermission ?? ObjectPermission.READ,
    });
  }
}

