## Running locally

### Azure resources

* Storage account
    - In the storage account, create a table named `messages`
* Azure Cognitive Speech account in `westus2` (location can be set in frontend/constants.js)
* Azure SignalR Service

### Configure Azure Functions (api folder)

* Create a local.settings.json by copying local.settings.sample.json. In local.settings.json, set these values:
    - `Storage` - connection string from your storage account
    - `AzureSignalRConnectionString` - connection string from your SignalR Service instance
    - `JwtSigningKey` - any string that will be used to sign the token used to authenticate the host when sending captions to Azure Functions

### Run the apps

1. In a terminal, start the Azure Function app:

    ```
    cd api
    npm install
    func host start
    ```

1. In another terminal, start the Vue.js frontend:

    ```
    cd frontend
    npm install
    npm run serve
    ```

1. Open the browser to http://localhost:8080 .
    1. Click on "Create a new meeting".
    1. Paste your Cognitive Speech key into the box and start captioning.
    1. Note the meeting join link and password.

1. Open another browser the meeting join link in the first window.
    1. Enter the password from the first window, click join.

1. You should see the captioning working.
