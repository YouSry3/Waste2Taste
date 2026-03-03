import 'package:flutter/material.dart';
import 'star_item.dart';

class RatingStars extends StatelessWidget {
  const RatingStars({super.key, required this.ratingNotifier});
  final ValueNotifier<int> ratingNotifier;

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<int>(
      valueListenable: ratingNotifier,
      builder: (context, rating, _) {
        return Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: List.generate(
            5,
            (index) => StarItem(
              index: index,
              rating: rating,
              onTap: () => ratingNotifier.value = index + 1,
            ),
          ),
        );
      },
    );
  }
}
