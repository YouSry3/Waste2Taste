import 'package:flutter/material.dart';

enum MaterialBannerType { success, error, warning, info }

abstract class CustomMaterialBanner {
  static void show({
    required BuildContext context,
    required String message,
    MaterialBannerType type = MaterialBannerType.info,
  }) {
    Color bgColor;
    IconData icon;

    switch (type) {
      case MaterialBannerType.success:
        bgColor = Colors.green;
        icon = Icons.check_circle;
        break;

      case MaterialBannerType.error:
        bgColor = Colors.red;
        icon = Icons.error;
        break;

      case MaterialBannerType.warning:
        bgColor = Colors.orange;
        icon = Icons.warning;
        break;

      case MaterialBannerType.info:
        bgColor = Colors.blue;
        icon = Icons.info;
        break;
    }

    final messenger = ScaffoldMessenger.of(context);
    messenger.clearMaterialBanners();

    final materialBanner = MaterialBanner(
      backgroundColor: Colors.transparent,
      elevation: 0,
      forceActionsBelow: false,
      dividerColor: Colors.transparent,
      padding: EdgeInsets.zero,

      content: Center(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),

          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 420),

            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),

              decoration: BoxDecoration(
                color: bgColor,
                borderRadius: BorderRadius.circular(16),

                boxShadow: [
                  BoxShadow(
                    color: bgColor.withValues(alpha: 0.35),
                    blurRadius: 12,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),

              child: Row(
                mainAxisSize: MainAxisSize.min,

                children: [
                  Icon(icon, color: Colors.white, size: 24),

                  const SizedBox(width: 12),

                  Expanded(
                    child: Text(
                      message,

                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.w500,
                        fontSize: 14,
                      ),
                    ),
                  ),

                  const SizedBox(width: 8),

                  GestureDetector(
                    onTap: () {
                      messenger.clearMaterialBanners();
                    },

                    child: const Icon(
                      Icons.close,
                      color: Colors.white,
                      size: 20,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),

      actions: const [SizedBox.shrink()],
    );

    messenger.showMaterialBanner(materialBanner);
    Future.delayed(const Duration(seconds: 3), () {
      messenger.clearMaterialBanners();
    });
  }
}
