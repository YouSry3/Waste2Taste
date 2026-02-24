import 'package:flutter/material.dart';
import 'auth_background_circles.dart';
import 'signup_view_body_components.dart';

class SignupViewBody extends StatelessWidget {
  const SignupViewBody({super.key});

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: const [AuthBackgroundCircles(), SignupViewBodyComponents()],
    );
  }
}
