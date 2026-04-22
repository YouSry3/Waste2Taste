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

final skeletonProducts = List.generate(
  2,
  (_) => const ProductEntity(
    id: '',
    name: 'Loading Product Name',
    imageUrl: '',
    price: 0.0,
    originalPrice: 0.0,
    discountPercentage: 0,
    expiresIn: '0h left',
    rating: 0.0,
    vendorName: 'Loading Vendor',
    latitude: 0.0,
    longitude: 0.0,
  ),
);
