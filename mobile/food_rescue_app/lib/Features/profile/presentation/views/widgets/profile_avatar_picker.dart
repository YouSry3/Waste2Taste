import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'profile_image_widget.dart';

class ProfileAvatarPicker extends StatelessWidget {
  const ProfileAvatarPicker({super.key});

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        ProfileImageWidget(name: 'name'),
        Positioned(
          bottom: 0,
          right: 0,
          child: GestureDetector(
            onTap: () {},
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
