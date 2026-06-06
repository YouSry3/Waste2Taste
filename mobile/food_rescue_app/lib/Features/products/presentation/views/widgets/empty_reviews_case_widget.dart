import 'package:flutter/material.dart';

import '../../../../../core/extensions/app_localization_extention.dart';

class EmptyReviewsCaseWidget extends StatelessWidget {
  const EmptyReviewsCaseWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.reviews_outlined, size: 60, color: Colors.grey),
          const SizedBox(height: 12),
          Text(
            context.loc.noReviewsYet,
            style: const TextStyle(fontSize: 16, color: Colors.grey),
          ),
        ],
      ),
    );
  }
}
