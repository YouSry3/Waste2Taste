class ReportVendorRequest {
  final String vendorId;
  final String type;
  final String description;

  ReportVendorRequest({
    required this.vendorId,
    required this.type,
    required this.description,
  });

  Map<String, dynamic> toJson() {
    return {
      'vendorId': vendorId,
      'type': type,
      'description': description,
    };
  }
}
