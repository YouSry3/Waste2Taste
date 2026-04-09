using FoodRescue.DAL.Entities;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace FoodRescue.BLL.Services.JWT
{
    public class JwtProvider : IJwtProvider
    {
        private readonly JwtOptions JwtOptions;

        public JwtProvider(IOptions<JwtOptions> jwtOptions)
        {
            JwtOptions = jwtOptions.Value;
        }

        // 🔑 Generate Access Token
        public (string Token, int ExpiresIn) GenerateToken(User user)
        {
            Claim[] claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email!),
                new Claim(JwtRegisteredClaimNames.GivenName, user.Name),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JwtOptions.Key));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: JwtOptions.Issuer,
                audience: JwtOptions.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(JwtOptions.ExpiryMinutes), // ✅ FIXED
                signingCredentials: creds
            );

            return (
                new JwtSecurityTokenHandler().WriteToken(token),
                JwtOptions.ExpiryMinutes * 60
            );
        }

        // 🔁 Generate Refresh Token
        public string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        // 🔥 Get Principal from Expired Token (for refresh flow)
        public ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(JwtOptions.Key);

            var parameters = new TokenValidationParameters
            {
                ValidateAudience = true,
                ValidateIssuer = true,
                ValidateIssuerSigningKey = true,
                ValidateLifetime = false, // 🔥 allow expired token

                ValidIssuer = JwtOptions.Issuer,
                ValidAudience = JwtOptions.Audience,

                IssuerSigningKey = new SymmetricSecurityKey(key)
            };

            var principal = tokenHandler.ValidateToken(token, parameters, out SecurityToken securityToken);

            // 🔒 extra security check
            if (securityToken is not JwtSecurityToken jwtSecurityToken ||
                !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
            {
                throw new SecurityTokenException("Invalid token");
            }

            return principal;
        }

        // ✅ Validate Access Token (normal requests)
        public string? ValidateToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JwtOptions.Key));

            try
            {
                var principal = tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    IssuerSigningKey = key,
                    ValidateIssuerSigningKey = true,

                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,

                    ValidIssuer = JwtOptions.Issuer,
                    ValidAudience = JwtOptions.Audience,

                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                // 🔒 extra security check
                if (validatedToken is not JwtSecurityToken jwtToken ||
                    !jwtToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                {
                    return null;
                }

                return principal.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
            }
            catch
            {
                return null;
            }
        }
    }
}