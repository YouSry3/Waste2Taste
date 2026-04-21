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
    required super.latitude,
    required super.longitude,
  });

  factory ProductModel.fromJson(Map<String, dynamic> json) {
    return ProductModel(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      imageUrl: json['imageUrl'] ?? '',
      price: (json['price'] ?? 0).toDouble(),
      originalPrice: (json['originalPrice'] ?? 0).toDouble(),
      discountPercentage: json['discountPercentage'] ?? 0,
      expiresIn: json['expiresIn'] ?? '',
      rating: (json['rating'] ?? 0).toDouble(),
      vendorName: json['vendorName'] ?? '',
      latitude: (json['latitude'] ?? 0).toDouble(),
      longitude: (json['longitude'] ?? 0).toDouble(),
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

final List<ProductEntity> mockProducts = [
  ProductModel(
    id: '1',
    name: 'Fresh Vegetables Bundle',
    vendorName: 'Green Market',
    imageUrl: 'https://images.unsplash.com/photo-1748342319942-223b99937d4e',
    originalPrice: 21.99,
    price: 12.99,
    discountPercentage: 40,
    expiresIn: '2h left',
    rating: 4.8,
    latitude: 0.0,
    longitude: 0.0,
  ),
  ProductModel(
    id: '2',
    name: 'Artisan Bread & Pastries',
    vendorName: 'Daily Bakery',
    imageUrl: 'https://images.unsplash.com/photo-1759459981049-1a658da71c33',
    originalPrice: 17.00,
    price: 8.50,
    discountPercentage: 50,
    expiresIn: '4h left',
    rating: 4.9,
    latitude: 0.0,
    longitude: 0.0,
  ),
  ProductModel(
    id: '3',
    name: 'Organic Fruits Mix',
    vendorName: 'Fresh Corner',
    imageUrl: 'https://images.unsplash.com/photo-1623125489275-9b26bc304286',
    originalPrice: 23.00,
    price: 15.00,
    discountPercentage: 35,
    expiresIn: '6h left',
    rating: 4.7,
    latitude: 0.0,
    longitude: 0.0,
  ),
];
