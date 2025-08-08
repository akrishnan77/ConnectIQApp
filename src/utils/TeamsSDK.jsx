import { app } from '@microsoft/teams-js';
import * as microsoftTeams from '@microsoft/teams-js';

class TeamsSDK {
    static isInitialized = false;

    // Singleton initialization method
    static initialize() {
        if (TeamsSDK.isInitialized) {
            // If already initialized, skip further initialization
            return;
        }

        try {
            // Initialize the Teams SDK
            app.initialize();
            TeamsSDK.isInitialized = true;

            // Optionally, register for any necessary events like theme change
            // app.registerOnThemeChangeHandler((theme) => {
            //     console.log('Theme changed to:', theme);
            // });

            console.log('Teams SDK initialized successfully.');
        } catch (error) {
            console.error('Failed to initialize Teams SDK:', error);
        }
    }

    // Set the app title
    static setAppTitle(title) {
        if (!TeamsSDK.isInitialized) {
            console.error('Teams SDK is not initialized yet.');
            return;
        }

        //app.setAppTitle(title);
        microsoftTeams.tasks.startTask({
            title: title, // Set the title of the task module
        });
        console.log(`App title set to: ${title}`);
    }

    // Get Teams context
    static getContext() {
        if (!TeamsSDK.isInitialized) {
            console.error('Teams SDK is not initialized yet.');
            return;
        }

        console.log('Teams context retrieved.');
        return app.getContext();
    }

    // Open Deep Link URL
    static openDeepLink(link) {
        if (!TeamsSDK.isInitialized) {
            console.error('Teams SDK is not initialized yet.');
            return;
        }

        app.openLink(link);
    }

    // Set app icon
    static setAppIcon(iconUrl) {
        if (!TeamsSDK.isInitialized) {
            console.error('Teams SDK is not initialized yet.');
            return;
        }

        //app.setAppIcon(iconUrl);
        console.log(`App icon set to: ${iconUrl}`);
    }
}

export default TeamsSDK;
