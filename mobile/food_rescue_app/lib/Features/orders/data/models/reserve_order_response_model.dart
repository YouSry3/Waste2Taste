class ReserveOrderResponseModel {
  final String id;
  final double totalPrice;
  final String status;
  final String createdAt;
  final String pickupTime;
  final String productName;

  ReserveOrderResponseModel({
    required this.id,
    required this.totalPrice,
    required this.status,
    required this.createdAt,
    required this.pickupTime,
    required this.productName,
  });

  factory ReserveOrderResponseModel.fromJson(Map<String, dynamic> json) {
    return ReserveOrderResponseModel(
      id: json['id'],
      totalPrice: (json['totalPrice'] as num).toDouble(),
      status: json['status'],
      createdAt: json['createdAt'],
      pickupTime: json['pickupTime'],
      productName: json['productName'],
    );
  }
}
