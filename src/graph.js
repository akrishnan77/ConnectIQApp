import { graphConfig } from "./authConfig";

/**
 * Attaches a given access token to a MS Graph API call. Returns information about the user
 * @param {string} accessToken
 */
export async function callMsGraph(accessToken) {
    const headers = new Headers();
    const bearer = `Bearer ${accessToken}`;

    headers.append("Authorization", bearer);

    const options = {
        method: "GET",
        headers: headers
    };

    return fetch(graphConfig.graphMeEndpoint, options)
        .then(response => response.json())
        .catch(error => console.log(error));
}

export async function getTodoTaskLists(accessToken) {
    const headers = new Headers();
    const bearer = `Bearer ${accessToken}`;
    headers.append("Authorization", bearer);
    const options = {
        method: "GET",
        headers: headers,
    };

    return fetch("https://graph.microsoft.com/v1.0/me/todo/lists", options)
        .then((response) => response.json())
        .catch((error) => console.log(error));
}

export async function getTodoTasks(accessToken, listId) {
    const headers = new Headers();
    const bearer = `Bearer ${accessToken}`;
    headers.append("Authorization", bearer);
    const options = {
        method: "GET",
        headers: headers,
    };

    return fetch(`https://graph.microsoft.com/v1.0/me/todo/lists/${listId}/tasks`, options)
        .then((response) => response.json())
        .catch((error) => console.log(error));
}

export async function getTodoTaskById(accessToken, listId, taskId) {
    const headers = new Headers();
    const bearer = `Bearer ${accessToken}`;
    headers.append("Authorization", bearer);
    const options = {
        method: "GET",
        headers: headers,
    };

    return fetch(`https://graph.microsoft.com/v1.0/me/todo/lists/${listId}/tasks/${taskId}`, options)
        .then((response) => response.json())
        .catch((error) => console.log(error));
}

export async function getOneDriveTrainingFiles(accessToken) {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;
  headers.append("Authorization", bearer);
  headers.append("Content-Type", "application/json");

  const folderPath = "/Apps/ConnectIQApp/Training";
  console.log(`Ensuring OneDrive folder exists at: ${folderPath}`);

  // Step 1: Ensure the folder exists. This call is idempotent.
  // If the folder exists, it returns the folder info. If not, it creates it.
  const createFolderEndpoint = "https://graph.microsoft.com/v1.0/me/drive/root/children";
  const folderCreationBody = {
    "name": "Training",
    "folder": {},
    "@microsoft.graph.conflictBehavior": "fail" // We can also use "rename" or "replace"
  };
  
  // This is a simplified path creation. A robust solution would check each path segment.
  // For now, we assume we just need to create the 'Training' folder under the app root.
  const ensureFolderEndpoint = "https://graph.microsoft.com/v1.0/me/drive/special/approot";
  
  try {
      // First, let's get the approot folder to ensure it's created.
      const approotResponse = await fetch(ensureFolderEndpoint, { method: "GET", headers: { "Authorization": bearer } });
      if (!approotResponse.ok) {
          // This can happen if the app has never written a file. Let's try to create a folder to initialize it.
          console.log("App root not found, attempting to create it by creating the Training folder inside it.");
      }
      
      // Step 2: Create the "Training" folder within the app root.
      const createTrainingFolderEndpoint = "https://graph.microsoft.com/v1.0/me/drive/special/approot/children";
      const createResponse = await fetch(createTrainingFolderEndpoint, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({
              "name": "Training",
              "folder": { },
              "@microsoft.graph.conflictBehavior": "fail" // fail if it exists, which is fine
          })
      });

      if (!createResponse.ok && createResponse.status !== 409) { // 409 is Conflict, which is fine
          const errorData = await createResponse.json();
          console.error("Failed to ensure training folder exists", errorData);
          // Don't stop here, still try to read files in case the folder was there all along
      }

      // Step 3: Fetch files from the folder.
      const getFilesEndpoint = "https://graph.microsoft.com/v1.0/me/drive/special/approot:/Training:/children";
      const filesResponse = await fetch(getFilesEndpoint, { method: "GET", headers: { "Authorization": bearer } });

      if (!filesResponse.ok) {
          if (filesResponse.status === 404) {
              console.log("Training folder is confirmed not found, even after attempting creation. Returning empty array.");
              return [];
          }
          const errorData = await filesResponse.json();
          throw new Error(`Failed to fetch files: ${errorData.error.message}`);
      }

      const data = await filesResponse.json();
      console.log("Successfully fetched files:", data.value);
      return data.value;

  } catch (error) {
      console.error("Error in getOneDriveTrainingFiles:", error);
      return { error: { message: `An unexpected error occurred: ${error.message}` } };
  }
}
