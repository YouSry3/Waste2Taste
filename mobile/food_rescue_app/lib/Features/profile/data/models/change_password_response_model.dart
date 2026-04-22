class ChangePasswordResponseModel {
  final String message;

  ChangePasswordResponseModel({required this.message});

  factory ChangePasswordResponseModel.fromJson(Map<String, dynamic> json) =>
      ChangePasswordResponseModel(message: json['message']);
}