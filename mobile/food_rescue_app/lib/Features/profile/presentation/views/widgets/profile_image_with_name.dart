import 'package:flutter/material.dart';
import '../../../../../core/constants/app_colors.dart';
import '../../../../../core/constants/app_text_styles.dart';

class ProfileImagaWithName extends StatelessWidget {
  const ProfileImagaWithName({super.key, required this.name});
  final String name;
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(color: Colors.white, width: 4),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.1),
                  blurRadius: 10,
                ),
              ],
            ),
            child: CircleAvatar(
              radius: 50,
              backgroundColor: AppColors.primary,
              child: Text(
                name
                    .split(' ')
                    .map((e) {
                      return e[0];
                    })
                    .toList()
                    .take(2)
                    .join()
                    .toUpperCase(),
                style: AppTextStyles.title.copyWith(
                  fontSize: 32,
                  color: Colors.white,
                ),
              ),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            name,
            style: AppTextStyles.title.copyWith(
              fontSize: 22,
              color: AppColors.textDark,
            ),
          ),
        ],
      ),
    );
  }
}
