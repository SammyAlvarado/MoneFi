using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Services;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System.Data.SqlClient;
using System.Threading.Tasks;
using System;
using Sabio.Models.Domain.Users;
using Sabio.Models.Requests.Users;
using SendGrid;
using Sabio.Models;
using Sabio.Models.Domain;
using System.Collections.Generic;
using Sabio.Models.AppSettings;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Http.HttpResults;


namespace Sabio.Web.Api.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UserApiController : BaseApiController    
    {
        private IUserService _service = null;
        private AppKeys _appKeys = null;
        private IAuthenticationService<int> _authService = null;

        public UserApiController(IOptions<AppKeys> appKeys 
            , IUserService service                   
            , ILogger<UserApiController> logger                         
            , IAuthenticationService<int> authService) : base(logger)   
        {
            _appKeys = appKeys.Value;
            _service = service;
            _authService = authService;
        }

        [AllowAnonymous]
        [HttpPost("password/resetpassword")]
        public ActionResult<ItemResponse<User>> ForgotPassword(UserForgetPasswordRequest model)
        {
            int iCode = 200;
            ObjectResult result = null;
            User thisUser = null;



            try
            {
                thisUser = _service.ConfirmUserByEmail(model);
                    ItemResponse<User> response = new ItemResponse<User>();
                    response.Item = thisUser;

                if(thisUser == null)
                {
                    
                    result = NotFound404(new ErrorResponse("Email not Found"));
                }
                else
                {
                    string requestUrl = _appKeys.DomainUrl + "/";

                    _service.UserAccountForgetPasswordValidation(thisUser.Id, model, requestUrl);
                    result = StatusCode(iCode, response);
                }
                
            } 
            catch (Exception ex)
            {
                iCode = 500;
                Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.ToString());
                result = StatusCode(iCode, response);
            }

            return StatusCode(iCode, result);
        }
        
        [AllowAnonymous]
        [HttpPut("changepassword")]
        public ActionResult ChangePassword(ChangePasswordRequest model) {  
            int iCode = 200;
            BaseResponse baseResponse = null;
            try
            {

                UserToken thisToken = _service.GetTokenByToken(model.Token);

                if (thisToken.UserId > 0 )
                {
                    _service.UpdateUserPassword(thisToken.UserId, model.Password);
                    baseResponse = new SuccessResponse();
                    _service.DeleteTokenByToken(thisToken.Token);
                } else
                {
                    iCode = 404;
                    baseResponse = new ErrorResponse("Invalid Token");
                }
            } 
            catch (Exception ex)
            {
                iCode = 500;
                baseResponse = new ErrorResponse(ex.Message);
            }

            return StatusCode(iCode, baseResponse);
        }

       

    }
}