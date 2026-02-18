import 'package:flutter/material.dart';
import 'animated_leaf_loader.dart';
import 'leaves_background.dart';
import 'splash_logo.dart';

class SplashViewBody extends StatefulWidget {
  const SplashViewBody({super.key});

  @override
  State<SplashViewBody> createState() => _SplashViewBodyState();
}

class _SplashViewBodyState extends State<SplashViewBody> {
  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: const [
        LeavesBackground(),
        Column(
          spacing: 40,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [SplashLogo(), AnimatedLeafLoader()],
        ),
      ],
    );
  }
}
