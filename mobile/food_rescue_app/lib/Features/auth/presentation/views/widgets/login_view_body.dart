import 'package:flutter/material.dart';
import 'package:food_rescue_app/Features/auth/presentation/views/widgets/auth_background_circles.dart';
import 'login_view_body_components.dart';

class LoginViewBody extends StatelessWidget {
  const LoginViewBody({super.key});

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: const [AuthBackgroundCircles(), LoginViewBodyComponents()],
    );
  }
}
