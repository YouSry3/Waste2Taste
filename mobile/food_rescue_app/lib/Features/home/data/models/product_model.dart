class ProductModel {
  final String id;
  final String title;
  final String description;
  final double price;
  final double originalPrice;
  final String discountPercentage;
  final String expiryTime;
  final String imageUrl;
  final String vendorId;
  final String vendorName;
  final double vendorRating;
  final String distance;
  final double latitude;
  final double longitude;

  ProductModel({
    required this.id,
    required this.title,
    required this.description,
    required this.price,
    required this.originalPrice,
    required this.discountPercentage,
    required this.expiryTime,
    required this.imageUrl,
    required this.vendorId,
    required this.vendorName,
    required this.vendorRating,
    required this.distance,
    required this.latitude,
    required this.longitude,
  });
  factory ProductModel.fromJson(Map<String, dynamic> json) {
    return ProductModel(
      id: json['id'].toString(),
      title: json['name'] as String,
      description: json['description'] as String? ?? '',
      price:
          double.tryParse(
            json['price'].toString().replaceAll(RegExp(r'[^0-9.]'), ''),
          ) ??
          0.0,
      originalPrice:
          double.tryParse(
            json['originalPrice'].toString().replaceAll(RegExp(r'[^0-9.]'), ''),
          ) ??
          0.0,
      discountPercentage: json['discount'] as String? ?? '0%',
      expiryTime: json['expiry'] as String,
      imageUrl: json['image'] as String,
      vendorId: json['vendorId'] as String? ?? 'unknown',
      vendorName: json['vendor'] as String,
      vendorRating: (json['rating'] as num).toDouble(),
      distance: json['distance'] as String? ?? '0 km',
      latitude: (json['latitude'] as num?)?.toDouble() ?? 30.0444,
      longitude: (json['longitude'] as num?)?.toDouble() ?? 31.2357,
    );
  }
}

final List<Map<String, dynamic>> mockProducts = [
  {
    "id": 1,
    "name": "Fresh Vegetables Bundle",
    "vendor": "Green Market",
    "image":
        "https://images.unsplash.com/photo-1748342319942-223b99937d4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHZlZ2V0YWJsZXMlMjBtYXJrZXR8ZW58MXx8fHwxNzYxMzA2NjI1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    "originalPrice": "\$21.99",
    "price": "\$12.99",
    "discount": "40%",
    'description': "Fresh assorted vegetables. Organic & locally sourced.",
    "distance": "0.8 km",
    "expiry": "2h left",
    "rating": 4.8,
  },
  {
    "id": 2,
    "name": "Artisan Bread & Pastries",
    "vendor": "Daily Bakery",
    "image":
        "https://images.unsplash.com/photo-1759459981049-1a658da71c33?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWtlcnklMjBicmVhZCUyMHBhc3RyaWVzfGVufDF8fHx8MTc2MTMyOTQyMHww&ixlib=rb-4.1.0&q=80&w=1080",
    "originalPrice": "\$17.00",
    "price": "\$8.50",
    "discount": "50%",
    'description': "Fresh assorted vegetables. Organic & locally sourced.",
    "distance": "1.2 km",
    "expiry": "4h left",
    "rating": 4.9,
  },
  {
    "id": 3,
    "name": "Organic Fruits Mix",
    "vendor": "Fresh Corner",
    "image":
        "https://images.unsplash.com/photo-1623125489275-9b26bc304286?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGZydWl0cyUyMG9yZ2FuaWN8ZW58MXx8fHwxNzYxMzI5NDIyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "originalPrice": "\$23.00",
    "price": "\$15.00",
    "discount": "35%",
    "distance": "0.5 km",
    'description': "Fresh assorted vegetables. Organic & locally sourced.",
    "expiry": "6h left",
    "rating": 4.7,
  },
];
