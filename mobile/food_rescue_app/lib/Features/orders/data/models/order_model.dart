import '../../../../core/constants/api_urls.dart';
import '../../../../core/enums/order_status.dart';

class OrderModel {
  final String orderNumber;
  final String orderId;
  final OrderStatus status;
  final String productName;
  final String vendorName;
  final String imageUrl;
  final double price;
  final String vendorId;
  final double vendorLongitude;
  final double vendorLatitude;
  final String pickupTime;

  const OrderModel({
    required this.orderId,
    required this.orderNumber,
    required this.status,
    required this.productName,
    required this.vendorName,
    required this.imageUrl,
    required this.price,
    required this.pickupTime,
    required this.vendorId,
    required this.vendorLongitude,
    required this.vendorLatitude,
  });

  factory OrderModel.fromJson(Map<String, dynamic> json) {
    return OrderModel(
      orderId: json['orderId'] ?? '',
      orderNumber: json['orderNumber'] ?? '',
      status: _parseStatus(json['status'] ?? ''),
      productName: json['productName'] ?? '',
      vendorName: json['vendorName'] ?? '',
      imageUrl: ApiUrls.baseUrl + json['imageUrl'],
      price: (json['price'] as num?)?.toDouble() ?? 0.0,
      pickupTime: json['pickupTime'] ?? '',
      vendorId: json['vendorId'] ?? '',
      vendorLongitude: (json['longitude'] as num?)?.toDouble() ?? 0.0,
      vendorLatitude: (json['latitude'] as num?)?.toDouble() ?? 0.0,
    );
  }

  static OrderStatus _parseStatus(String statusStr) {
    switch (statusStr.toLowerCase()) {
      case 'pending':
        return OrderStatus.pending;
      case 'ready for pickup':
        return OrderStatus.readyForPickup;
      case 'completed':
        return OrderStatus.completed;
      default:
        return OrderStatus.pending;
    }
  }
}
