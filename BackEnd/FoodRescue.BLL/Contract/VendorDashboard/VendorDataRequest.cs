using FoodRescue.DAL.Consts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.BLL.Contract.VendorDashboard
{
   
    public class VendorDataRequest
    {
       
      

        public string BusinessName { get; set; } = null!;

      
  

        public VendorCategory Category { get; set; }

     
        public string Email { get; set; } = null!;

      
        public string PhoneNumber { get; set; } = null!;

       
        public string Address { get; set; } = null!;

      
        public string? BusinessLicenseUrl { get; set; }

        
        public string? HealthCertificateUrl { get; set; }

     
        
       

        

        
       
    }
}
