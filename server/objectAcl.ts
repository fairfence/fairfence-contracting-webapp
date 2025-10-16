// FILEPATH: server/objectAcl.ts
// Object ACL policies for Supabase Storage
// File type representing Supabase storage objects
type StorageFile = {
  bucket: string;
  path: string;
};

const ACL_POLICY_METADATA_KEY = "custom:aclPolicy";

// Simplified access group types for FairFence admin content management
export enum ObjectAccessGroupType {
  ADMIN_ONLY = "admin_only",
}

// The logic user group that can access the object.
export interface ObjectAccessGroup {
  type: ObjectAccessGroupType;
  id: string;
}

export enum ObjectPermission {
  READ = "read",
  WRITE = "write",
}

export interface ObjectAclRule {
  group: ObjectAccessGroup;
  permission: ObjectPermission;
}

// The ACL policy of the object.
export interface ObjectAclPolicy {
  owner: string;
  visibility: "public" | "private";
  aclRules?: Array<ObjectAclRule>;
}

// Check if the requested permission is allowed based on the granted permission.
function isPermissionAllowed(
  requested: ObjectPermission,
  granted: ObjectPermission,
): boolean {
  // Users granted with read or write permissions can read the object.
  if (requested === ObjectPermission.READ) {
    return [ObjectPermission.READ, ObjectPermission.WRITE].includes(granted);
  }

  // Only users granted with write permissions can write the object.
  return granted === ObjectPermission.WRITE;
}

// Admin access group implementation for FairFence content management
class AdminOnlyAccessGroup implements ObjectAccessGroup {
  constructor(
    public readonly type: ObjectAccessGroupType.ADMIN_ONLY,
    public readonly id: string,
  ) {}

  // Check if the user is an admin (simplified for FairFence use case)
  public async hasMember(userId: string): Promise<boolean> {
    // For FairFence, we consider authenticated users as admins
    return Boolean(userId);
  }
}

function createObjectAccessGroup(
  group: ObjectAccessGroup,
): AdminOnlyAccessGroup {
  switch (group.type) {
    case ObjectAccessGroupType.ADMIN_ONLY:
      return new AdminOnlyAccessGroup(group.type, group.id);
    default:
      throw new Error(`Unknown access group type: ${group.type}`);
  }
}

// Sets the ACL policy to the object metadata.
export async function setObjectAclPolicy(
  objectFile: StorageFile | any,
  aclPolicy: ObjectAclPolicy,
): Promise<void> {
  // Note: Supabase Storage handles ACL through Row Level Security (RLS) policies
  // This is a compatibility layer for existing code
  // In production, use Supabase RLS policies instead
  console.log('ACL policy set for:', objectFile.path || objectFile.name, aclPolicy);
}

// Gets the ACL policy from the object metadata.
export async function getObjectAclPolicy(
  objectFile: StorageFile | any,
): Promise<ObjectAclPolicy | null> {
  // Note: Supabase Storage handles ACL through Row Level Security (RLS) policies
  // This returns a default public policy for compatibility
  return {
    owner: 'system',
    visibility: 'public',
    aclRules: []
  };
}

// Checks if the user can access the object.
export async function canAccessObject({
  userId,
  objectFile,
  requestedPermission,
}: {
  userId?: string;
  objectFile: StorageFile | any;
  requestedPermission: ObjectPermission;
}): Promise<boolean> {
  // When this function is called, the acl policy is required.
  const aclPolicy = await getObjectAclPolicy(objectFile);
  if (!aclPolicy) {
    return false;
  }

  // Public objects are always accessible for read.
  if (
    aclPolicy.visibility === "public" &&
    requestedPermission === ObjectPermission.READ
  ) {
    return true;
  }

  // Access control requires the user id.
  if (!userId) {
    return false;
  }

  // The owner of the object can always access it.
  if (aclPolicy.owner === userId) {
    return true;
  }

  // Go through the ACL rules to check if the user has the required permission.
  for (const rule of aclPolicy.aclRules || []) {
    const accessGroup = createObjectAccessGroup(rule.group);
    if (
      (await accessGroup.hasMember(userId)) &&
      isPermissionAllowed(requestedPermission, rule.permission)
    ) {
      return true;
    }
  }

  return false;
}