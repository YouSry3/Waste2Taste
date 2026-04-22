class EditProfileResponseModel {
  final String message;

  const EditProfileResponseModel({required this.message});

  factory EditProfileResponseModel.fromJson(Map<String, dynamic> json) {
    return EditProfileResponseModel(message: json['message']);
  }

  Map<String, dynamic> toJson() => {
    'message': message,
  };
}
