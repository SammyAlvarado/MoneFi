import axios from "axios";
import * as helper from "./serviceHelpers";
import logger from "sabio-debug";

const endpoint = `${helper.API_HOST_PREFIX}/api/users`;
const _logger = logger.extend("App");

const forgetPasswordRequest = (payload) => {
  const config = {
    method: "POST",
    url: `${endpoint}/password/resetpassword`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  _logger(`ForgotPassword payload, ${payload}`);
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const updatePasswordRequest = (payload) => {
  _logger("Payload", payload);
  const config = {
    method: "PUT",
    url: `${endpoint}/changepassword`,
    data: payload,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config);
};

export { forgetPasswordRequest, updatePasswordRequest };
