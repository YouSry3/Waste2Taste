using FoodRescue.BLL.Contract.Listings;
using FoodRescue.BLL.Contract.Vendors;
using FoodRescue.DAL.Entities;
using Mapster;

namespace FoodRescue.BLL.Extensions.Vendors.MapsterConfiguration;

public static class VendorMapsterConfig
{
    public static void RegisterVendorMappings()
    {
        TypeAdapterConfig<Vendor, VendorListResponse>.NewConfig()
            .Map(dest => dest.Category, src => src.Category.ToString())
            .Map(dest => dest.Email, src => src.Owner.Email)
            .Map(dest => dest.PhoneNumber, src => src.PhoneNumber ?? string.Empty)
            .Map(dest => dest.Status, src => "Active");

        //TypeAdapterConfig<Vendor, VendorDetailsResponse>.NewConfig()
        //    .Map(dest => dest.Products, src => src.Products);

        TypeAdapterConfig<Product, ListingsPindingResponse>
    .NewConfig()
    .Map(dest => dest.ProductId, src => src.Id)
    .Map(dest => dest.AI, src => src.AISpoileRequest);



     TypeAdapterConfig<AISpoileRequest, AISpoilageResponseDto>.NewConfig();


        //TypeAdapterConfig<Product, VendorProductResponse>.NewConfig();
    }
}
