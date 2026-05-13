class ProductEntity {
  final String id;
  final String name;
  final String imageUrl;
  final double price;
  final double originalPrice;
  final int discountPercentage;
  final String expiresIn;
  final double rating;
  final int totalReviews;
  final String vendorId;
  final String vendorName;
  final double latitude;
  final double longitude;
  final String description;
  final bool isFavorite;
  final String? category;

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
    required this.vendorId,
    required this.description,
    required this.totalReviews,
    required this.isFavorite,
    this.category,
  });

  ProductEntity copyWith({
    String? id,
    String? name,
    String? imageUrl,
    double? price,
    double? originalPrice,
    int? discountPercentage,
    String? expiresIn,
    double? rating,
    int? totalReviews,
    String? vendorId,
    String? vendorName,
    double? latitude,
    double? longitude,
    String? description,
    bool? isFavorite,
    String? category,
  }) {
    return ProductEntity(
      id: id ?? this.id,
      name: name ?? this.name,
      imageUrl: imageUrl ?? this.imageUrl,
      price: price ?? this.price,
      originalPrice: originalPrice ?? this.originalPrice,
      discountPercentage: discountPercentage ?? this.discountPercentage,
      expiresIn: expiresIn ?? this.expiresIn,
      rating: rating ?? this.rating,
      totalReviews: totalReviews ?? this.totalReviews,
      vendorId: vendorId ?? this.vendorId,
      vendorName: vendorName ?? this.vendorName,
      latitude: latitude ?? this.latitude,
      longitude: longitude ?? this.longitude,
      description: description ?? this.description,
      isFavorite: isFavorite ?? this.isFavorite,
      category: category ?? this.category,
    );
  }
}

final skeletonProducts = List.generate(
  2,
  (index) => ProductEntity(
    id: '$index',
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
    vendorId: '$index',
    description: 'description',
    category: 'category',
    isFavorite: false,
    totalReviews: 0,
  ),
);
