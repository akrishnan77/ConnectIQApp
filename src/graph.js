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
