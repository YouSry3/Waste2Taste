class ProductEntity {
  final String id;
  final String name;
  final String imageUrl;
  final double price;
  final double originalPrice;
  final int discountPercentage;
  final String expiresIn;
  final double rating;
  final String vendorName;
  final double latitude;
  final double longitude;

  const ProductEntity({
    required this.id,
    required this.name,
    required this.imageUrl,
    required this.price,
    required this.originalPrice,
    required this.discountPercentage,
    required this.expiresIn,
    required this.rating,
    required this.vendorName,
    required this.latitude,
    required this.longitude,
  });
}
