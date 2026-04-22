import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../../core/constants/api_urls.dart';
import 'profile_image_widget.dart';

class ProfileAvatarPicker extends StatelessWidget {
  final String? image;
  final String name;
  final File? pickedImage;
  final ValueChanged<File>? onImagePicked;

  const ProfileAvatarPicker({
    super.key,
    this.image,
    required this.name,
    this.pickedImage,
    this.onImagePicked,
  });

  Future<void> _pickImage() async {
    final ImagePicker picker = ImagePicker();
    final XFile? xFile = await picker.pickImage(source: ImageSource.gallery);
    if (xFile != null && onImagePicked != null) {
      onImagePicked!(File(xFile.path));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        ProfileImageWidget(
          name: name,
          imageUrl: image == null ? null : ApiUrls.baseUrl + image!,
          pickedImage: pickedImage,
        ),
        Positioned(
          bottom: 0,
          right: 0,
          child: GestureDetector(
            onTap: _pickImage,
            child: Container(
              padding: const EdgeInsets.all(8),
              decoration: const BoxDecoration(
                color: Color(0xFFFFA940),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                LucideIcons.camera,
                color: Colors.white,
                size: 16,
              ),
            ),
          ),
        ),
      ],
    );
  }
}
