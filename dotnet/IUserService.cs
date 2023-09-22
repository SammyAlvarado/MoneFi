using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Domain.Users;
using Sabio.Models.Requests.Users;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public interface IUserService
    {
        User ConfirmUserByEmail(UserForgetPasswordRequest model);
        void UserAccountForgetPasswordValidation(int id, UserForgetPasswordRequest newUser, string requestUrl);
        void UpdateUserPassword(int userId, string password);

    }
}