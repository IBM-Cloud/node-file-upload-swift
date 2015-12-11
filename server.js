var express = require("express"),
    app = express(),
    dotenv = require("dotenv"),
    cfenv = require("cfenv");

dotenv.load();

var vcapLocal = null
try {
  vcapLocal = require("./vcap-local.json");
}
catch (e) {}

var appEnvOpts = vcapLocal ? {vcap:vcapLocal} : {};
var appEnv = cfenv.getAppEnv(appEnvOpts);

var container = process.env.CONTAINER || "test";

app.use(express.static(__dirname + "/public"));

app.use(require("skipper")());

var swiftCredentials = appEnv.getServiceCreds("swift-node-file-upload");

app.get("/files/:filename", function (request, response) {
    var skipperSwift = require("skipper-openstack")();

    skipperSwift.read({
        credentials: swiftCredentials,
        container: container
    },request.params.filename, response);
});

app.get("/files", function (request, response) {
    var skipperSwift = require("skipper-openstack")();

    skipperSwift.ls({
        credentials: swiftCredentials,
        container: container
    },function (error, files) {
        if (error) {
            console.log(error);
            response.send(error);
        }
        else {
            response.send(files);
        }
    });
});

app.post("/upload", function (request, response) {
    request.file('file')
        .upload({
          adapter: require("skipper-openstack"),
          credentials: swiftCredentials,
          container: container
        }, function (err, uploadedFiles) {
            if (err) {
                console.log(err);
                return response.send(err);
            }
            else {
                return response.redirect("/");
            }

        });
});

var port = process.env.VCAP_APP_PORT || 8080;
app.listen(port, function() {
    console.log('listening on port', port);

    var skipperSwift = require("skipper-openstack")();
    skipperSwift.ensureContainerExists(swiftCredentials, container, function (error) {
      if (error) {
        console.log("unable to create default container", container);
      }
      else {
        console.log("ensured default container", container, "exists");
      }
    });
});

require("cf-deployment-tracker-client").track();
