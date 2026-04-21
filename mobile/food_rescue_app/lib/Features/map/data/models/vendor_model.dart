class VendorModel {
  final String id;
  final String name;
  final String imageUrl;
  final double rating;
  final int reviewCount;
  final double latitude;
  final double longitude;
  final String address;

  const VendorModel({
    required this.id,
    required this.name,
    required this.imageUrl,
    required this.rating,
    required this.reviewCount,
    required this.latitude,
    required this.longitude,
    required this.address,
  });
}

final List<VendorModel> mapVendors = [
  const VendorModel(
    id: "1",
    name: "Green Market",
    imageUrl: "https://via.placeholder.com/150",
    rating: 4.5,
    reviewCount: 100,
    latitude: 30.2583,
    longitude: 31.1695,
    address: "123 Green St",
  ),
  const VendorModel(
    id: "2",
    name: "Daily Bakery",
    imageUrl: "https://via.placeholder.com/150",
    rating: 4.8,
    reviewCount: 200,
    latitude: 30.2564,
    longitude: 31.1672,
    address: "456 Bread Ln",
  ),
  const VendorModel(
    id: "3",
    name: "Cairo",
    imageUrl: "https://via.placeholder.com/150",
    rating: 4.2,
    reviewCount: 50,
    latitude: 30.033333,
    longitude: 31.233334,
    address: "789 Fruit Blvd",
  ),
];
