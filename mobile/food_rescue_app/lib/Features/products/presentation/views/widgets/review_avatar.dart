import 'package:flutter/material.dart';

class ReviewAvatar extends StatelessWidget {
  final String name;

  const ReviewAvatar({super.key, required this.name});

  @override
  Widget build(BuildContext context) {
    return CircleAvatar(
      radius: 20,
      backgroundColor: Colors.orange.withValues(alpha: .1),
      child: Text(
        name[0],
        style: const TextStyle(
          color: Colors.orange,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }
}
