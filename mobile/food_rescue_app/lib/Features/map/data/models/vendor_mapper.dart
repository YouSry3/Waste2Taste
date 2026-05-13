import 'package:waste2taste/Features/home/domain/entities/product_entity.dart';
import 'vendor_model.dart';

/// Extracts unique vendors from a list of products.
/// Groups products by vendorId and computes aggregate rating & review count.
class VendorMapper {
  static List<VendorModel> fromProducts(List<ProductEntity> products) {
    final Map<String, List<ProductEntity>> grouped = {};

    for (final product in products) {
      grouped.putIfAbsent(product.vendorId, () => []).add(product);
    }

    return grouped.entries.map((entry) {
      final vendorProducts = entry.value;
      final first = vendorProducts.first;

      // Average rating across all products of this vendor
      final avgRating = vendorProducts.fold<double>(
            0.0,
            (sum, p) => sum + p.rating,
          ) /
          vendorProducts.length;

      final totalReviews = vendorProducts.fold<int>(
        0,
        (sum, p) => sum + p.totalReviews,
      );

      return VendorModel(
        id: first.vendorId,
        name: first.vendorName,
        imageUrl: first.imageUrl,
        rating: avgRating,
        reviewCount: totalReviews,
        latitude: first.latitude,
        longitude: first.longitude,
        address: first.vendorName,
        productCount: vendorProducts.length,
      );
    }).toList();
  }
}
