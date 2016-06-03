## Node file uploader for Openstack Swift on SoftLayer using Pipes and Streams

This is an example application which can be run on Bluemix.

This application showcases how to pipe files from a multi-part form using streams to Openstack Swift.  This is really important - by using pipes and streams you do not chew up disk space or memory.

This app assumes authentication to a Swift Object Storage using the V1 Swift API, which is used by SoftLayer Object Storage. Bluemix Object Storage uses V2, and you should use and reference the [File Uploader for Swift on Bluemix](https://github.com/IBM-Bluemix/node-file-upload-swift) repo for integration with Object Storage on Bluemix.

### Build status
![Bluemix Deployments](https://deployment-tracker.mybluemix.net/stats/c18028c774d53b033ce21310498c7ba0/badge.svg)

### Deploy this app:

####  Automatically by clicking this image:

[![Deploy to Bluemix](https://deployment-tracker.mybluemix.net/stats/c18028c774d53b033ce21310498c7ba0/button.svg)](https://bluemix.net/deploy?repository=https://github.com/IBM-Bluemix/node-file-upload-swift.git)

#### Manually as follows:

1. Clone the app (i.e. this repo)

  ```
  git clone https://github.com/IBM-Bluemix/node-file-upload-swift.git
  cd node-file-upload-swift-softlayer
  ```

2. Create a Object Storage service instance specifically for this application on SoftLayer, or other Object Storage provider that exposes the Swift API V1. You can create a SoftLayer account at [http://www.softlayer.com/](http://www.softlayer.com/) and add an Object Storage account from [control.softlayer.com](control.softlayer.com).

3. Since SoftLayer services are not exposed within Bluemix, a User Provided service must be configured in Bluemix using the following command:

  ```bash
    cf cups softlayeros -p "auth_url, userId, password"
  ```

  This app is configured to bind to a service named `softlayeros` by default. If you would like to change the name of the user provided service, you must also update `server.js` and `manifest.yml`.

  This `cups` command will prompt you to enter the credentials which are exposed inside your SoftLayer Object Storage account. Enter the Public Authentication Endpoint for `auth_url`, the Username for `userId`, and API Key for `password`.

4. Edit the manifest.yml file.  Change the 'name' attribute to something unique.

5. Push to Bluemix with the updated `manifest.yml`.

  ```
  cf push
  ```

  **NOTE:** This app connects to a container in Swift called "test" defaulty.  You will need to create this container.  You can do this by the following.
  - Going to the Bluemix dashboard
  - click on your app
  - click on the object storage service
  - create a container on this page called "test"

  If you would like to use a container called something else you will need to do the following.

  ```
  cf set-env myappname CONTAINER containername
  cf restage myappname
  ```
  Replace myappname with the app of your application and containername with the name of your container.

  Access your application URL in the browser.  You should see the main page and be able to navigate the links.

### Privacy Notice

The Personality Box sample web application includes code to track deployments to Bluemix and other Cloud Foundry platforms. The following information is sent to a [Deployment Tracker] [deploy_track_url] service on each deployment:

* Application Name (`application_name`)
* Space ID (`space_id`)
* Application Version (`application_version`)
* Application URIs (`application_uris`)

This data is collected from the `VCAP_APPLICATION` environment variable in IBM Bluemix and other Cloud Foundry platforms. This data is used by IBM to track metrics around deployments of sample applications to IBM Bluemix. Only deployments of sample applications that include code to ping the Deployment Tracker service will be tracked.

### Disabling Deployment Tracking

Deployment tracking can be disabled by removing `require("cf-deployment-tracker-client").track();` from the beginning of the `server.js` main server file.

[deploy_track_url]: https://github.com/cloudant-labs/deployment-tracker
