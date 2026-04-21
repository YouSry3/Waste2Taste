import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../../../core/constants/app_text_styles.dart';
import 'retry_button.dart';

class MapErrorWidget extends StatelessWidget {
  final String message;
  final VoidCallback onRetry;

  const MapErrorWidget({
    super.key,
    required this.message,
    required this.onRetry,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Center(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 32),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 80,
                  height: 80,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: isDark
                        ? Colors.red.shade900.withValues(alpha: 0.4)
                        : Colors.red.shade50,
                  ),
                  child: Icon(
                    Icons.location_off_rounded,
                    size: 40,
                    color: isDark ? Colors.red.shade300 : Colors.red.shade400,
                  ),
                ),
                const SizedBox(height: 20),
                Text(
                  "Location Unavailable",
                  style: AppTextStyles.body(
                    context,
                  ).copyWith(fontSize: 18, fontWeight: FontWeight.w700),
                ),
                const SizedBox(height: 8),
                Text(message, textAlign: TextAlign.center),
                const SizedBox(height: 28),
                RetryButton(onTap: onRetry),
              ],
            ),
          ),
        )
        .animate()
        .fade(duration: 600.ms)
        .moveY(begin: 40, end: 0, duration: 600.ms, curve: Curves.easeOut);
  }
}
