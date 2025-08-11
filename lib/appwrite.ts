import { Account, Client, Databases, ID, Query } from "react-native-appwrite";

export const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT || "")
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID || "")
  .setPlatform(process.env.EXPO_PUBLIC_APPWRITE_PLATFORM || "");

export const account = new Account(client);
export const db = new Databases(client);

export const DATABASE_ID = process.env.EXPO_PUBLIC_DB_ID || "";
export const USER_COLLECTION_ID =
  process.env.EXPO_PUBLIC_USER_COLLECTION_ID || "";

export const signup = async (email: string, password: string, name: string) => {
  try {
    const newAccount = await account.create(ID.unique(), email, password, name);

    if (!newAccount) throw Error;

    await signin(email, password);

    const newUser = await db.createDocument(
      DATABASE_ID,
      USER_COLLECTION_ID,
      ID.unique(),
      {
        userId: newAccount.$id,
        email,
        name,
      }
    );
  } catch (error: any) {
    console.log("Signup error", error);
    throw new Error(error.message || "Signup failed");
  }
};

export const signin = async (email: string, password: string) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw new Error("No current account");

    const currentUser = await db.listDocuments(
      DATABASE_ID,
      USER_COLLECTION_ID,
      [Query.equal("userId", currentAccount.$id)]
    );

    if (!currentUser || currentUser.documents.length === 0) {
      throw new Error("User document not found");
    }
    const {
      $id,
      $collectionId,
      $databaseId,
      $createdAt,
      $updatedAt,
      $permissions,
      $sequence,
      ...customFields
    } = currentUser.documents[0];

    return { ...customFields, $id };
  } catch (error) {
    console.log("Current user error", error);
  }
};

export const logout = async () => {
  try {
    await account.deleteSession("current");
  } catch (error) {
    console.log(error);
  }
};

export const updateUserDetails = async (user: any, data: any) => {
  try {
    const { $id, ...safeFields } = user;
    const updatedUser = await db.updateDocument(
      DATABASE_ID,
      USER_COLLECTION_ID,
      user.$id,
      {
        ...safeFields,
        ...data,
      }
    );

    const {
      $collectionId,
      $databaseId,
      $createdAt,
      $updatedAt,
      $permissions,
      $sequence,
      ...customFields
    } = updatedUser;

    return customFields;
  } catch (error) {
    console.log("Update user error", error);
  }
};
