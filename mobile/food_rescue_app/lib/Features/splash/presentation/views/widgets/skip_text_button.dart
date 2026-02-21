import 'package:flutter/material.dart';

class SkipTextButton extends StatelessWidget {
  const SkipTextButton({super.key});

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: AlignmentGeometry.centerRight,
      child: Padding(
        padding: const EdgeInsetsGeometry.only(top: 50),
        child: TextButton(onPressed: () {}, child: Text('Skip')),
      ),
    );
  }
}
