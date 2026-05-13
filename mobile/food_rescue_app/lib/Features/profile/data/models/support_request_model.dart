class SupportRequestModel {
  final String subject;
  final String description;

  SupportRequestModel({required this.subject, required this.description});

  Map<String, dynamic> toJson() {
    return {
      'subject': subject,
      'description': description,
    };
  }
}
