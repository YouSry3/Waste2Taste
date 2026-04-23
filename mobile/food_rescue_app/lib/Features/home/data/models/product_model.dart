import 'package:waste2taste/core/constants/api_urls.dart';
import '../../domain/entities/product_entity.dart';

class ProductModel extends ProductEntity {
  const ProductModel({
    required super.id,
    required super.name,
    required super.imageUrl,
    required super.price,
    required super.originalPrice,
    required super.discountPercentage,
    required super.expiresIn,
    required super.rating,
    required super.vendorName,
    required super.totalReviews,
    required super.latitude,
    required super.longitude,
    required super.vendorId,
    required super.description,
    super.category,
  });

  factory ProductModel.fromJson(Map<String, dynamic> json) {
    return ProductModel(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      imageUrl: ApiUrls.baseUrl + json['imageUrl'],
      price: (json['price'] ?? 0).toDouble(),
      originalPrice: (json['originalPrice'] ?? 0).toDouble(),
      discountPercentage: json['discountPercentage'] ?? 0,
      expiresIn: json['expiresIn'] ?? '',
      rating: (json['rating'] ?? 0).toDouble(),
      vendorName: json['vendorName'] ?? '',
      totalReviews: json['totalReviews'] ?? 0,
      latitude: (json['latitude'] ?? 0).toDouble(),
      longitude: (json['longitude'] ?? 0).toDouble(),
      vendorId: json['vendorId'] ?? '',
      description: json['descripcion'] ?? 'No description',
      category: json['category'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'imageUrl': imageUrl,
      'price': price,
      'originalPrice': originalPrice,
      'discountPercentage': discountPercentage,
      'expiresIn': expiresIn,
      'rating': rating,
      'vendorName': vendorName,
      'latitude': latitude,
      'longitude': longitude,
    };
  }
}
