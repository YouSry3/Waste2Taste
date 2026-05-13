class VendorModel {
  final String id;
  final String name;
  final String imageUrl;
  final double rating;
  final int reviewCount;
  final double latitude;
  final double longitude;
  final String address;
  final int productCount;

  const VendorModel({
    required this.id,
    required this.name,
    required this.imageUrl,
    required this.rating,
    required this.reviewCount,
    required this.latitude,
    required this.longitude,
    required this.address,
    this.productCount = 0,
  });
}
