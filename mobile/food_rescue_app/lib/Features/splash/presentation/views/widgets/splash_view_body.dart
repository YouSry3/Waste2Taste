import 'package:flutter/material.dart';
import 'package:food_rescue_app/core/utils/app_routes.dart';
import 'package:go_router/go_router.dart';
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
    _waitAndNavigate();
    super.initState();
  }

  Future _waitAndNavigate() {
    return Future.delayed(const Duration(seconds: 4), () {
      if (mounted) {
        return GoRouter.of(context).pushReplacement(AppRoutes.onboarding);
      }
    });
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
