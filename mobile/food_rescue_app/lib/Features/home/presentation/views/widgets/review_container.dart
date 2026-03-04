import 'package:flutter/material.dart';

class ReviewContainer extends StatelessWidget {
  const ReviewContainer({super.key, required this.child});
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom,
      ),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Padding(padding: const EdgeInsets.all(24), child: child),
    );
  }
}
