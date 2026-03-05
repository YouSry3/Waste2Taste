import '../../../../core/enums/order_status.dart';

class OrderModel {
  final String id;
  final String offerId;
  final String itemTitle;
  final String vendorName;
  final String imageUrl;
  final double price;
  final OrderStatus status;
  final String pickupTime;
  final String orderDate;
  final String location;
  final String? completedDate;

  const OrderModel({
    required this.id,
    required this.offerId,
    required this.itemTitle,
    required this.vendorName,
    required this.imageUrl,
    required this.price,
    required this.status,
    required this.pickupTime,
    required this.orderDate,
    required this.location,
    this.completedDate,
  });
}

final List<OrderModel> mockActiveOrders = [
  OrderModel(
    id: "1001",
    offerId: "OFFER_01",
    itemTitle: "Fresh Pizza",
    vendorName: "Pizza Hut",
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
    price: 120.0,
    status: OrderStatus.preparing,
    pickupTime: "Today - 6:00 PM",
    orderDate: "2025-03-01",
    location: "Downtown Branch",
  ),
  OrderModel(
    id: "1002",
    offerId: "OFFER_02",
    itemTitle: "Burger Meal",
    vendorName: "McDonald's",
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
    price: 85.0,
    status: OrderStatus.ready,
    pickupTime: "Today - 7:30 PM",
    orderDate: "2025-03-02",
    location: "City Mall",
  ),
  OrderModel(
    id: "1003",
    offerId: "OFFER_03",
    itemTitle: "Grilled Chicken",
    vendorName: "KFC",
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
    price: 150.0,
    status: OrderStatus.pending,
    pickupTime: "Tomorrow - 1:00 PM",
    orderDate: "2025-03-03",
    location: "Main Street",
  ),
];
final List<OrderModel> mockHistoryOrders = [
  OrderModel(
    id: "9001",
    offerId: "OFFER_10",
    itemTitle: "Sushi Box",
    vendorName: "Sushi Master",
    imageUrl: "https://images.unsplash.com/photo-1553621042-f6e147245754",
    price: 200.0,
    status: OrderStatus.completed,
    pickupTime: "Yesterday - 5:00 PM",
    orderDate: "2025-02-20",
    location: "Downtown",
    completedDate: "2025-02-20",
  ),
  OrderModel(
    id: "9002",
    offerId: "OFFER_11",
    itemTitle: "Pasta Plate",
    vendorName: "Italian House",
    imageUrl: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3",
    price: 95.0,
    status: OrderStatus.completed,
    pickupTime: "Last Week - 3:00 PM",
    orderDate: "2025-02-15",
    location: "Mall Branch",
    completedDate: "2025-02-15",
  ),
  OrderModel(
    id: "9003",
    offerId: "OFFER_12",
    itemTitle: "BBQ Platter",
    vendorName: "Grill House",
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947",
    price: 180.0,
    status: OrderStatus.cancelled,
    pickupTime: "Cancelled",
    orderDate: "2025-02-10",
    location: "West Side",
    completedDate: "2025-02-10",
  ),
];
