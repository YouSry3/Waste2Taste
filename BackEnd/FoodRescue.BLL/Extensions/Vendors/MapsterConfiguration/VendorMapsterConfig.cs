using FoodRescue.BLL.Contract.Vendors;
using FoodRescue.DAL.Entities;
using Mapster;

namespace FoodRescue.BLL.Extensions.Vendors.MapsterConfiguration;

public static class VendorMapsterConfig
{
    public static void RegisterVendorMappings()
    {
        TypeAdapterConfig<Vendor, VendorListResponse>.NewConfig();

        //TypeAdapterConfig<Vendor, VendorDetailsResponse>.NewConfig()
        //    .Map(dest => dest.Products, src => src.Products);

        //TypeAdapterConfig<Product, VendorProductResponse>.NewConfig();
    }
}
