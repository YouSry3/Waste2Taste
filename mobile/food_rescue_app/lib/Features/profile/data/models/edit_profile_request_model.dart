class EditProfileRequestModel {
  final String name;
  final String? imageUrl;

  const EditProfileRequestModel({required this.name, this.imageUrl});

  Map<String, dynamic> toJson() {
    return {'FullName': name, if (imageUrl != null) 'Image': imageUrl};
  }
}
