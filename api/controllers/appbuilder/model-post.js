/**
 * appbuilder/model-post.js
 * Perform a Create operation on the data managed by a specified ABObject.
 * This returns a fully populated row value of the newly created entry.
 *
 * url:     post /app_builder/model/:objID
 * header:  X-CSRF-Token : [token]
 * return:  { rowValue }
 * params:
 */
var inputParams = {
   objID: { string: { uuid: true }, required: true },
};

// make sure our BasePath is created:
module.exports = function (req, res) {
   // Package the Find Request and pass it off to the service

   req.ab.log(`appbuilder::model-post`);

   var validationParams = Object.keys(inputParams);

   // in our preparations for the service, we only validate the required ID
   // param.
   var validateThis = {};
   (validationParams || []).forEach((p) => {
      validateThis[p] = req.param(p);
   });

   // verify your inputs are correct:
   // false : prevents an auto error response if detected. (default: true)
   if (
      !(req.ab.validUser(/* false */)) ||
      !req.ab.validateParameters(inputParams, true, validateThis)
   ) {
      // an error message is automatically returned to the client
      // so be sure to return here;
      return;
   }

   // create a new job for the service
   // start with our expected required inputs
   let jobData = {
      objectID: req.ab.param("objID"),
      values: {},
      // relocate the rest of the params as .values
   };

   // add in anything else we just want to pass along:
   var allParams = req.allParams();
   (Object.keys(allParams) || []).forEach((k) => {
      if (validationParams.indexOf(k) == -1) {
         jobData.values[k] = allParams[k];
      }
   });

   req.ab.serviceRequest("appbuilder.model-post", jobData, (err, newItem) => {
      if (err) {
         req.ab.log("api_sails:model-post:error:", err);
         res.ab.error(err);
         return;
      }

      res.ab.success(newItem);
   });
};
