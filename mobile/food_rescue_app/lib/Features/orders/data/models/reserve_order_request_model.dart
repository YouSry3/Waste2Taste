class ReserveOrderRequestModel {
  final String productId;
  final String pickupTime;

  ReserveOrderRequestModel({
    required this.productId,
    required this.pickupTime,
  });

  Map<String, dynamic> toJson() {
    return {
      "productId": productId,
      "pickupTime": pickupTime,
    };
  }
}
