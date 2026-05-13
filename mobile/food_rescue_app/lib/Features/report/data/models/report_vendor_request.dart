class ReportVendorRequest {
  final String orderId;
  final String issueType;
  final String description;
  final String priority;

  ReportVendorRequest({
    required this.orderId,
    required this.issueType,
    required this.description,
    required this.priority,
  });

  Map<String, dynamic> toJson() {
    return {
      'orderId': orderId,
      'issueType': issueType,
      'description': description,
      'priority': priority,
    };
  }
}
