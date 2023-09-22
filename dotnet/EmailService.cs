using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Options;
using Sabio.Models.AppSettings;
using Sabio.Models.Domain;
using Sabio.Models.Requests;
using sib_api_v3_sdk.Api;
using sib_api_v3_sdk.Client;
using sib_api_v3_sdk.Model;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Net.Mail;
using System.Reflection;


namespace Sabio.Services
{
    public class EmailService : IEmailService 
    {
        private AppKeys _appkey;
        IWebHostEnvironment _environment;

        public EmailService(IOptions<AppKeys> appkeys , IWebHostEnvironment webHostEnvironment)
        {
            _appkey = appkeys.Value;
            Configuration.Default.AddApiKey("api-key", _appkey.SendInBlueAppKey);
            _environment = webHostEnvironment;
        }

        public void SendChangePasswordEmail(SendEmailRequest request, string newUrl)
        {

            string templatePath = _environment.WebRootPath + "/EmailTemplates/PasswordResetTemplate.html";
            string readText = File.ReadAllText(templatePath);

            readText = readText.Replace("{{link}}", newUrl);


            var apiInstance = new TransactionalEmailsApi();

            List<SendSmtpEmailTo> sendSmtpEmailTo = new List<SendSmtpEmailTo>();
            SendSmtpEmailTo sendSmtpEmailTo1 = new SendSmtpEmailTo(request.To.Email, request.To.Name);
            sendSmtpEmailTo.Add(sendSmtpEmailTo1);



            var sendSmtpEmail = new SendSmtpEmail(sender: new SendSmtpEmailSender(email: request.To.Email), to: sendSmtpEmailTo, subject: request.Subject, htmlContent: readText);

            SendInBlue(sendSmtpEmail);

        }

    }}