using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Services.Interfaces;
using System.Data;
using Sabio.Models.Domain.Users;
using System.Data.SqlClient;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Sabio.Models.Requests.Users;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;
using System;
using Newtonsoft.Json;
using System.Runtime.CompilerServices;
using System.Security.Cryptography.X509Certificates;
using Stripe.Radar;
using Sabio.Models.Requests;
using System.Net.Mail;
using Microsoft.AspNetCore.Http;
using BCrypt;

namespace Sabio.Services
{
    public class UserService : IUserService, IBaseUserMapper
    {
        private IAuthenticationService<int> _authenticationService;
        private IDataProvider _dataProvider;
        private IEmailService _emailProvider;

        public UserService(IAuthenticationService<int> authSerice, IDataProvider dataProvider, IEmailService emailProvider)
        {
            _authenticationService = authSerice;
            _dataProvider = dataProvider;
            _emailProvider = emailProvider;
        }

 public void UpdateUserPassword(int userId, string password)
        {
            string salt = BCryptHelper.GenerateSalt();
            var passwordHash = BCryptHelper.HashPassword(password, salt);

            string procName = "[dbo].[Users_UpdatePassword]";
            _dataProvider.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", userId);
                paramCollection.AddWithValue("@Password", passwordHash);
            }, null
           );

        }

        public void UserAccountValidation(int id, UserAddRequestV2 newUser, string requestUrl) {

            string guid = Guid.NewGuid().ToString();
            int newUserTokenType = 1;
            CreateToken(guid, id, newUserTokenType);

            SendEmailRequest firstEmail = new SendEmailRequest();
            firstEmail.Sender = new EmailInfo();
            firstEmail.Sender.Email = "new.accounts@monefi.com";
            firstEmail.Sender.Name = "Account Management";
            firstEmail.To = new EmailInfo();
            firstEmail.To.Email = newUser.Email;
            firstEmail.To.Name = $"{newUser.FirstName} {newUser.LastName}";
            firstEmail.Subject = "Account Verification";

            string confirmationUrl = $"{requestUrl}confirm?token={guid}";

            _emailProvider.NewUserEmail(firstEmail, confirmationUrl);

        }
public User ConfirmUserByEmail(UserForgetPasswordRequest model)
        {
            User thisUser = new User();
            string procName = "[dbo].[Users_Confirm_Email]";
            _dataProvider.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Email", model.Email);
            }, delegate (IDataReader reader, short set)
            {
                int startIndex = 0;

                thisUser.Id = reader.GetSafeInt32(startIndex++);
                thisUser.FirstName = reader.GetString(startIndex++);
                thisUser.LastName = reader.GetString(startIndex++);
                thisUser.Email = reader.GetString(startIndex++);
                thisUser.IsConfirmed = reader.GetBoolean(startIndex++); 
            }
            );

            return thisUser;
        }

    }
    }