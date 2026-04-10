import 'package:flutter/material.dart';

import '../../../../home/presentation/views/widgets/header_content.dart';

class ReviewsHeader extends StatelessWidget {
  const ReviewsHeader({super.key});

  @override
  Widget build(BuildContext context) {
    return const SliverToBoxAdapter(
      child: Padding(padding: EdgeInsets.all(24), child: HeaderContent()),
    );
  }
}
